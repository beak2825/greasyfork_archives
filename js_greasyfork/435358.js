// ==UserScript==
// @name         FB助手_UTM
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world!
// @author       Saker
// @match        https://business.facebook.com/adsmanager/manage/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/435358/FB%E5%8A%A9%E6%89%8B_UTM.user.js
// @updateURL https://update.greasyfork.org/scripts/435358/FB%E5%8A%A9%E6%89%8B_UTM.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    function parseBetween(beginString, endString, originalString) {
        var beginIndex = originalString.indexOf(beginString);
        if (beginIndex === -1) {
            return null;
        }
        var beginStringLength = beginString.length;
        var substringBeginIndex = beginIndex + beginStringLength;
        var substringEndIndex = originalString.indexOf(endString, substringBeginIndex);
        if (substringEndIndex === -1) {
            return null;
        }
        return originalString.substring(substringBeginIndex, substringEndIndex);
    }
    function autocomplete(inp, arr) {
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function(e) {
      var a, b, i, val = this.value;
      /*close any already open lists of autocompleted values*/
      closeAllLists();
      if (!val) { return false;}
      currentFocus = -1;
      /*create a DIV element that will contain the items (values):*/
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      /*append the DIV element as a child of the autocomplete container:*/
      this.parentNode.appendChild(a);
      /*for each item in the array...*/
      for (i = 0; i < arr.length; i++) {
        /*check if the item starts with the same letters as the text field value:*/
        if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
          /*create a DIV element for each matching element:*/
          b = document.createElement("DIV");
          /*make the matching letters bold:*/
          b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
          b.innerHTML += arr[i].substr(val.length);
          /*insert a input field that will hold the current array item's value:*/
          b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
          /*execute a function when someone clicks on the item value (DIV element):*/
          b.addEventListener("click", function(e) {
              /*insert the value for the autocomplete text field:*/
              inp.value = this.getElementsByTagName("input")[0].value;
              /*close the list of autocompleted values,
              (or any other open lists of autocompleted values:*/
              closeAllLists();
          });
          a.appendChild(b);
        }
      }
  });
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function(e) {
      var x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
        currentFocus++;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 38) { //up
        /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
        currentFocus--;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 13) {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        e.preventDefault();
        if (currentFocus > -1) {
          /*and simulate a click on the "active" item:*/
          if (x) x[currentFocus].click();
        }
      }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
      closeAllLists(e.target);
  });
}
     Date.prototype.format = function(fmt) {
         var o = {
             "M+" : this.getMonth()+1,
             "d+" : this.getDate(),
             "h+" : this.getHours(),
             "m+" : this.getMinutes(),
             "s+" : this.getSeconds(),
             "q+" : Math.floor((this.getMonth()+3)/3),
             "S" : this.getMilliseconds()
         };
         if(/(y+)/.test(fmt)) {
             fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
         }
         for(var k in o) {
             if(new RegExp("("+ k +")").test(fmt)){
                 fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
             }
         }
         return fmt;
     }
    function get_type(){
       var type=parseBetween("manage/","?",document.location.href);
       return type;
    }
    function get_fb_time(){
        try{
          if(document.getElementsByClassName("_1uz0")[0].textContent.split(":")[1]!=undefined){
              var fb_time=document.getElementsByClassName("_1uz0")[0].textContent.split(":")[1];
          }else{
              fb_time=document.getElementsByClassName("_1uz0")[0].textContent;
          }
          fb_time=fb_time.replace("Note","")
          var fb_start=Date.parse(fb_time.substr(0, fb_time.indexOf('–')).replace(/^\s+|\s+$/g,""));
          var fb_end=Date.parse(fb_time.substring(fb_time.indexOf('–') + 1).replace(/^\s+|\s+$/g,""));
          fb_start=new Date(fb_start).format("yyyy-MM-dd");
          fb_end=new Date(fb_end).format("yyyy-MM-dd");
          if(fb_start.indexOf("NaN")!=-1){
             fb_start=fb_end;
          }else if(fb_end.indexOf("NaN")!=-1){
            fb_end=fb_start;
          }
          console.log("FB时间:"+fb_start+"-"+fb_end)
          return {
            "from":fb_start
            ,"to":fb_end
          };
        }catch(e){
          console.log(e)
        }
    }
    function http_post(url,data){
        let details = {
                method: 'POST',
                responseType: 'json',
                timeout: 10000,
                url: url,
                data: data,
                onload: function (res) {
                    if (res.status === 200) {
                        switch (res.response.code) {
                            case 0:
                                GM_notification("接受数据失败", "注意");
                                break;
                            case 1:
                                if(url.indexOf("sitelist")!=-1){
                                  GM_setValue('sites',res.responseText);
                                }else{
                                  GM_setValue('utmdata',res.responseText)
                                }
                                break;
                            default:
                                console.log(res.response);
                                return res.responseText;
                                break;
                        }
                    } else {
                        GM_notification('发生错误！'+res.responseText, "注意");
                        console.error(res);
                    }
                },
                ontimeout: (res) => {
                    GM_notification("连接接口超时，请确认网络通畅！", "注意");
                    console.error(res);
                },
                onerror: (res) => {
                    GM_notification("连接接口错误，请重试！", "注意");
                    console.error(res);
                }
            };
        try {
          GM_xmlhttpRequest(details);
       } catch (error) {
          console.error(error);
      }
    }
    let dom=`
    <div style="display: flex;align-items: center;">
    <div>
        <form autocomplete="off">
        <div class="autocomplete" style="width:300px;">
           <input id="myInput" type="text" name="myCountry" placeholder="Domain">
        </div>
        <input type="button" id="mybtn" value="提交">
        </form>
        <style>
        .autocomplete {
  position: relative;
  display: inline-block;
}

input {
  border: 1px solid transparent;
  background-color: #f1f1f1;
  padding: 10px;
  font-size: 16px;
}

input[type=text] {
  background-color: #f1f1f1;
  width: 100%;
}

input[type=button] {
  background-color: DodgerBlue;
  color: #fff;
  cursor: pointer;
}

.autocomplete-items {
  position: absolute;
  border: 1px solid #d4d4d4;
  border-bottom: none;
  border-top: none;
  z-index: 99;
  /*position the autocomplete items to be the same width as the container:*/
  top: 100%;
  left: 0;
  right: 0;
}

.autocomplete-items div {
  padding: 10px;
  cursor: pointer;
  background-color: #fff;
  border-bottom: 1px solid #d4d4d4;
}

/*when hovering an item:*/
.autocomplete-items div:hover {
  background-color: #e9e9e9;
}

/*when navigating through the items using the arrow keys:*/
.autocomplete-active {
  background-color: DodgerBlue !important;
  color: #ffffff;
}
            .dropbtn {
                background-color: #63be09;
                color: white;
                padding: 10px 16px;
                font-size: 16px;
                border: none;
                cursor: pointer;
            }

            .dropbtn:hover,
            .dropbtn:focus {
                background-color: #3e8e41;
            }

            #myInput {
                background-size: 16px;
                box-sizing: border-box;
                background-image: url(https://www.w3schools.com/howto/searchicon.png);
                background-position: 14px 8px;
                background-repeat: no-repeat;
                font-size: 0.875rem;
                padding: 8px 20px 8px 45px;
                border: none;
                border-bottom: 1px solid #ddd;
            }

            #myInput:focus {
                outline: 3px solid #ddd;
            }

            .dropdown {
                position: relative;
                display: inline-block;
            }

            .dropdown-content {
                display: none;
                position: absolute;
                background-color: #f6f6f6;
                min-width: 230px;
                overflow: auto;
                border: 1px solid #ddd;
                z-index: 1;
            }

            .dropdown-content a {
                color: black;
                padding: 8px;
                text-decoration: none;
                display: block;
                font-size: 0.875rem;
            }

            .dropdown a:hover {
                background-color: #ddd;
            }

            .show {
                display: block;
            }
        </style>
    </div>

    <div style="display: flex;align-items: center;margin-left: 20px;">
        <span class="fkloq7h8 raq0z4z6" style="margin-right: 10px;">Turn on to track:</span>
        <label class="switch"><input type="checkbox">
            <span class="slider round" id="track_utm" ></span>
        </label>
        <style>
            .switch {
                position: relative;
                display: inline-block;
                width: 60px;
                height: 34px;
            }

            .switch input {
                opacity: 0;
                width: 0;
                height: 0;
            }

            .slider {
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: #ccc;
                -webkit-transition: .4s;
                transition: .4s;
            }

            .slider:before {
                position: absolute;
                content: "";
                height: 26px;
                width: 26px;
                left: 4px;
                bottom: 4px;
                background-color: white;
                -webkit-transition: .4s;
                transition: .4s;
            }

            input:checked+.slider {
                background-color: #2196F3;
            }

            input:focus+.slider {
                box-shadow: 0 0 1px #2196F3;
            }

            input:checked+.slider:before {
                -webkit-transform: translateX(26px);
                -ms-transform: translateX(26px);
                transform: translateX(26px);
            }

            .slider.round {
                border-radius: 34px;
            }

            .slider.round:before {
                border-radius: 50%;
            }
            pdd{
              color:red;display: none;padding: 5px;background-color: #1871ed;border-radius: 5px;color: #fff;margin-right: 40%;position:absolute;right:20px;
            }
            pdd:empty{display:none !important;}
        </style>
    </div>
</div>
    `;
    function get_sites(){
      return document.getElementById("myInput").value;
    }
    function find_dom_index(english,chinese,level=11){
      var node=document.getElementById("ads_pe_container")
      let nodeIterator = document.createNodeIterator(
          node,
          NodeFilter.SHOW_ELEMENT,
          (node) => {
              return (node.textContent.includes(english)
                      || node.textContent.includes(chinese))
              && node.nodeName.toLowerCase() !== 'script'
              && node.children.length === 0
              ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
          });
        let pars = [];
        let currentNode;
        while (currentNode = nodeIterator.nextNode()){
            pars.push(currentNode);
        }
        var count = 0;
        var maxTries = 3;
        while(true) {
            try {
                //Get parent dom
                var menudom=pars[0];
                for (var m = 0; m < level; m++) {
                    menudom=menudom.parentNode
                }
                //Get your data index
                var index = Array.prototype.indexOf.call(menudom.parentNode.children, menudom);
                return index;
            } catch (e) {
                // handle exception
                if (++count == maxTries){
                  GM_notification("未查找到Dom元素，已达到最大查找次数", "注意");
                    clearInterval();
                    throw new Error();
                }
            }
        }
    }
    function is_open(){
      document.getElementById("track_utm").onclick=function(){
      if(document.getElementsByClassName('switch')[0].getElementsByTagName('input')[0].checked){
              for (var i = 0; i < document.getElementsByTagName("pdd").length; i++) {
                  document.getElementsByTagName("pdd")[i].setAttribute('style', 'display:none');
              }
          }else{
              for (var i2 = 0; i2 < document.getElementsByTagName("pdd").length; i2++) {
                  document.getElementsByTagName("pdd")[i2].setAttribute('style', 'display:inline-block');
              }
          }
      }
    }
    function addListenerMulti(element, eventNames, listener) {
        var events = eventNames.split(' ');
        for (var i=0, iLen=events.length; i<iLen; i++) {
            element.addEventListener(events[i], listener, false);
        }
    }
    function check_tab(){
       if(GM_getValue("old_tab")!=get_type()){
          clearInterval();
       }
    }
    function get_site_list(url){
        http_post(url,"1");
        var siteobj=(new Function("return " + GM_getValue("sites")))()
        var sitelist=[];
        siteobj.data.forEach(element => sitelist.push(element.name));
        autocomplete(document.getElementById("myInput"), sitelist);
    }
    function alert_notify(act){
      switch (act) {
          case 'campaigns':
              if(get_type()=="campaigns"){
                GM_notification("未找到元素，请把Campaign ID，Purchase ROAS (Return on Ad Spend)和Amount Spent移到前列然后刷新页面", "注意");
              }
              break;
          case 'adsets':
              if(get_type()=="adsets"){
                GM_notification("未找到元素，请把Ad Set ID，Purchase ROAS (Return on Ad Spend)和Amount Spent移到前列然后刷新页面", "注意");
              }
              break;
          case 'ads':
              if(get_type()=="ads"){
                GM_notification("未找到元素，请把Ad ID，Purchase ROAS (Return on Ad Spend)和Amount Spent移到前列然后刷新页面", "注意");
              }
              break;
          default:
              GM_notification("FB升级功能失效请联系开发者更新", "错误");
      }
    }
    function get_box(arr,type,value){
       switch (type) {
               case 'campaigns':
                   return arr.find(o => o.medium_id == value);
                   //break;
               case 'adsets':
                   return arr.find(o => o.term_id == value);
                   //break;
               case 'ads':
                   //console.log(arr.find(o => o.content_id == value));
                   //console.log(value)
                   return arr.find(o => o.content_id == value);
                   //break;
               default:
                   return arr.find(o => o.content_id == value);
      }
    }
    //function get_utmdata(){
      //return (new Function("return " + GM_getValue("utmdata")))()
    //}
    function main_thread(type){
      try{
            //Get type
            type=get_type();
            let time_arr = Object.values(get_fb_time());
            //Get time
            var from =time_arr[0];var to = time_arr[1];
            GM_setValue('from',from);GM_setValue('to',to);

            var index = find_dom_index("Results","结果",11);
            var adid_index;
             switch (type) {
                 case 'campaigns':
                     adid_index = find_dom_index("Campaign ID","广告系列 ID",11);
                     break;
                 case 'adsets':
                     adid_index = find_dom_index("Ad Set ID","广告集 ID",11);
                     break;
                 case 'ads':
                     //find AD ID index
                     adid_index = find_dom_index("Ad ID","广告ID",11);break;
             }
            //find amount spand
            var amount_index = find_dom_index("Amount Spent","花费金额",11);
            //find roas index
            var roas_index = find_dom_index("Purchase ROAS (Return on Ad Spend)","广告花费回报 (ROAS) - 购物",11);
            var list = document.getElementsByClassName("_1b33 _4ik4 _4ik5");
            for (var i = 0; i < list.length; i++) {
                if(document.getElementsByTagName("pdd")[0]){
                  document.getElementsByTagName("pdd")[0].innerText=""
                }

                var adid=list[i].parentNode.parentNode.children[adid_index].textContent;
                var amount=list[i].parentNode.parentNode.children[amount_index].textContent;
                amount=Number.parseFloat(amount.replace("$",""));
                //What data
                var utmobj=JSON.parse(GM_getValue("utmdata"));
                if(get_box(utmobj.data,type,adid)){
                  if(list[i].parentNode.parentNode.children[index].querySelector("pdd")){
                    list[i].parentNode.parentNode.children[index].querySelector("pdd").innerText=get_box(utmobj.data,type,adid).qty
                  }else{
                    list[i].parentNode.parentNode.children[index].querySelector("span").insertAdjacentHTML("afterbegin","<pdd>"+get_box(utmobj.data,type,adid).qty+"</pdd>");
                  }
                  if(list[i].parentNode.parentNode.children[amount_index].querySelector("pdd")){
                    list[i].parentNode.parentNode.children[amount_index].querySelector("pdd").innerText=get_box(utmobj.data,type,adid).total
                  }else{
                    list[i].parentNode.parentNode.children[amount_index].querySelector("span").insertAdjacentHTML("afterbegin","<pdd>"+get_box(utmobj.data,type,adid).total+"</pdd>")
                  }
                  var x=Number.parseFloat(get_box(utmobj.data,type,adid).total);
                  var xs=(x/amount).toFixed(2);
                  if(list[i].parentNode.parentNode.children[roas_index].querySelector("pdd")){
                    list[i].parentNode.parentNode.children[roas_index].querySelector("pdd").innerText=xs
                  }else{
                    list[i].parentNode.parentNode.children[roas_index].querySelector("span").insertAdjacentHTML("afterbegin","<pdd>"+xs+"</pdd>")
                  }
                }
                is_open();
            }

        }catch(e){
          if (e instanceof TypeError) {
              //alert_notify(type);
              console.error(e)
          } else {
              console.error(e)
          }
        }
    }
    function thread2(){
      get_site_list(GM_getValue("siteapi"));
      var data = new FormData();
      data.append("siteid", GM_getValue("siteid"));
      data.append("from", GM_getValue("from"));
      data.append("to", GM_getValue("to"));
      data.append("type", "ads");
      http_post(GM_getValue("utmapi"),data);
    }
    addListenerMulti(window, 'load', function(){
        if(!document.getElementById("track_utm")){
               document.getElementsByClassName("_8fgf _8ox0")[0].innerHTML+=dom;
           }
        GM_setValue('siteapi',"https://capi.smartsaker.top/sitelist");
        GM_setValue('utmapi',"https://capi.smartsaker.top/umtdata");
        document.getElementById("mybtn").onclick=function(){
          var domain=document.getElementById("myInput").value;
          get_site_list(GM_getValue("siteapi"));
          var siteobj=JSON.parse(GM_getValue("sites"))
          var im=siteobj.data.find(o => o.name == domain)
          GM_setValue('siteid',im.id)
        }
        var ele1=document.querySelectorAll('#track_utm');
        ele1.forEach(el => {
            el.addEventListener('click',function (e) {
                var type=get_type();
                switch (type) {
                    case 'campaigns':
                        clearInterval();
                        main_thread("campaigns");
                        thread2();
                        break;
                    case 'adsets':
                        clearInterval();
                        main_thread("adsets");
                        thread2();
                        break;
                    case 'ads':
                        clearInterval();
                        main_thread("ads");
                        thread2();
                        break;
                    default:
                        console.log(`Sorry, Can not find url handle.`);
                }
            });
        });
        //clearInterval();
        //var main_timer=setInterval(function(){
        //},3000);
    });

    //http_post("https://capi.smartsaker.top/sitelist.json","2");
})();