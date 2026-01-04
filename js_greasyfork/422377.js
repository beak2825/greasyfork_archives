// ==UserScript==
// @name         抽奖动态删除
// @namespace    xuanshui
// @version      0.1
// @description  删除所有抽奖动态并自动取关
// @author       xuanshui(原mscststs)
// @match        http*://space.bilibili.com/*
// @require https://greasyfork.org/scripts/38220-mscststs-tools/code/MSCSTSTS-TOOLS.js?version=713767
// @require      https://cdn.bootcss.com/axios/0.17.1/axios.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422377/%E6%8A%BD%E5%A5%96%E5%8A%A8%E6%80%81%E5%88%A0%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/422377/%E6%8A%BD%E5%A5%96%E5%8A%A8%E6%80%81%E5%88%A0%E9%99%A4.meta.js
// ==/UserScript==

// 参考：
// https://www.bilibili.com/read/cv4787009/
// https://www.bilibili.com/read/cv5065448/
// https://greasyfork.org/zh-CN/scripts/387046-%E6%8A%BD%E5%A5%96%E5%8A%A8%E6%80%81%E5%88%A0%E9%99%A4-%E5%8F%96%E5%85%B3

(function() {
    'use strict';
    let uid = window.location.pathname.split("/")[1];
    function getUserCSRF(){
		let cookies = document.cookie.split(" ");
		for(let ck of cookies){
			let key = ck.split("=")[0];
			let value = ck.split("=")[1].split(";")[0];
			if(key=="bili_jct"){
				return value;
			}
		}
	}
    let csrf_token = getUserCSRF();

    class Api{
		/*
			api部分
		*/
		constructor(){

		}
		async getFollowers(){
			let data =  await fetchJsonp("https://api.bilibili.com/x/relation/followers?jsonp=jsonp&vmid="+window.BilibiliLive.UID).then(res=>res.json());
			return data;
		}
        async space_history(offset= 0){
            let data = await this._api(`https://api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/space_history?visitor_uid=${uid}&host_uid=${uid}&offset_dynamic_id=${offset}`,{},"get")
            return data;
        }
        async rm_dynamic(id){
            let data = await this._api("https://api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/rm_dynamic",{
                dynamic_id: id,
                csrf_token: csrf_token,
            })
            return data;
        }
        async uf_user(id){//取关
            let data = await this._api("https://api.live.bilibili.com/relation/v1/Feed/SetUserFollow",{
                uid: uid,
                type: 0,
                follow: id,
                re_src: 18,
                csrf_token: csrf_token,
                csrf: csrf_token,
                visit_id: "",
            })
            return data;
        }
		async _api(url,data,method="post") {
			return axios({
				url,
				method,
				data: data,
				transformRequest: [function (data) {
					// Do whatever you want to transform the data
					let ret = '';
					for (let it in data) {
						ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&';
					}
					return ret;
				}],
				withCredentials: true,
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			}).then(function (res) {
				return res.data;
			});
		}

	}

    let api = new Api();
    let buttons = [".deleteAll",".deleteRepost",".unfollowAll"]; //初始化 button 列表
    let logNode={};
    let whiteList = [];

    async function init(){ //初始化panel

        let shijiao = await mscststs.wait(".h-version-state",true,100);
        if(!shijiao || shijiao.innerText != "我自己"){
            console.log(`当前不是自己的个人动态`)
            return ;
        } //判断当前是否是自己的动态页面

        await mscststs.wait("#page-dynamic");//等待进入该页面


        await mscststs.wait("#page-dynamic .col-2");
        let node = document.createElement("div");
        node.className="msc_panel";
        node.innerHTML = `<div class="inner"><button class="deleteAll">删除所有抽奖动态</button><br><button class="deleteRepost">删除所有转发动态</button><br><button class="unfollowAll">取关所有</button> <div class="log"></div></div>`
        document.querySelector("#page-dynamic .col-2").append(node); //插入节点

        //实例化buttons
        buttons = buttons.map((b)=>{
            return document.querySelector(b);
        });
        logNode = document.querySelector(".msc_panel .log");


        //绑定事件
        document.querySelector(".deleteAll").addEventListener("click",async function(e){
            disableAll();
            //在这里删除所有抽奖动态并取关
            let deleteCount = 0;
            let unfollowCount = 0;
            let has_more = 1;
            let offset = 0;
            let follow = {};
            while(has_more){
                let rq = await api.space_history(offset);
                let data = rq.data;
                has_more = data.has_more;
                for(let card of data.cards){
                    offset = card.desc.dynamic_id_str
                    if(card.desc.orig_dy_id){
                        //该动态是转发动态
                        try{
                            let content = JSON.parse(card.card);
                            if(content.origin_extension && content.origin_extension.lott &&content.origin_extension.lott.indexOf("lottery_id")>=0){
                                //是互动抽奖

                                //删除动态
                                let rm = await api.rm_dynamic(card.desc.dynamic_id_str);
                                if(rm.code === 0){
                                    //删除成功
                                    deleteCount++;
                                }else{
                                    throw new Error("删除出错")
                                }
                                // //取消关注，这里需要使用直播间的取关接口
                                // if(follow[content.origin_user.info.uid]){
                                //     //已经删除过
                                // }else{

                                //     let uf = await api.uf_user(content.origin_user.info.uid);
                                //     if(uf.code===0){
                                //         follow[content.origin_user.info.uid] = 1;
                                //         unfollowCount++;
                                //         //取关成功
                                //     }else{
                                //         throw new Error("取关出错")
                                //     }
                                // }
                                // await mscststs.sleep(50); //延时
                                // log(`已删除 ${deleteCount} 条 ，取关 ${unfollowCount} 个)

                                await mscststs.sleep(50); //延时
                                log(`已删除 ${deleteCount} 条“互动抽奖”动态 ，用户转发动态未删除，取关功能已阉割`)
                            }
                        }catch(e){
                            console.log(e);

                            break;
                        }
                    }
                }
            }

            enableAll();
        })

        document.querySelector(".deleteRepost").addEventListener("click",async function(e){
            log(`该“删除所有转发动态”功能已阉割，如需使用请修改脚本`)
            // disableAll();
            
            // 在这里删除所有转发动态并取关
            // let deleteCount = 0;
            // let unfollowCount = 0;
            // let has_more = 1;
            // let offset = 0;
            // let follow = {};
            // while(has_more){
            //     let rq = await api.space_history(offset);
            //     if(rq.code==-22){
            //         alert("过于频繁，请稍等几分钟再次运行");
            //         break;
            //     }
            //     let data = rq.data;
            //     has_more = data.has_more;
            //     for(let card of data.cards){
            //         offset = card.desc.dynamic_id_str
            //         if(card.desc.orig_dy_id){
            //             //该动态是转发动态
            //             try{
            //                 let content = JSON.parse(card.card);
            //                 if(1){
            //                     //

            //                     //删除动态
            //                     let rm = await api.rm_dynamic(card.desc.dynamic_id_str);
            //                     if(rm.code === 0){
            //                         //删除成功
            //                         deleteCount++;
            //                     }else{
            //                         throw new Error("删除出错")
            //                     }
            //                     // 取消关注，这里需要使用直播间的取关接口
            //                     if(content.origin_user && !follow[content.origin_user.info.uid]){
            //                         let uf = await api.uf_user(content.origin_user.info.uid);
            //                         if(uf.code===0){
            //                             follow[content.origin_user.info.uid] = 1;
            //                             unfollowCount++;
            //                             //取关成功
            //                         }else{
            //                             throw new Error("取关出错")
            //                         }
            //                     }
            //                     await mscststs.sleep(50); //延时
            //                     log(`已删除 ${deleteCount} 条 ，取关 ${unfollowCount} 个`)
            //                 }
            //             }catch(e){
            //                 console.log(e);
            //                 break;
            //             }
            //         }
            //     }
            // }

            // enableAll();
        })

        document.querySelector(".unfollowAll").addEventListener("click",async function(e){
            log(`该“取关所有”功能已阉割，如需使用请修改脚本`)
            // disableAll();
            // //在这里取关所有
            // let deleteCount = 0;
            // let unfollowCount = 0;
            // let has_more = 1;
            // let offset = 0;
            // let follow = {};
            // let rq = await api.space_history(offset);

            // for(let attention of rq.data.attentions.uids){
            //     if(attention == uid){
            //         continue;
            //     }
            //     let uf = await api.uf_user(attention);
            //     if(uf.code===0){
            //         unfollowCount++;
            //         //取关成功
            //     }else{
            //         alert("取关出错,可能是过于频繁,请稍后再试")
            //         break;
            //     }
            //     await mscststs.sleep(50); //延时
            //     log(`已取关 ${unfollowCount} 个`)

            // }

            // enableAll();
        })
    }
    function log(word){
        logNode.innerText = word;
    }
    function disableAll(){
        buttons.forEach(b=>{
            b.disabled = true;
        })
    }
    function enableAll(){
        buttons.forEach(b=>{
            b.disabled = false;
        })
    }
    init();
})();