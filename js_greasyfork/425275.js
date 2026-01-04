// ==UserScript==
// @name         Start测试用例系统优化
// @namespace    https://greasyfork.org/
// @version      1.7
// @description  Start测试用例系统模态框非常鬼畜，离得很远，非常不好操作，于是做了个优化插件。本插件同时支持自动填写统计数据自查的平台、区服、用户ID。
// @author       JMRY
// @match        http*://start.rjoy.com/*
// @grant        none
// @require      https://greasyfork.org/scripts/415581-jquery%E5%BA%93/code/jquery%E5%BA%93.js?version=866373
// @require      https://greasyfork.org/scripts/422934-jquery-dom/code/JQuery%20DOM.js?version=908887
// @downloadURL https://update.greasyfork.org/scripts/425275/Start%E6%B5%8B%E8%AF%95%E7%94%A8%E4%BE%8B%E7%B3%BB%E7%BB%9F%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/425275/Start%E6%B5%8B%E8%AF%95%E7%94%A8%E4%BE%8B%E7%B3%BB%E7%BB%9F%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

let Version=[
     {
        version:`1.7`,
        descryption:[
            `修复一键全部通过功能会遗漏部分用例的bug。`,
        ]
     },{
        version:`1.6`,
        descryption:[
            `优化一键全部通过功能模态框的显示效果，避免过度闪屏。`,
        ]
     },
      {
        version:`1.5`,
        descryption:[
            `优化一键全部通过功能执行时长，修复速度过快时导致部分用例漏过的bug。`,
        ]
     },
     {
        version:`1.4`,
        descryption:[
            `加入自动填写统计自查平台、区服、用户ID功能。`,
            `优化一键全部通过功能执行时长。`,
        ]
     },
     {
        version:`1.3`,
        descryption:[
            `加入一键全部通过功能（时长依用例数量而定）。`,
        ]
     },
     {
        version:`1.2`,
        descryption:[
            `加入一键通过功能。`,
            `由于有了一键通过，不再需要，因此去除编辑面板宽度修改。`,
        ]
    },
    {
        version:`1.1`,
        descryption:[
            `修复打开编辑面板时，宽度错误的bug。`,
        ]
    },
    {
        version:`1.0`,
        descryption:[
            `最初版本`,
        ]
    },
]

function getCaseRunModal(){
    let ant_modal_root=$(`.ant-modal-root`);
    if(ant_modal_root.length<2){
        return null;
    }
    for(let i=0; i<ant_modal_root.length; i++){
        let cur_ant_modal_root=ant_modal_root.eq(i);
        let ant_modal_content=cur_ant_modal_root.find(`.ant-modal-content`);
        if(
            ant_modal_content.children().length==4 &&
            ant_modal_content.children(`button`).length==1 &&
            ant_modal_content.children(`div`).length==3
        ){
            //return cur_ant_modal_root.find(`.ant-modal-content`);
            return ant_modal_content;
        }
    }
    return null;
}

function setCaseRunCSS(modal){
    modal.css({
        opacity:0.1,
        //marginLeft:`70%`,
        //marginTop:`10%`,
    });
}

function clearCaseRunCSS(){
    $(`.ant-modal-content`).css({
        marginLeft:`auto`,
    });
}

let checkboxClickLock=false;
function changeDefaultRadio(modal){
    if(!checkboxClickLock){
        let checkboxList=modal.find(`input[type="radio"]`);
        let checkboxNotPass=modal.find(`input[type="radio"][value="0"]`);
        let checkboxPass=modal.find(`input[type="radio"][value="1"]`);
        let checkboxPass_label=checkboxPass.parent().parent();
        if(checkboxNotPass.attr(`checked`)){
            console.log(`Find UnPassed Case`);
            checkboxPass_label.trigger(`click`);
            checkboxClickLock=true;
        }
    }
}

function oneKeyPass(){
    //一键自动完成
    if($(`#oneKey_all`).length<=0){
        let saveBu=$(`.ant-btn.ant-btn-primary`);
        for(let i=0; i<saveBu.length; i++){
            let curSaveBu=saveBu.eq(i);
            if(curSaveBu.html()==`<span>保 存</span>`){
                curSaveBu.after(`<button id="oneKey_all" class="ant-btn">一键通过</button>`);
                break;
            }
        }
        $(`#oneKey_all`).bind(`click`,function(e){
            oneKeyPassAll();
        });
    }
    let a=$(`a`);
    for(let i=0; i<a.length; i++){
        let cur_a=a.eq(i);
        if(cur_a.html()==`<span>编辑</span>`){
            cur_a.html(`<span>编辑</span><button id="oneKey_${i}" class="ant-btn oneKeyBu">通过</button>`);

            $(`#oneKey_${i}`).bind(`click`,{index:i},function(e){
                console.log(e.data.index);
                setTimeout(()=>{
                    let okbtn=$(`.ant-modal-content .ant-modal-footer .ant-btn-primary`);
                    if(okbtn.html()==`<span>确 定</span>`){
                        okbtn.click();
                    }
                },250);
            });
        }
    }
}

async function wait(n){
    return new Promise(resolve=>{
        setTimeout(()=>{
            resolve();
        },n);
    });
}

async function oneKeyPassAll(){
    let oneKeyBu=$(`.oneKeyBu`);
    for(let i=0; i<oneKeyBu.length; i++){
        $(`#oneKey_all`).html(`${i+1} / ${oneKeyBu.length} 一键通过`);
        let curOneKeyBu=oneKeyBu.eq(i);
        curOneKeyBu.click();
        let caseModal=getCaseRunModal();
        if(caseModal!=null){
            setCaseRunCSS(caseModal);
            await wait(250);
            changeDefaultRadio(caseModal);
        }
        await wait(250);
    }
}

function getAntdInputID(div_id,is_zone){
    let antdHtml=$(`div#${div_id}`).find(`.ant-select-selection-selected-value`).html();
    //[17] 江山美人
    try{
        if(is_zone){
            return antdHtml;
        }
        return antdHtml.split(` `)[0].replace(`[`,``).replace(`]`,``);
    }catch(e){
        return null;
    }
}

function getHash(key){
    //#/index/search/check_data?&game_id=17&big_app_id=17004000&sub_app_id=17004002
    try{
        let search=window.location.hash.split(`?`)[1].split(`&`);
        let search_obj={};
        for(let i=0; i<search.length; i++){
            let curSearch=search[i];
            let searchKey=curSearch.split(`=`)[0];
            let searchVal=curSearch.split(`=`)[1];
            if(curSearch==``){
                continue;
            }
            search_obj[searchKey]=searchVal;
            if(searchKey==key){
                return searchVal;
            }
        }
        if(key==undefined){
            return search_obj;
        }else{
            return null;
        }
    }catch(e){
        return null;
    }
}

let url_params=getHash();
let inputAlreadyFilled=false;
function statisticDataOptimize(){
    let cur_url=window.location.href;
    if(!cur_url.includes(`search/check_data`)){
        return false;
    }
    statisticDataOptimize2();
    return;

    //此处的参数为默认载入参数，由Antd处理
    try{
        url_params.game_id=getAntdInputID(`game_id`);
        url_params.big_app_id=getAntdInputID(`big_app_id`);
        url_params.sub_app_id=getAntdInputID(`sub_app_id`);
    }catch(e){}
    //ZoneID由于React的机制，无法自动填写处理
    //url_params.zone_id=getAntdInputID(`zone_id`);
    //url_params.costom_zone_id=$(`#costom_zone_id`).val();
    //url_params.user_id=$(`#user_id`).val();

    //为了防止一开始就覆盖url配置，因此采用输入框变化时才修改此字段
    //更新URL的自定义区服
    $(`#costom_zone_id`).bind(`change`,function(){
        url_params.costom_zone_id=$(`#costom_zone_id`).val();
    });

    //更新URL的用户ID
    $(`#user_id`).bind(`change`,function(){
        url_params.user_id=$(`#user_id`).val();
    });

    let isParamReady=true;
    let url_queryString=`http://start.rjoy.com/#/index/search/check_data?`;
    for(let key in url_params){
        if(url_params[key]!=``){
            url_queryString+=`&${key}=${url_params[key]}`;
        }
        if(url_params[key]==null){
            isParamReady=false;
        }
    }
    //改写URL但不跳转。isParamReady判定输入框、选择框是否成功载入，如果成功载入，才改写URL，防止出现参数丢失
    if(isParamReady){
        history.pushState({},null,url_queryString);
    }

    //自动填写自定义区服ID和用户ID
    //为了避免首次填写后，输入框被Antd重置，因此采用Interval循环写入，直到点击输入框（focus事件触发）时，才会停止写入。
    //由于Antd手动填写输入框无效，因此停用此功能。
    /*
    if(!inputAlreadyFilled){
        if($(`#costom_zone_id`).length>0){
            $(`#costom_zone_id`).val(getHash(`costom_zone_id`)==null?``:getHash(`costom_zone_id`));
        }
        if($(`#user_id`).length>0){
            $(`#user_id`).val(getHash(`user_id`)==null?``:getHash(`user_id`));
        }
    }
    $(`#costom_zone_id, #user_id`).bind(`focus`,function(){
        inputAlreadyFilled=true;
    });
    */
}

let isInsert=false;
function statisticDataOptimize2(){
    if(isInsert){
        return;
    }
    if($(`.ant-form-horizontal`).length>0){
        showStatisticMod(true);
        isInsert=true;
    }
}

function showStatisticMod(bool){
    return;
	if(bool==false){
		$(`.statisticMod`).remove();
		$(`.dataForm`).remove();
	}else{
		$(`head`).appendDOM(`style`,{class:`statisticMod`},`
			body{
				overflow:hidden;
			}
			.dataForm{
				position:fixed;
				top:155px;
				left:calc(256px + 24px);
				right:24px;
				bottom:0px;
				background:#FFF;
				filter:drop-shadow(0px 0px 2px #000);
				padding:32px;
			}
			.closeBu{
				position:absolute;
				top:0px;
				right:0px;
				border:1px solid transparent;
				outline:none;
				background:transparent;
				transition:all ease 0.25s;
			}
			.closeBu:hover{
				border:1px solid #999;
			}
			.inputForm{
				width:192px;
				margin-right:32px;
				margin-bottom:16px;
			}
		`);

		let rootEl=$(`.ant-form-horizontal`);
		rootEl.appendDOM(`div`,{
			id:`dataForm`,class:`dataForm`,children:[
				{tag:`button`,attr:{
					id:`closeBu`,class:`closeBu`,html:`×`,bind:{
						click(){
							showStatisticMod(false);
						}
					}
				}},
				{tag:`div`,attr:{
					class:`selectZone`,children:[
						{tag:`span`,attr:{html:`游戏：`}},{tag:`input`,attr:{id:`input_game_id`,class:[`inputForm`,`game_id`],bind:{focus:{data:{id:`input_game_id`},function(e){showSelector(e.data.id)}}}}},
						{tag:`span`,attr:{html:`大平台：`}},{tag:`input`,attr:{id:`input_big_app_id`,class:[`inputForm`,`big_app_id`],bind:{focus:{data:{id:`input_big_app_id`},function(e){showSelector(e.data.id)}}}}},
						{tag:`span`,attr:{html:`子平台：`}},{tag:`input`,attr:{id:`input_sub_app_id`,class:[`inputForm`,`sub_app_id`],bind:{focus:{data:{id:`input_sub_app_id`},function(e){showSelector(e.data.id)}}}}},
						{tag:`span`,attr:{html:`区服ID：`}},{tag:`input`,attr:{id:`input_zone_id`,class:[`inputForm`,`zone_id`],bind:{focus:{data:{id:`input_zone_id`},function(e){showSelector(e.data.id)}}}}},
						{tag:`span`,attr:{html:`<br>自定义区服ID：`}},{tag:`input`,attr:{id:`input_costom_zone_id`,class:[`inputForm`,`costom_zone_id`]}},
						{tag:`span`,attr:{html:`角色ID：`}},{tag:`input`,attr:{id:`input_gameUserId`,class:[`inputForm`,`gameUserId`]}},
						{tag:`span`,attr:{html:`日期：`}},{tag:`input`,attr:{id:`input_check_date`,class:[`inputForm`,`check_date`],value:getCurrentDate(),bind:{focus:{data:{id:`input_check_date`},function(e){showSelector(e.data.id)}}}}},
						{tag:`button`,attr:{html:`查询`,class:`ant-btn ant-btn-primary submitBu`,bind:{
							click(){
								queryStatisticData();
							}
						}}}
					]
				}}
			]
		});
	}
}

function showSelector(id){
	console.log(id);
}

function queryStatisticData(){
	console.log(`query`)
}

function getCurrentDate(){
	function dateFormat(fmt, date) {
		let ret;
		const opt = {
			"Y+": date.getFullYear().toString(),        // 年
			"m+": (date.getMonth() + 1).toString(),     // 月
			"d+": date.getDate().toString(),            // 日
			"H+": date.getHours().toString(),           // 时
			"M+": date.getMinutes().toString(),         // 分
			"S+": date.getSeconds().toString()          // 秒
			// 有其他格式化字符需求可以继续添加，必须转化成字符串
		};
		for (let k in opt) {
			ret = new RegExp("(" + k + ")").exec(fmt);
			if (ret) {
				fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
			};
		};
		return fmt;
	}
	return dateFormat("YYYY-mm-dd", new Date());
}

(function() {
    'use strict';
    console.log(`Start Optimize`);
    setInterval(()=>{
        let caseModal=getCaseRunModal();
        if(caseModal!=null){
            //setCaseRunCSS(caseModal);
            changeDefaultRadio(caseModal);
        }else{
            checkboxClickLock=false;
            //clearCaseRunCSS();
        }

        //选择框可选定功能
        $(`.ant-select-selection, .ant-select-selection-selected-value`).css(`user-select`,`text`);

        //一键通过功能
        oneKeyPass();

        //统计数据优化功能
        statisticDataOptimize();
    },100);
})();