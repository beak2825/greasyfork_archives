// ==UserScript==
// @name         南宁师范大学自动教评
// @namespace    自动教评
// @version      1.2
// @description  QQ 592530326 752381473
// @author       毛工程师
// @match        http://210.36.80.160/jsxsd/xspj/*
// @grant        none
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
//@rewritten_script_code javascript
// @downloadURL https://update.greasyfork.org/scripts/406350/%E5%8D%97%E5%AE%81%E5%B8%88%E8%8C%83%E5%A4%A7%E5%AD%A6%E8%87%AA%E5%8A%A8%E6%95%99%E8%AF%84.user.js
// @updateURL https://update.greasyfork.org/scripts/406350/%E5%8D%97%E5%AE%81%E5%B8%88%E8%8C%83%E5%A4%A7%E5%AD%A6%E8%87%AA%E5%8A%A8%E6%95%99%E8%AF%84.meta.js
// ==/UserScript==
var $ = $ || window.$;
var url = window.location.href;
var qwe ="";
(function() {
    qwe=url.split("?");
    if(qwe[0]=="http://210.36.80.160/jsxsd/xspj/xspj_list.do"){
        window.showModalDialog = function(a,b,c){
            window.open(a);
        }
    }
    if (qwe[0] == "http://210.36.80.160/jsxsd/xspj/xspj_edit.do") {
        console.log(localStorage.getItem("A"), localStorage.getItem("B"));
        var a = document.getElementById("table1");
        if(localStorage.getItem("A")=="null"||localStorage.getItem("A")==null || localStorage.getItem("B")=="null"||localStorage.getItem("B")==null){

           }else{
               for (var i = 0; i < a.children[0].children.length; i++) {
            if (i == a.children[0].children.length - 2) {
                var b = localStorage.getItem("B");
                b= parseInt(b)*2;
                a.children[0].children[i].children[1].children[b].checked = true;
                console.log(i);
            } else {
                var c = localStorage.getItem("A");
                c= parseInt(c)*2;
                if (a.children[0].children[i].children[1].children[0] != undefined) {
                    console.log(i);
                    a.children[0].children[i].children[1].children[c].checked = true;
                }
            }
        }
        document.getElementById("issubmit").value = "1";
        document.getElementById("Form1").submit();
        localStorage.removeItem('A');
        localStorage.removeItem('B');
           }
    }

})();
window.onload = function(){
    qwe=url.split("?");
    if(qwe[0]=="http://210.36.80.160/jsxsd/xspj/xspj_list.do"){
        var newItem2 = '<div id="sbjssb" style="width: 100%;text-align: center;"><p style="color: red;font-size: 20px;">请选择默认教评的选项</p>'+
            '<p><span>默认选项'+
            '<lable><input type="radio" name="radioA" value="0" >A</lable>'+
            '<lable><input type="radio" name="radioA" value="1" >B</lable>'+
            '<lable><input type="radio" name="radioA" value="2" >C</lable>'+
            '<lable><input type="radio" name="radioA" value="3" >D</lable>'+
            '<lable><input type="radio" name="radioA" value="4" >E</lable></span></p>'+
            '<p><span>最后一项'+
            '<lable><input type="radio" name="radioB" value="0">A</lable>'+
            '<lable><input type="radio" name="radioB" value="1">B</lable>'+
            '<lable><input type="radio" name="radioB" value="2">C</lable>'+
            '<lable><input type="radio" name="radioB" value="3">D</lable>'+
            '<lable><input type="radio" name="radioB" value="4">E</lable></span></p>'+
            '<p><button type="button" id="zdjpBt" >开始教评</button>    '+
            '</div><script>'+
            'var zdjpBt=$("#zdjpBt");'+
            'zdjpBt.attr("onClick","test()");'+
            'function test(){'+
            'var url = window.location.href;'+
            'var qwe = url.split("?");'+
            'var Asq = $("input[name=\'radioA\']:checked").val();'+
            'var Bsq = $("input[name=\'radioB\']:checked").val();'+
            'if(Asq==undefined || Bsq == undefined){ '+
            'alert("默认选项或者最后一项未选择"); '+
            ' return; '+
            '    } '+
            'if (qwe[0] == "http://210.36.80.160/jsxsd/xspj/xspj_list.do") {'+
            ' var pjinfo = document.getElementById("dataList");'+
            'var a_pj = pjinfo.getElementsByTagName("a");'+
            ' var q = 0;'+
            ' for (var e = 0; e < a_pj.length; e++) {'+
            '  if (a_pj[e].innerText == "评价") {'+
            '  q++;'+
            '  if(q>0){'+
            '  a_pj[e].click();'+
            '  localStorage.setItem("A", $("input[name=\'radioA\']:checked").val());'+
            '  localStorage.setItem("B", $("input[name=\'radioB\']:checked").val());'+
           '  }'+
            ' }'+
            ' }'+
            '  console.log(Asq, Bsq,q);'+
            ' }'+
            '}'+
            '</script>';
        var newItem=document.createElement("DIV");
        newItem.id="Dzdpj";
        var list=document.getElementsByTagName("body");
        list[0].insertBefore(newItem,list[0].childNodes[8]);
        $('#Dzdpj').append(newItem2);
    }
}
