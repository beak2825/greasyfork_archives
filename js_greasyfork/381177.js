// ==UserScript==
// @namespace    none
// @version      1.2
// @description  伊莉論壇方便在瀏覽器看漫畫(也可以用手機)
// @author       malagege
// @name 伊莉看漫畫(翻頁)
// @namespace Violentmonkey Scripts
// @match http://*.eyny.com/thread-*
// @grant none
// @icon http://www.eyny.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/381177/%E4%BC%8A%E8%8E%89%E7%9C%8B%E6%BC%AB%E7%95%AB%28%E7%BF%BB%E9%A0%81%29.user.js
// @updateURL https://update.greasyfork.org/scripts/381177/%E4%BC%8A%E8%8E%89%E7%9C%8B%E6%BC%AB%E7%95%AB%28%E7%BF%BB%E9%A0%81%29.meta.js
// ==/UserScript==
(function(){

    function isMobile() {
        var check = false;
        (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
        return check;
    };

    if( isMobile() ){
        if(document.readyState == "complete"){
            newWin();
        }else{
            alert("等所有資源載入完!!將開啟視窗");
            window.addEventListener('load',newWin);
        }
    }else{
        var button = document.createElement("button");
        button.id = 'see_btn_1';
        button.innerHTML = '看漫畫(翻頁)';
        document.querySelector('#pgt').appendChild(button);
        document.querySelector('#see_btn_1').addEventListener('click', function(){
            if(document.readyState == "complete"){
                newWin();
            }else{
                alert("等所有資源載入完!!將開啟視窗");
                window.addEventListener('load',newWin);
            }
        });
    }
    function newWin(){
        var MyWindow = window.open();
        MyWindow.document.writeln('<pre>');
        var images = document.querySelectorAll('.pcb img:not([src^="static/image/common/"])');
        [...images].forEach( v => {
            let vv = v.cloneNode(true);
            MyWindow.document.body.append(vv);
            vv.style = {};
        });
        MyWindow.document.close();
        MyWindow.document.body.innerHTML += `
        <meta name="viewport" content="width=device-width; initial-scale=1.0; maximum-scale=1.0; user-scalable=0;">
        <div class="left"></div>
        <div class="right"></div>
        <style>
        body{
            display: grid;
            height:100vh;
            justify-content: safe center;
            align-content: safe center;
            padding: 0px;
            margin: 0px;
        }
        img{
            display: none;
        }
        .now {
            display: block;
            /* max-height:100vh; */
            /* width: auto; */
             max-width: 100vw;
             height:auto;
        }
        .left{
            width: 300px;
            max-width: 35%;
            height: 100vh;
            position:fixed;
            top: 0px;
            left:0px;
        }
        .right{
            width:300px;
            max-width: 35%;
            height:100vh;
            position:fixed;
            right:0px;
            top: 0px;
        }
        </style>`;
        function movePage(page){
            if ( i+page < 0 || i+page == images.length){
                MyWindow.alert("已經沒有頁面");
                return false;
            }
            MyWindow.document.body.scrollTop = 0 ;
            MyWindow.document.querySelector('.now').classList.remove('now');
            i = i+page;
            MyWindow.document.images[i].classList.add('now');
        }
        var i = 0;
        MyWindow.document.images[0].classList.add('now');

        MyWindow.document.querySelector('.left').addEventListener( 'click', () => movePage(-1) );
        MyWindow.document.querySelector('.right').addEventListener( 'click' , () => movePage(+1) );

        MyWindow.document.addEventListener('keydown', function(event) {
            const key = event.key;
            if(event.key == "ArrowLeft") {
                movePage(-1);
            }else if(event.key == "ArrowRight"){
                movePage(+1);
            }
        });
    }
})();