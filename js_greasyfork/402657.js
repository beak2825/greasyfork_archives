// ==UserScript==
// @name         Steam Useless Tools
// @namespace    sourcewater
// @version      0.0.0.42
// @description  Steam Useless Tools Lite
// @author       sourcewater
// @match        https://steamdb.info/freepackages/*
// @match        https://store.steampowered.com/wishlist/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/402657/Steam%20Useless%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/402657/Steam%20Useless%20Tools.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let steamWL=/store\.steampowered\.com\/wishlist\//;
    let steamDB=/steamdb\.info\/freepackages\//;

    if(steamDB.test(window.location.href)){
        let cssStyle=document.createElement("style");
        cssStyle.innerHTML=`
		#s_s_s_s_sub_id_code{
		    background-color: rgb(33, 49, 69);
		    font-size: 13px;
		    tab-size: 4;
		    padding: 16px;
		    overflow: auto;
		    line-height: 1.45;
		    display: block;
		    border-radius: 3px;
		    resize: vertical;
		    width: 100%;
		    height: 100px;
		}
		#s_s_s_s_get_50_button{
			background-color: rgb(200, 200, 200);
			color: #4183c4;
			padding:0px 8px;
			margin-bottom: 15px;
		}
		#s_s_s_s_generate_time{
			background-color: rgba(0, 0, 0, .1);
			color: #4183c4;
			padding:0px 15px;
			margin-left: 40px;
			margin-bottom: 15px;
		    border-radius: 3px;
			display:inline-block;
			font-weight: 700;
			line-height: 20px;
			position: relative;
			vertical-align: middle;
		}
	`;
        document.head.appendChild(cssStyle);

        function getText(f){
            return f.toString().replace(/^[^\/]+\/\*!?\s?/, '').replace(/\*\/[^\/]+$/, '');
        }

        function get50Packages(){
            let MAX = 50;
            let filter = ["457006", "456460", "454806", "454721", "445544", "437745", "436810", "434733", "434732", "434731", "434730", "429618", "421842", "421841", "416688", "415626","317216","401909","283761","402707","144870","254268","187344","465801","465392","467545","465899","463811","459545","441688","402280","461577","474478","443459","474546","467043","479427","484165","484880","481743","482609","486250","487525","487467","493991","494609","492746","493667","498531","494146","505547","507302","462552","512562","512034","514957","515262","516770","529521","529514","529508","529492","529541","529540","529539","529538","529537","529536","529535","529534","529533","529532","529531","529530","529529","529528","529527","529526","529525","529524","529523","529522","529521","529520","529519","529518","529514","529513","529512","529511","529510","529509","529508","529504","529503","529502","529501","529500","529499","529498","529497","529496","529495","529494","529493"];
            let packages = document.getElementsByClassName("package");
            let subids = [];
            for (let i = 0, j = 0; i < packages.length && j < MAX; ++i) {
                let subid = packages[i].firstElementChild.innerHTML.trim();
                if (filter.findIndex((value) => subid === value) < 0) {
                    subids[j++] = subid;
                }
            }
            let subidCode=document.querySelector("#s_s_s_s_sub_id_code");
            subidCode.innerHTML=subids.join(",");
            subidCode.setAttribute("style","");
            subidCode.focus();
            subidCode.select();
            document.execCommand("copy");
            let timeSpan=document.querySelector("#s_s_s_s_generate_time");
            timeSpan.setAttribute("style","");
            function twoDigit(str){
                str = parseFloat(str).toString() == "NaN" ? str : str.toString();
                return str.length==1 ? "0"+str :str;
            }
            let date=new Date();
            timeSpan.innerHTML=`${twoDigit(date.getHours())}:${twoDigit(date.getMinutes())}:${twoDigit(date.getSeconds())}`;
        }

        let get50PackagesEle=document.createElement("script");
        get50PackagesEle.innerHTML=getText(get50Packages);
        let loading=document.getElementById("loading");
        let panel=document.createElement("div");
        panel.setAttribute("class","panel");
        let get50Button=document.createElement("button");
        get50Button.setAttribute("id","s_s_s_s_get_50_button");
        get50Button.setAttribute("class","remove btn btn-link");
        get50Button.innerHTML=`Get 50 Packages`;
        let subidCode=document.createElement("textarea");
        subidCode.setAttribute("id","s_s_s_s_sub_id_code");
        subidCode.setAttribute("style","display:none;");
        let timeSpan=document.createElement("span");
        timeSpan.setAttribute("id","s_s_s_s_generate_time");
        timeSpan.setAttribute("style","display:none;");
        panel.innerHTML+=get50Button.outerHTML+timeSpan.outerHTML;
        panel.innerHTML+=subidCode.outerHTML+get50PackagesEle.outerHTML;
        loading.outerHTML+=panel.outerHTML;
        document.querySelector("#s_s_s_s_get_50_button").addEventListener("click",function(e){get50Packages();});
    }else if(steamWL.test(window.location.href)){
        let itId=setInterval(function(){
            let wlcc=document.querySelector("#esi-wishlist-chart-content");
            if(wlcc){
                wlcc.parentNode.removeChild(wlcc);
                wlcc=null;
                clearInterval(itId);
            }
        },200);
    }
})();