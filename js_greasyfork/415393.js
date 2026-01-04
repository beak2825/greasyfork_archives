// ==UserScript==
// @name         Hello_VIP_Service
// @namespace    Hello_VIP_Service
// @description  申诉审核过程帮助
// @homepageURL  https://greasyfork.org/zh-CN/scripts/415393-hello-vip-service
// @version      1.23
// @include      https://manage-oss.bigo.tv/*
// @include      https://global-oss*
// @grant        GM.xmlHttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_log
// @connect      oapi.dingtalk.com
// @connect      jinshuju.net
// @run-at       document-idle
// @author       zhousanfu
// @copyright    2020 zhousanfu@hellofun.cn
// @downloadURL https://update.greasyfork.org/scripts/415393/Hello_VIP_Service.user.js
// @updateURL https://update.greasyfork.org/scripts/415393/Hello_VIP_Service.meta.js
// ==/UserScript==


window.onload = function() {
    var totalCount = 0;
    if (window.location.href.indexOf("bigoOperation/svip/tasks") >= 0) {
        setInterval(function(){
            location.reload()
        }, 1000 * 60 * 5);
        setInterval(function(){
            console.log("10----svip" + totalCount)
            console.log(totalCount)
            $.getJSON('https://manage-oss.bigo.tv/bigoOperation/svip/task-list?page=1&per-page=20&c_etime=&status=2&op=UDB&udb=1',function(data){
                totalCount = data.data.pages.totalCount;
            });
            if (totalCount > 0){
                notifyMe("UDB处理中-紧急解封", "https://manage-oss.bigo.tv/bigoOperation/svip/tasks");
            }
        }, 1000 * 60);
    };

    var record_totalCount = 0;
    if (window.location.href.indexOf("welog/act36291") >= 0) {
        setInterval(function(){
            console.log("welog/act36291")
            $.post('https://manage-oss.bigo.tv/welog/act36291/ajax-get-exchange-record-list',{status:"1",type_id:"1615974708", begin_time:format(new Date(), '-'), page:"1", size:"10", total:"83"},function(data){
                var json_data = eval('(' + data + ')').data.list
                console.log(json_data)
                for (var i=0;i<json_data.length;i++){
                    if(json_data[i].status == 3){
                        record_totalCount += 1
                    }
                }
                console.log(record_totalCount)
            });
            if (record_totalCount > 0){
                notifyMe("LIKEE SVIP UDB紧急工单==" + record_totalCount + "条", "https://manage-oss.bigo.tv/welog/act36291/exchange-record");
                record_totalCount = 0;
            }
        }, 1000 * 60 * 10);
    }

    if (window.location.href.indexOf("appeal/index") >= 0) {


        setTimeout(function() {
            sleep(500).then(() => {
                if(document.querySelector("#app > section > section > section > main > div > div.ant-row > div.col.ant-col.ant-col-xs-20.ant-col-xl-13.ant-col-xl-offset-1 > div > div.tabs > button:nth-child(1)")){
                    document.querySelector("#app > section > section > section > main > div > div.ant-row > div.col.ant-col.ant-col-xs-20.ant-col-xl-13.ant-col-xl-offset-1 > div > div.tabs > button:nth-child(1)").click();
                    console.log("1")
                }
            });

            sleep(500).then(() => {
                console.log("li-1")
                var linode_1 = document.createElement('div');
                linode_1.id = 'linode_1';
                linode_1.style.height = 'auto';
                linode_1.style.width = '33%';
                linode_1.style.float = 'left';
                linode_1.style.display = 'inline';
                linode_1.innerHTML = document.getElementsByClassName('col ant-col ant-col-xs-20 ant-col-xl-13 ant-col-xl-offset-1')[0].innerHTML;
                document.getElementsByClassName('ant-table-content')[0].appendChild(linode_1);
            });

            sleep(500).then(() => {
                if(document.querySelector("#app > section > section > section > main > div > div.ant-row > div.col.ant-col.ant-col-xs-20.ant-col-xl-13.ant-col-xl-offset-1 > div > div.tabs > button:nth-child(2)")){
                    document.querySelector("#app > section > section > section > main > div > div.ant-row > div.col.ant-col.ant-col-xs-20.ant-col-xl-13.ant-col-xl-offset-1 > div > div.tabs > button:nth-child(2)").click();
                    console.log("2")
                }
            });

            sleep(500).then(() => {
                console.log("li-2")
                var linode_2 = document.createElement('div');
                linode_2.id = 'linode_2';
                linode_2.style.height = 'auto';
                linode_2.style.width = '33%';
                linode_2.style.float = 'left';
                linode_2.style.display = 'inline';
                console.log(document.getElementsByClassName('col ant-col ant-col-xs-20 ant-col-xl-13 ant-col-xl-offset-1')[0]);
                linode_2.innerHTML = document.getElementsByClassName('col ant-col ant-col-xs-20 ant-col-xl-13 ant-col-xl-offset-1')[0].innerHTML;
                document.getElementsByClassName('ant-table-content')[0].appendChild(linode_2);
            });

            sleep(500).then(() => {
                if(document.querySelector("#app > section > section > section > main > div > div.ant-row > div.col.ant-col.ant-col-xs-20.ant-col-xl-13.ant-col-xl-offset-1 > div > div.tabs > button:nth-child(3)")){
                    document.querySelector("#app > section > section > section > main > div > div.ant-row > div.col.ant-col.ant-col-xs-20.ant-col-xl-13.ant-col-xl-offset-1 > div > div.tabs > button:nth-child(3)").click();
                    console.log("3")
                }
            });

            sleep(500).then(() => {
                console.log("li-3")
                var linode_3 = document.createElement('div');
                linode_3.id = 'linode_3';
                linode_3.style.height = 'auto';
                linode_3.style.width = '33%';
                linode_3.style.float = 'left';
                linode_3.style.display = 'inline';
                linode_3.innerHTML = document.getElementsByClassName('col ant-col ant-col-xs-20 ant-col-xl-13 ant-col-xl-offset-1')[0].innerHTML;
                document.getElementsByClassName('ant-table-content')[0].appendChild(linode_3);
            });
        },500);

        setInterval(function(){
            try {
                var li_d1 = document.querySelector("#linode_1 > div > div.video-container.ant-spin-nested-loading");
                var li_d2 = document.querySelector("#linode_2 > div > div:nth-child(3)");
                var li_d3 = document.querySelector("#linode_3 > div > div.user-appeal");
                var r_d1 = document.querySelector("#app > section > section > section > main > div > div.ant-row > div.col.ant-col.ant-col-xs-20.ant-col-xl-13.ant-col-xl-offset-1 > div > div.video-container.ant-spin-nested-loading");
                var r_d2 = document.querySelector("#app > section > section > section > main > div > div.ant-row > div.col.ant-col.ant-col-xs-20.ant-col-xl-13.ant-col-xl-offset-1 > div > div.anchor-container.ant-spin-nested-loading");
                var r_d3 = document.querySelector("#app > section > section > section > main > div > div.ant-row > div.col.ant-col.ant-col-xs-20.ant-col-xl-13.ant-col-xl-offset-1 > div > div.user-appeal");

                li_d1.innerHTML = r_d1.innerHTML;
                li_d2.innerHTML = r_d2.innerHTML;
                li_d3.innerHTML = r_d3.innerHTML;
            } catch (e) {
                console.log("li 替换 r error")
            }
        }, 1000);


        document.onkeydown = onKeyDown;
        function onKeyDown() {
            //Q81,w87,e69,r82
            if(window.event.keyCode == 81){
                document.querySelector("#app > section > section > section > main > div > div.ant-row > div.action-col.ant-col.ant-col-xs-4.ant-col-xl-3.ant-col-xl-offset-1 > div > div > button:nth-child(2)").click();
                setTimeout(function() {
                    document.querySelector("div.ant-modal-wrap > div > div.ant-modal-content > div > div > div.ant-modal-confirm-btns > button.ant-btn.ant-btn-primary").click();
                    //location.reload();
                },100)
            }
            else if(window.event.keyCode == 87){
                document.querySelector("#app > section > section > section > main > div > div.ant-row > div.action-col.ant-col.ant-col-xs-4.ant-col-xl-3.ant-col-xl-offset-1 > div > div > button:nth-child(3)").click();
                setTimeout(function() {
                    document.querySelector("div.ant-modal-wrap > div > div.ant-modal-content > div > div > div.ant-modal-confirm-btns > button.ant-btn.ant-btn-primary").click();
                    //location.reload();
                },100)
            }
            else if(window.event.keyCode == 69){
                document.querySelector("#app > section > section > section > main > div > div.ant-row > div.action-col.ant-col.ant-col-xs-4.ant-col-xl-3.ant-col-xl-offset-1 > div > div > button:nth-child(4)").click();
                setTimeout(function() {
                    document.querySelector("div.ant-modal-wrap > div > div.ant-modal-content > div > div > div.ant-modal-confirm-btns > button.ant-btn.ant-btn-primary").click();
                    //location.reload();
                },100)
            }
            else if(window.event.keyCode == 82){
                document.querySelector("#app > section > section > section > main > div > div.ant-row > div.action-col.ant-col.ant-col-xs-4.ant-col-xl-3.ant-col-xl-offset-1 > div > div > button:nth-child(5)").click();
                setTimeout(function() {
                    document.querySelector("div.ant-modal-wrap > div > div.ant-modal-content > div > div > div.ant-modal-confirm-btns > button.ant-btn.ant-btn-primary").click();
                    //location.reload();
                },100)
            }
        }
    }


    function sleep (time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    };
};


// 位数不足两位补全0
function supplement(nn){
    return nn = nn < 10 ? '0' + nn : nn;
}


//当前时间
function format(Date,str){
    var obj = {
        Y: Date.getFullYear(),
        M: Date.getMonth() + 1,
        D: Date.getDate(),
        H: Date.getHours(),
        Mi: Date.getMinutes() - 600,
        S: Date.getSeconds()
    }
    // 拼接时间 hh:mm:ss
    var time = ' ' +supplement(obj.H) + ':' + supplement(obj.Mi) + ':' + supplement(obj.S);
    // yyyy-mm-dd
    if(str.indexOf('-') > -1){
        return obj.Y + '-' + supplement(obj.M) + '-' + supplement(obj.D) + time;
    }
    // yyyy/mm/dd
    if(str.indexOf('/') > -1){
        return obj.Y + '/' + supplement(obj.M) + '/' + supplement(obj.D) + time;
    }
}


// 提示
function notifyMe(nf_title, nf_url) {
    var notification;
    var audioElementHovertree;

    Notification.requestPermission();
    notification = new Notification('工单出现了', {
        body: nf_title,
        icon: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1608614849194&di=881bc8df09a40f1fa5fb78c744377a3f&imgtype=0&src=http%3A%2F%2Ftm-image.qccip.com%2FqcctmImage%2Fb7d48cbab0729ed316994c20e8e0ede9.jpg',
        silent: 'true',
        sound: 'http://vcast-resource.cdn.bcebos.com/vcast-resource/5ddffc43-fb32-4a17-94e9-95a06071a79e.mp3',
        data: { url: nf_url }
    });

    //notification.onshow = function () {
    notification.onclick = function(){
        window.focus();//打开通知notification相关联的tab窗口
        //$('audio').remove();
        //audioElementHovertree = document.createElement('audio');
        //audioElementHovertree.setAttribute('src', 'http://vcast-resource.cdn.bcebos.com/vcast-resource/5ddffc43-fb32-4a17-94e9-95a06071a79e.mp3');
        //audioElementHovertree.setAttribute('autoplay', 'autoplay'); //打开自动播放
    };

    // notification.onclick = function(){
    //     window.open(notification.data.url, '_blank');
    //     notification.close();
    // };
    //setTimeout(function() {notification.close();}, 30000);
};







