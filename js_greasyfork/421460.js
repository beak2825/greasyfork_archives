// ==UserScript==
// @name          Line封鎖檢查
// @version         1.1
// @description   Line封鎖檢查程式
// @author              郭小義
// @match               https://store.line.me/stickershop/product/*/zh-Hant
// @grant               none
// @namespace           LineChcekblockade
// @downloadURL https://update.greasyfork.org/scripts/421460/Line%E5%B0%81%E9%8E%96%E6%AA%A2%E6%9F%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/421460/Line%E5%B0%81%E9%8E%96%E6%AA%A2%E6%9F%A5.meta.js
// ==/UserScript==


(
    function() {


        window.addEventListener('load', () => {

            var Mydiv = document.createElement("div");
            Mydiv.id="Mydiv";
            Mydiv.align="center";

            var MdLYR01BoxX = document.getElementsByClassName("MdLYR01Box")[1];
            var MdLYR03Head = document.getElementsByClassName("MdLYR03Head")[0];
            MdLYR03Head.appendChild(Mydiv);

            addButton('檢查封鎖', checkblockade);

        })

    }
)();

//========================================================


function sjf(Testtableid_mdBtn05Txt,i,toUserMid) {
    Testtableid_mdBtn05Txt[i].innerHTML="無法確認";
    $.ajax({
        async: true,
        type: "get",
        url: "/stickershop/presentConfirm",
        cache:true,
        data: {
            toUserMid:toUserMid,
            packageId:eventValue
        },
        success: function (result) {

            if(result=='desktop/presentConfirm'){
                Testtableid_mdBtn05Txt[i].innerHTML="OK";
            }else if(result.indexOf("已有相同的")!=-1){
                Testtableid_mdBtn05Txt[i].innerHTML="可能被封鎖";
            }else{
                Testtableid_mdBtn05Txt[i].innerHTML="無法確認";
            }
        },
    });
}

function checkblockade() {

    var MdLYR01BoxX = document.getElementsByClassName("MdLYR01Box")[1];
    var Testtableid_mdBtn05Txt=MdLYR01BoxX.getElementsByClassName("mdBtn05Txt");
    var Testtableid_mdLYR08Img=MdLYR01BoxX.getElementsByClassName("mdLYR08Img");
    var Testtableid_mdLYR08Txt=MdLYR01BoxX.getElementsByClassName("mdLYR08Txt");

    var FLis;
    $.ajax({
        async: false,
        type: "get",
        url: "/api/present/friends/zh-Hant",
        data: {
        },
        success: function (result) { FLis=result; }
    });

    for (var i=0;i<Testtableid_mdBtn05Txt.length;i++){

        var result= FLis.filter(function(item) {

            if (item.imageUrl==null ){

                if(item.name==Testtableid_mdLYR08Txt[i].innerHTML){
                    return true;
                }

            }else if(item.imageUrl==Testtableid_mdLYR08Img[i].getElementsByTagName("img")[0].src){
                return true;
            }

        });
        if(result.length>0){
            sjf(Testtableid_mdBtn05Txt,i,result[0].midCrypted)
        }else{
            Testtableid_mdBtn05Txt[i].innerHTML="無法確認";
        }

        //

    }

}



function addButton(text, onclick, cssObj) {

    cssObj = cssObj || {position: 'relative', bottom: '20%','z-index': 3 ,width:'100px',height:'30px'}
    let button = document.createElement('button'), btnStyle = button.style


    document.getElementById("Mydiv").appendChild(button)
    button.innerHTML = text
    button.onclick = onclick
    Object.keys(cssObj).forEach(key => btnStyle[key] = cssObj[key]);
    return button

}









