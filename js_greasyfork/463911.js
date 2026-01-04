// ==UserScript==
// @name         补资源-evolve
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  补满资源-新增按钮在设置页导入导出部分
// @author       wind9876
// @match        https://g8hh.github.io/evolve/
// @match        https://pmotschmann.github.io/Evolve/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/463911/%E8%A1%A5%E8%B5%84%E6%BA%90-evolve.user.js
// @updateURL https://update.greasyfork.org/scripts/463911/%E8%A1%A5%E8%B5%84%E6%BA%90-evolve.meta.js
// ==/UserScript==
/*
  说明：
  在设置页导入导出部分增加了一个补充资源按钮，点击此按钮即可。
  如果资源常满，在太空阶段未发现超铀时可能不自动派船，导致不能发现超铀，请关闭自动供能手工派船
*/
(function($) {
    'use strict';
    //对特定已有建筑(至少1层)直接增到100，默认为不处理建筑
    let add_Buildling = false;
    //基础建筑随便列了一些
    let bas_bulid = ["library","trade","temple","bank","university","amphitheatre","casino","hospital","boot_camp",
                 "warehouse","storage_yard","shed","garrison","oil_depot","gateway_depot","wharf","apartment","cottage","basic_housing",
                 "cargo_yard","farm","mill","factory","foundry","smelter","metal_refinery","mine","coal_mine","oil_well",
                 "wardenclyffe","biolab","oil_power","fission_power","tourist_center","satellite","propellant_depot","gps","garage",
                 "ziggurat","luxury_condo",
                 ];
    //工匠制品
    let craft_resource = ["Plywood","Brick","Wrought_Iron","Sheet_Metal","Mythril","Aerogel","Nanoweave","Scarletite","Quantium"];
    function traverse_add(ori,data) {
    	let aa ={};
		if (add_Buildling && bas_bulid.indexOf(ori)!=-1 && data.count >0 && data.count<100){
            //将列出建筑在已有层数但不够100时直接设置为100层
            data.count =100;
		}
	  	if(data.amount>=0 && (data.max>Math.max(data.amount,0) || data.max ==-1 )) {
		   	if(craft_resource.indexOf(ori)!=-1 && 'crates' in data
			   	&& data.max ==-1 && data.display && data.amount>=0 && data.amount<9000000000 ){
			   	//工匠制品直接到9G
			   	data.amount=9000000000;
		   	}else if(data.max>0 && data.amount>=0 && data.amount < data.max){
			   	//其他有最大值的都认为是资源补满(包括人口)
			   	data.amount = data.max;
		   	}
        }
        //给总督分配箱子任务
		if(ori=="tasks" && data.t0 =="none" && data.t1=="none"){
			data.t0="storage";
			data.t1="bal_storage";
		}
        //尖塔进度设置为99
		if(ori=="spire" && data.count>0 && data.progress>0){
			data.progress=99.99;
		}
        //补充补给
		if(ori=="purifier" && data.supply >0 &&data.supply<data.sup_max){
			data.supply=data.sup_max;
		}
        //灵魂石直接拉到一定量
		if(ori=="Soul_Gem" && data.display==true && data.amount <10000){
			data.amount =10000;
		}
		for (let key in data) {
			if (typeof(data[key]) == 'object' && Object.prototype.toString.call(data[key]).toLowerCase() == "[object object]" && !data[key].length) {
                aa[key] = traverse_add(key,data[key])
			}else{
                aa[key] = data[key];
			}
		}
		return aa;
	}
    function buildfillImport(){
        let importExportNode = $(".importExport").last();
        if (importExportNode === null) {
            return;
        }
        if (document.getElementById("script_fillres") !== null) {
            return;
        }
        importExportNode.append(' <button id="script_fillres" class="button">补充资源</button>');
        $('#script_fillres').on("click", ()=> {
            let impbtn=importExportNode.find("button")[0];
            let expbtn=importExportNode.find("button")[1];
            if((impbtn==null||expbtn==null)||(impbtn.innerText!="导入存档" && impbtn.innerText!="import")||(expbtn.innerText!="导出存档" && expbtn.innerText!="export")){
                return;
            }
            expbtn.click();
            expbtn.click();
            let decodesavejson = $.parseJSON(LZString.decompressFromBase64($("#importExport").val()));
            if(decodesavejson==null){
               return;
            }
            let encodedata = LZString.compressToBase64(JSON.stringify(traverse_add("traverse_add",decodesavejson)));
            $('#importExport').val(encodedata);
            impbtn.click();
        });
    }
    buildfillImport();
 })(jQuery);