// ==UserScript==
// @name         bilibiliAutoGetRedpocket
// @namespace    https://iconquestion.github.io/
// @version      1.09
// @description  Auto get bilibili livestreaming redpocket from recommendation page
// @author       iconquestion
// @match        https://live.bilibili.com/run
// @icon         https://live.bilibili.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/456853/bilibiliAutoGetRedpocket.user.js
// @updateURL https://update.greasyfork.org/scripts/456853/bilibiliAutoGetRedpocket.meta.js
// ==/UserScript==

//对应fetch的异步特点，在每个关键的fetch子节点上使用sleep方式延迟发起请求（延迟到足以让上一个fetch请求完成），同时利于避免请求过于规律被检测
var csrf = document.cookie.match(/(?<=bili_jct=).+?(?=;)/)[0];

function getredpocket() {
    var uids = [];
        // 1.轮询各个分区的第1页
    for (var pagenum = 1; pagenum < 14; pagenum++) {
        console.log('正在检查分区：'+pagenum);
        fetch('https://api.live.bilibili.com/xlive/web-interface/v1/second/getList?platform=web&parent_area_id=' + pagenum + '&page=1', {
            method: 'GET',
            headers: {
                'Accept': 'application/json, text/plain, */*',
            }

        }).then(function(res) {
            return res.json();
        }).then(function(jsondata) {
            //sleep!
            sleep(Math.random()*300).then(function(){
            jsondata.data.list.forEach(function(ele, eleindex) {
                // 2.对所获数据进行处理
                if ((ele.pendant_info[1] && ele.pendant_info[1].content == '红包') || (ele.pendant_info[2] && ele.pendant_info[2].content == '红包')) {

                    // 3.记录符合房间的信息
                    uids.push(ele.uid);

                    console.log('Find Room id: ' + ele.roomid);
                    console.log('  uid: ' + ele.uid);
                    console.log('  titles: ' + ele.title);

                    // 4.发起GET请求，检测红包状态并提取对应的lot_id
                    fetch('https://api.live.bilibili.com/xlive/lottery-interface/v1/lottery/getLotteryInfoWeb?roomid=' + ele.roomid, {
                        method: 'GET',
                        credentials:'include',
                        headers: {
                            'Accept': 'application/json, text/plain, */*',
                            //required
                        }
                    }).then(function(res) {
                        return res.json();
                    }).then(function(jsondata) {
                        //sleep!
                        sleep(Math.random()*200).then(function(){
                            console.log('Room :'+ele.roomid+'  Status: '+jsondata.data.popularity_red_pocket[0].user_status);
                            //如果没有红包，popularity_red_pocket属性值null；
                            //如果有红包，popularity_red_pocket中会存在lot_id属性，
                            if (jsondata.data.popularity_red_pocket&&jsondata.data.popularity_red_pocket[0].user_status==2) {
                                var lotid = jsondata.data.popularity_red_pocket[0].lot_id;
                                // 5.请求参与红包活动
                                fetch('https://api.live.bilibili.com/xlive/lottery-interface/v1/popularityRedPocket/RedPocketDraw', {
                                    method: 'POST',
                                    credentials: 'include',
                                    headers: {
                                        'Content-Type': 'application/x-www-form-urlencoded',
                                    },
                                    body: 'ruid=' + ele.uid + '&room_id=' + ele.roomid + '&lot_id=' + lotid + '&spm_id=444.8.red_envelope.extract&jump_from=&session_id=&csrf=' + csrf + '&visit_id='
                                }).then(function(res) {
                                    return res.json();
                                }).then(function(jsondata) {
                                    console.log('TargetRoomId: '+ele.roomid+'  TargetLotId: ' + lotid+'  Status: '+jsondata.code+'  StatusText: '+jsondata.message);
                                    //sleep!
                                    sleep(5000+Math.random()*1000).then(function(){
                                            // 6.移动所有自动关注的up到特定分组内（之后用其他脚本批量取关hhh）
                                            fetch('https://api.bilibili.com/x/relation/tags/addUsers?cross_domain=true',{
                                            method:'post',
                                            credentials:'include',
                                            headers:{
                                                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                                            },
                                            body:'fids='+ele.uid+'&tagids=443505&csrf='+csrf
                                            }).then(function(res){
                                                return res.json();
                                            }).then(function(jsondata){
                                                console.log('  Moving uid: '+ele.uid+'  Status: '+jsondata.code+'  StatusText: '+jsondata.message);
                                            })
                                    });
                                
                                })
                            }
                        })

                    })
                }
            })
    })})
    }
    //产生间隔，准备下一次循环执行
    sleep(8000).then(function(){
        var waterdrop=80000+Math.random()*100000;


        //插入另一个js!!!
        var unfollowedMsgNum = 0;
    fetch('https://api.vc.bilibili.com/session_svr/v1/session_svr/single_unread', {
        method: 'GET',
        credentials: 'include',
    }).then(function(res) {
        return res.json();
    }).then(function(jsondata) {
        unfollowedMsgNum = jsondata.data.unfollow_unread + jsondata.data.unfollow_push_msg + jsondata.data.follow_unread;
        console.log(unfollowedMsgNum + ' unread msg(s)');
        //获取未读信息发件人talker_id
        if (unfollowedMsgNum) {
            console.log('Working...');
            var talkerIds = [];
            fetch('https://api.vc.bilibili.com/session_svr/v1/session_svr/get_sessions?session_type=1&sort_rule=2', {
                method: 'GET',
                credentials: 'include'
            }).then(function(res) {
                return res.json();
            }).then(function(jsondata) {
                jsondata.data.session_list.forEach(function(ele, eleindex) {
                    if (ele.unread_count) {
                        talkerIds.push(ele.talker_id);
                    }
                })
                //批量确认消息已读
                var csrftoken = document.cookie.match(/(?<=bili_jct=).+?(?=;)/)[0];
                for (var i = 0; i < talkerIds.length; i++) {
                    console.log('Marking id: ' + talkerIds[i]);
                    fetch('https://api.vc.bilibili.com/session_svr/v1/session_svr/update_ack', {
                        method: 'POST',
                        mode: 'no-cors',
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'Referer': 'https://message.bilibili.com/',
                            'Origin': '',
                            'Accept': 'application/json, text/plain, */*'
                        },
                        body: 'talker_id=' + talkerIds[i] + '&session_type=1&csrf=' + csrftoken
                    });
                }
            })
        }
    })
    console.info('---间隔时间: '+waterdrop+'ms---');
    console.info('   ');
        setTimeout(getredpocket,waterdrop);
    })

}

getredpocket();

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}