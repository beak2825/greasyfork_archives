// ==UserScript==
// @name         ikcrm
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://e.ikcrm.com/customers/*?tab=load_tab_base
// @grant        none




// @downloadURL https://update.greasyfork.org/scripts/384971/ikcrm.user.js
// @updateURL https://update.greasyfork.org/scripts/384971/ikcrm.meta.js
// ==/UserScript==





window.onload = function() { /*设置在页面加载完后执行以下js代码*/
    var url = "https://e.ikcrm.com/customers/42629701?only_base_info=true&_=1559979368285"/*将连接赋到变量url中*/
    var request = new XMLHttpRequest();/*用new创建一个XHR对象*/
    request.open("GET",url);
    request.send(null);
    request.onload = function() {
        if(request.status == 200) {

            alert("ok");
            var p = document.getElementById("luck");
            p.innerHTML = "Today you are " + request.responseText;
        }
        else{


            var stylepic1 = document.getElementsByClassName('value j-text_asset_535a3f  ')[0].innerText;
            // alert(stylepic1);

            if (stylepic1.length > 5) {

                document.getElementsByClassName('value j-text_asset_535a3f  ')[0].innerHTML = "<a href='" + stylepic1 +"' target='_blank'><img src='" + stylepic1 + "' width='140' height='186' ></img> </a>";

            }



            var stylepic2 = document.getElementsByClassName('value j-text_asset_2bb83e  ')[0].innerText;
            // alert(stylepic2);

            if (stylepic2.length > 5) {

                document.getElementsByClassName('value j-text_asset_2bb83e  ')[0].innerHTML = "<a href='" + stylepic2 +"' target='_blank'><img src='" + stylepic2 + "' width='140' height='186' ></img> </a>";

            }








            var stylepic3 = document.getElementsByClassName('value j-text_asset_6ad3cc  ')[0].innerText;
            // alert(stylepic3);

            if (stylepic3.length > 5) {

                document.getElementsByClassName('value j-text_asset_6ad3cc  ')[0].innerHTML = "<a href='" + stylepic3 +"' target='_blank'><img src='" + stylepic3 + "' width='140' height='186' ></img> </a>";

            }







            var file1 = document.getElementsByClassName('value j-text_asset_f1d7c9  ')[0].innerText;
            // alert(file1);

            if (file1.length > 5) {

                document.getElementsByClassName('value j-text_asset_f1d7c9  ')[0].innerHTML = "<a href='" + file1 +"' target='_blank'><img src='" + file1 + "' width='140' height='186' ></img> </a>";

            }








            var file2 = document.getElementsByClassName('value j-text_asset_2da945  ')[0].innerText;
            // alert(file2);

            if (file2.length > 5) {

                document.getElementsByClassName('value j-text_asset_2da945  ')[0].innerHTML = "<a href='" + file2 +"' target='_blank'><img src='" + file2 + "' width='140' height='186' ></img> </a>";

            }








            var file3 = document.getElementsByClassName('value j-text_asset_a3cb93  ')[0].innerText;
            // alert(file3);

            if (file3.length > 5) {

                document.getElementsByClassName('value j-text_asset_a3cb93  ')[0].innerHTML = "<a href='" + file3 +"' target='_blank'><img src='" + file3 + "' width='140' height='186' ></img> </a>";

            }








            var file4 = document.getElementsByClassName('value j-text_asset_7f9966  ')[0].innerText;
            // alert(file4);

            if (file4.length > 5) {

                document.getElementsByClassName('value j-text_asset_7f9966  ')[0].innerHTML = "<a href='" + file4 +"' target='_blank'><img src='" + file4 + "' width='140' height='186' ></img> </a>";

            }








            var file5 = document.getElementsByClassName('value j-text_asset_4697b0  ')[0].innerText;
            // alert(file5);

            if (file5.length > 5) {

                document.getElementsByClassName('value j-text_asset_4697b0  ')[0].innerHTML = "<a href='" + file5 +"' target='_blank'><img src='" + file5 + "' width='140' height='186' ></img> </a>";

            }


        }
    }

}


