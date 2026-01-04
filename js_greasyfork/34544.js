// ==UserScript==
// @name         Kone SupplierWeb包装一键分配
// @namespace    https://greasyfork.org/zh-CN/scripts/34541-kone-supplierweb包装一键分配
// @version      1.2
// @match        *://kone.anionline.com/despatching/packagebasedshipping/createpackages.rails
// @description  用于通力供应商订单发运，在创建包装界面实现一键自动分配
// @author       成都中翊丁伟
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/34544/Kone%20SupplierWeb%E5%8C%85%E8%A3%85%E4%B8%80%E9%94%AE%E5%88%86%E9%85%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/34544/Kone%20SupplierWeb%E5%8C%85%E8%A3%85%E4%B8%80%E9%94%AE%E5%88%86%E9%85%8D.meta.js
// ==/UserScript==

(function() {

    var div1 = document.getElementById("child-content");
    var div2 = document.createElement("div");
    var h3=document.createElement("h3");
    var txt=document.createElement("textarea");

    div2.setAttribute("class","ui-widget-content ui-corner-all");
    h3.setAttribute("class","content_title ui-widget-header ui-corner-top");

    h3.innerHTML="此处输入JSON文本，用来表达每个包装的长、宽、高、皮重、净重等参数";
    txt.name="shipjson";
    //txt.cols="125";
    txt.style.width = "100%";
    txt.rows="10";

    div2.appendChild(h3);
    div2.appendChild(txt);
    div1.appendChild(div2);



    var btn=$("input[value='分配建议']")[0];
    btn.onclick=function(){

        if(txt.value == ""){
            alert("请输入规范的JSON文本");
            return;
        }

        var shipjsonobj = eval('(' + txt.value + ')');

        function sortByKey(array, key) {
            return array.sort(function(a, b) {
                var x = a[key]; var y = b[key];
                return ((x < y) ? -1 : ((x > y) ? 1 : 0));
            });
        }


        for (var i = 1; i <= Shipping.Unpackaged.length; i++) {
            document.getElementsByName("desadv.package."+i+".5717")[0].value=540;
            document.getElementsByName("desadv.package."+i+".400")[0].value=7;
            document.getElementsByName("desadv.package."+i+".154")[0].value="Electro Mechanical";
            Shipping.ValidateAndCalcGross(i);
            document.getElementsByName("desadv.package."+i+".156")[0].value="电气机械部分";
            Shipping.ValidateAndCalcGross(i);
            document.getElementsByName("desadv.package."+i+".159")[0].value=shipjsonobj[i-1].a;
            Shipping.ValidateAndCalcGross(i);
            document.getElementsByName("desadv.package."+i+".160")[0].value=shipjsonobj[i-1].b;
            Shipping.ValidateAndCalcGross(i);
            document.getElementsByName("desadv.package."+i+".161")[0].value=shipjsonobj[i-1].c;
            Shipping.ValidateAndCalcGross(i);
            document.getElementById("tareweight_"+i).value=shipjsonobj[i-1].d;
            Shipping.ValidateAndCalcGross(i);
            document.getElementById("netweight_"+i).value=shipjsonobj[i-1].e;
            Shipping.ValidateAndCalcGross(i);
        };


        Shipping.Unpackaged = sortByKey(Shipping.Unpackaged, '252F');
        Shipping.CreateProposal();
        alert("已完成分配");
    };


})();
