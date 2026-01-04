// ==UserScript==
// @name			图书搜索联盟
// @namespace		lianmeng.duxiu
// @version			2.1.5
// @include			*search*
// @include			*bookDetail.jsp?*
// @include			*book.do?go=guide*
// @include			*book.do?go=showmorelib*
// @include			*searchEBook*
// @include			*www.duxiu.com*
// @include			*n/jpgfs/book/base*
// @include         *n/slib/book/slib*
// @description		查询读秀、超星、龙岩、长春图书馆是否有书互助，读秀ss号，查询下架的ss号，方便用户查询试读图书是否可以获取全文PDF；协助解决很多用户无法安装问题，让用户2分钟内学会操作，增加用户自由下载功能，免费72小时内可以获取PDF，改进在学校网站使用自建域名不能访问的问题 读秀超星龙岩全国图书馆参考联盟。
// @copyright		tususearchlianmeng
// @author           tususearchlianmeng
// @grant			none
// @license
// @downloadURL https://update.greasyfork.org/scripts/430587/%E5%9B%BE%E4%B9%A6%E6%90%9C%E7%B4%A2%E8%81%94%E7%9B%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/430587/%E5%9B%BE%E4%B9%A6%E6%90%9C%E7%B4%A2%E8%81%94%E7%9B%9F.meta.js
// ==/UserScript==



//获取当前页面完整地址
var lianmengduxiuurl = window.location.href;
//定义统一文字的样式
var duxiustyle = "font-family:Arial, Helvetica, sans-serif,Verdana,SimSun;color:red;font-size:15px;font-weight:bold;display:inline-block;";
duxiustyle += "margin-top:8px;margin-bottom:6px;text-align:center;";
var payurl = "https://help.dushupdf.com/ebook=";
var dispalytex = "图书咨询";
var ssname = "myssnumber";
//定义定时器对象
var temptime = null;
var deltemptime = null;
var bookquestiontextidclass = 'mysstext';
var buttonstyle="color:green;font-size:15px;font-weight:bold;text-decoration:none;";
//定义基本公用函数

//全局对象
var mybook = {
    DeCode: function (LmEnCodeStr) {
        var decodeStr = '';
        var baseNumStr = LmEnCodeStr.substring(LmEnCodeStr.length - 2);
        var baseNum = parseInt(baseNumStr, 16);
        var myCodeStr = LmEnCodeStr.substring(0, LmEnCodeStr.length - 16);
        for (var i = 0; i < myCodeStr.length; i = i + 2) {
            decodeStr += mybook['GetSubString'](myCodeStr, baseNum, i);
        }
        return decodeStr;
    },
    GetEncode: function (strImgSrc) {
        var iidStr = strImgSrc.match(/iid\=\w+/g)[0];
        return iidStr.replace('iid=', '');
    },
    GetSSID: function (strImgSrc) {
        try{
            var ssidStr = mybook['DeCode'](mybook['GetEncode'](strImgSrc));
            return mybook['TrimString'](ssidStr);
        }catch(err){
            var  bodycontent =document.body.innerHTML;
            var  num= /(?<=ssn=)(\d{8,40})/g;
            var  cnums=bodycontent.match(num);
            var  ssid =cnums[0] ||'';
            return  ssid;
        }
    },
    TrimString: function (str) {
        var PutStr = "";
		str =str.replace(/\//g,'');
        if(str){
              PutStr = str.match(/\d{8,}/);
             return PutStr.toString();
           }
      return '';
    },
    GetSubString: function (LmEnCodeStr, BaseNum, startIndex) {
        var ts = "";
        ts = LmEnCodeStr.substring(startIndex, startIndex + 2);
        var i = parseInt(ts, 16) - BaseNum;
        ts = String.fromCharCode(i);
        return ts;
    },
    getValueFromUrl: function (myfield) {
        var str = myfield + "=";
        if (lianmengduxiuurl.indexOf(str) != -1) {
            var reg = new RegExp(myfield + "\\=\\w+");
            var fieldStr = lianmengduxiuurl.match(reg)[0];
            myfield = myfield.toString();
           return fieldStr.replace(myfield + "=", "");

        }
    },
    getValueFromUrl2: function (URL, myfield) {
        var str = myfield + "=";
        if (URL.indexOf(str) != -1) {
            var reg = new RegExp(myfield + "\\=\\w+");
            var fieldStr = URL.match(reg)[0];
            return fieldStr.replace(myfield + "=", "");
        }
    },
    GetSSIDDXID: function (sid, did) {
        //获取ssid
        var ssid = mybook['GetSSIDByID'](sid, "value");
        //获取dxid
        var dxid = mybook['GetSSIDByID'](did, "value");
        return ssid==''?dxid:ssid;
    },
    GetSSIDByID: function (a, b) {
        var ssidNode = document.getElementById(a);
        return ssidNode.getAttribute(b);
    },
    CreateSSIDNodet: function (ssid, strID) {
        //创建临时变量
        var tempNode = document.createElement("p");
        tempNode.className = strID;
        tempNode.style = duxiustyle;
        tempNode.innerHTML = "SS号  " + ssid;
        return tempNode;
    },
    CreateSSIDNode: function (ssid) {
        var myid = ssname;
        return mybook['CreateSSIDNodet'](ssid, myid);
    },
    CreateNodetwo:function (ssid,strID)
    {
        var ssNode = document.createElement("p");
		if(ssNode){
			ssNode.className=strID;
			ssNode.style=duxiustyle;
			ssNode.innerHTML="SS 号"+ssid;
		}
        return ssNode;
    }
};


//图书对象 删除多余P
function itembook(bookphoto) {
    if (bookphoto != null) {
        var phtml = bookphoto.getElementsByTagName("p");
        if (phtml.length == 0) {
            return false;
        } else if (phtml.length > 0) {
            //判断是否 执行到指定位置
            var myself = document.getElementsByClassName("bookquestion");
            if (myself != null) {
                if (deltemptime != null) {
                    window.clearInterval(deltemptime);
                    deltemptime = null;
                }
            }
            var fatherttemp = null;
            for (var i = 0; i < phtml.length; i++) {
                fatherttemp = phtml[0].parentNode;
                if (phtml[i].className.indexOf('bookquestion') != -1 && (i !== 0 || i !== 1)) {
                    fatherttemp.insertBefore(phtml[i], phtml[1]);
                }
                if (phtml[i].className.indexOf('myssnumber') != -1 && (i !== 0 || i !== 1)) {
                    fatherttemp.insertBefore(phtml[i], phtml[0]);
                }
            }
        }
    }
}

//获取参数
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}




//定义统一对象
var duxiuapp = {
    run: function () {
        //封面页展示图书显示ssid
        var isDuxiuflag = lianmengduxiuurl.indexOf("www.duxiu.com") != -1;
        if (isDuxiuflag) {
            var myul = document.querySelector("ul.zpicImg");
            var mybooks = myul.querySelectorAll("li");
            for (var i = 0; i < mybooks.length; i++) {
                var myCov = mybooks[i].querySelector("img").src.toString();
                var ssid = mybook['GetSSID'](myCov);
                var ssNode = mybook['CreateNodetwo'](ssid, ssname + i);
                mybooks[i].appendChild(ssNode);
            }
        }

        //搜索页显示ssid
        var isSearch = lianmengduxiuurl.indexOf("search?") != -1;
        var isnotpagkage = lianmengduxiuurl.indexOf("book/search?") == -1;
        var notAdvsearch = lianmengduxiuurl.indexOf("advsearch") == -1;
        if (isSearch && notAdvsearch && isnotpagkage) {
            var subdomain = document.getElementsByName("sp.subdomain")[0];
            var isDuxiu = lianmengduxiuurl.indexOf("book.duxiu.com/search?") != -1 || (document.body.innerHTML.indexOf("读秀") != -1 && lianmengduxiuurl.indexOf("search?Field=all&channel=search") != -1) ||  (document.body.innerHTML.indexOf("读秀") != -1 && lianmengduxiuurl.indexOf("channel=search&Field=all") != -1);


       var isDuxiu=lianmengduxiuurl .indexOf("book.duxiu.com/search?") != -1 ||  (document.body.innerHTML.indexOf("读秀")!=-1 && lianmengduxiuurl .indexOf("search") != -1);
           var channel =  getQueryString('channel');
            var isCcelib=lianmengduxiuurl .indexOf("book.ccelib.com/search?") != -1;
            if ( isDuxiu||isCcelib) {
                var mybooks = document.getElementsByClassName("books");
                for (var i = 0; i < mybooks.length; i++) {
                    var listDL = mybooks[i].querySelector("dl");
                    listDL.style.minHeight = "210px";
                    var ssid = mybook['GetSSIDDXID']("ssid" + i, "dxid" + i);
                    var ssNode = mybook['CreateNodetwo'](ssid, ssname + i);
                    var divImg = mybooks[i].querySelector(".divImg");
                    var infoAnchor = divImg.querySelector("a").href;
                    var oldstr = "bookDetail.jsp?dxNumber=";
                    var newstr = "book.do?go=showmorelib&type=1&dxid=";
                    var scgAnchor = payurl + ssid;
                    var cyuiosooogbutton = document.createElement("a");
                    cyuiosooogbutton.href = scgAnchor;
                    cyuiosooogbutton.target = "_blank";
                    cyuiosooogbutton.style = "color:green;font-size:15px;font-weight:bold;text-decoration:none;";
                    cyuiosooogbutton.innerHTML = dispalytex;
                    var csgP = document.createElement("p");
                    csgP.style = "text-align:center;";
                    csgP.className = "bookquestion";
                    csgP.appendChild(cyuiosooogbutton);
                    divImg.appendChild(ssNode);
                    divImg.appendChild(csgP);
                }
            }
            else {
                var duxiubooks = document.getElementsByClassName("book1");
                for (var i = 0; i < duxiubooks.length; i++) {
                    var ssid = mybook['GetSSIDDXID']("ssid" + i, "dxid" + i);
                    var ssNode = mybook['CreateNodetwo'](ssid, ssname + i);
                    var infoUrl = document.getElementById("url" + i).value;
                    var dxid = mybook['getValueFromUrl2'](infoUrl, "dxNumber");
                    var dValue = mybook['getValueFromUrl2'](infoUrl, "&d");
                    var myhref = payurl + ssid;
                    var buttonopop = document.createElement("a");
                    buttonopop.href = myhref;
                    buttonopop.target = "_blank";
                    buttonopop.style = "color:green;font-size:15px;font-weight:bold;text-decoration:none;";
                    buttonopop.innerHTML = dispalytex;
                    var csgP = document.createElement("p");
                    csgP.className = "bookquestion";
                    csgP.style = "text-align:center;display:inline-block;";
                    csgP.appendChild(buttonopop);
                    var tdelems = duxiubooks[i].getElementsByTagName("td");
                    for (var j = 0; j < tdelems.length; j++) {
                        if (tdelems[j].id === "b_img") {
                            var imgNode = tdelems[j];
							if(imgNode){
							  var insertPoint = imgNode.nextSibling;
								var pNode = insertPoint.parentNode;
								pNode.insertBefore(ssNode, insertPoint);
								pNode.insertBefore(csgP, insertPoint);
							}
                        }
                    }
                }
            }
        }
        if (lianmengduxiuurl.indexOf("bookDetail.jsp?") != -1) {
            if (lianmengduxiuurl.indexOf("/views/specific/") == -1) {
                var bookphoto = document.getElementById("bookphoto");
                var imgsrc = bookphoto.querySelector("img").src;
                var ssid = mybook['GetSSID'](imgsrc);
                var ssNode = mybook['CreateSSIDNode'](ssid);
                var grade1 = document.getElementById("grade1");
                bookphoto.insertBefore(ssNode, grade1);
                var bnt_content = document.querySelector(".bnt_content");
                if (!bnt_content) {
                    bnt_content = document.createElement("dd");
                    bnt_content.className = "bnt_content";
                    var card_text = document.querySelector(".card_text");
                    var card_dl = card_text.querySelector("dl");
                    card_dl.appendChild(bnt_content);
                }
                var bnt_innerHtml = bnt_content.innerHTML;
                var d = mybook['getValueFromUrl']("&d");
                var dxid = mybook['getValueFromUrl']("dxNumber");
                var gyoutabutton = document.createElement("a");
                var oldstr = "bookDetail.jsp?dxNumber=";
                var newstr = "book.do?go=showmorelib&type=1&dxid=";
                var newAnchor = payurl + ssid;
                gyoutabutton.href = newAnchor;
                gyoutabutton.id = "bookquestion";
                gyoutabutton.className = "bnt_book leftfloat";
                gyoutabutton.style = buttonstyle;
                gyoutabutton.target = "_blank"
                gyoutabutton.innerHTML = '图书PDF下载';
                bnt_content.appendChild(gyoutabutton);
            }
            else {

            
                try{
                    var tubookimg = document.querySelector(".tubookimg"),imgsrc = tubookimg.querySelector("img").src,ssid = mybook.GetSSID(imgsrc), ssNode = mybook['CreateSSIDNode'](ssid);
                    tubookimg.appendChild(ssNode);
                    var gyoutabutton = document.createElement("a");
                    var dxid = mybook['getValueFromUrl']("dxNumber");
                    var dvalue = mybook['getValueFromUrl']("&d");
                    var myhref = payurl + ssid;
                    gyoutabutton.href = myhref;
                    gyoutabutton.target = "_blank";
                    gyoutabutton.style = buttonstyle;
                    gyoutabutton.innerHTML = dispalytex;
                    var pTemp = document.createElement("p");
                    pTemp.style = "text-align:center;";
                    pTemp.className = bookquestiontextidclass;
                    pTemp.appendChild(gyoutabutton);
                    tubookimg.appendChild(pTemp);
                }catch(err){
                    //处理错误
                         var gyoutabutton = document.createElement("a");
                         var  bodycontent =document.body.innerHTML;
                         var  num= /(?<=ssn=)(\d{8,40})/g
                         var  cnums=bodycontent.match(num);
                         if(cnums){
                              ssid =cnums[0] ||'';
                         }else{
                             var inputElements = document.getElementsByName('dxid');
                             if(inputElements.length>0){
                                 ssid = inputElements[0].value;
                             }
                         }
                     var myhref = payurl + ssid;
                    gyoutabutton.href = myhref;
                    gyoutabutton.target = "_blank";
                    gyoutabutton.style = buttonstyle;
                    gyoutabutton.innerHTML = dispalytex;
                    var pTemp = document.createElement("p");
                    pTemp.style = "text-align:center;";
                    pTemp.className = bookquestiontextidclass;
                    pTemp.appendChild(gyoutabutton);

                    // 创建新的 <p> 元素
                    var newParagraph = document.createElement('p');

                    // 设置该 <p> 元素的 id、样式和文本内容
                    newParagraph.id = 'booklianmeng';
                    newParagraph.style.fontFamily = 'Verdana';
                    newParagraph.style.color = '#bb0101';
                    newParagraph.style.fontSize = '15px';
                    newParagraph.style.fontWeight = 'bold';
                    newParagraph.style.textAlign = 'center';
                    newParagraph.style.marginTop = '5px';
                    newParagraph.style.marginBottom = '5px';
                    newParagraph.textContent = ssid;
                    tubookimg.appendChild(newParagraph);
                    tubookimg.appendChild(pTemp);


                }
            }
        }
    },
     //纠正错误定位
    clearerrcontent: function () {
        //删除其他元素 清理页面
        //插入直查询是否有其他结点，有则删除
        //信息页面显示ssid
        if (lianmengduxiuurl.indexOf("bookDetail.jsp?") != -1) {
            //读秀信息页面
            if (lianmengduxiuurl.indexOf("/views/specific/") == -1) {
                //获取ssid
                var bookphoto = document.getElementById("bookphoto");
                if (bookphoto != null) {
                    var phtml = bookphoto.getElementsByTagName("p");
                    if (phtml.length == 0) {
                        return false;
                    } else if (phtml.length > 0) {
                        //判断是否 执行到指定位置
                        var myself = document.getElementsByClassName("myssnumber");
                        if (myself != null) {
                            window.clearInterval(temptime);
                            temptime = null;
                        }

                    }
                }
                //删除读秀详情页面的 错位
                var bnt_content = document.getElementsByClassName("bnt_content");
                if (bnt_content != null) {
                    var phtmls = bnt_content[0].getElementsByTagName("a");
                    var myself = document.getElementById("bookquestion");
                    if (myself != null) {
                        window.clearInterval(temptime);
                        temptime = null;
                    }
                    if (phtmls.length > 0) {
                        var parenttempss = null;
                        for (i = 2; i < phtmls.length; i++) {
                            parenttempss = phtmls[0].parentNode;
                            if ('bookquestion' == phtmls[i].id && i !== 0) {
                                parenttempss.insertBefore(phtmls[i], phtmls[0]);
                            }
                        }
                    }
                }
            }
            //深圳文献港,全国图书馆参考咨询联盟图书信息页
            else {
                //获取ssid
                //图书馆联盟
                var tubookimg = document.querySelector(".tubookimg");
                if (tubookimg != null) {
                    var phtml = tubookimg.getElementsByTagName("p");
                    if (phtml.length == 0) {
                        return false;
                    } else if (phtml.length > 0) {
                        //判断是否 执行到指定位置
                        var myself = document.getElementsByClassName("myssnumber");
                        if (myself != null) {
                            window.clearInterval(temptime);
                            temptime = null;
                        }

                        var parenttemp = null;
                        for (var i = 0; i < phtml.length; i++) {
                            parenttemp = phtml[0].parentNode;
                            if (phtml[i].className.indexOf('myssnumber') != -1 && (i !== 0 || i !== 1)) {
                                parenttemp.insertBefore(phtml[i], phtml[1]);
                            }
                            if (phtml[i].className.indexOf('bookquestiontextidclass') != -1 && (i !== 0 || i !== 1)) {
                                parenttemp.insertBefore(phtml[i], phtml[0]);
                            }
                        }
                    }
                }
            }
        } else {
            window.clearInterval(temptime);
            temptime = null;
        }
    },

    delsearchhtml: function () {
        //搜索页显示ssid
        var isSearch = lianmengduxiuurl.indexOf("search?") != -1;
        var nggggghotBaoku = lianmengduxiuurl.indexOf("book/search?") == -1;
        var notAdvhjksearch = lianmengduxiuurl.indexOf("advsearch") == -1;
        if (isSearch && notAdvhjksearch && nggggghotBaoku) {
            var subdomain = document.getElementsByName("sp.subdomain")[0];
            //读秀和长春图书馆的情况
            //var isDuxiu=subdomain.value == "book.duxiu.com";
            //var isCcelib=subdomain.value == "book.ly.superlib.net";
            var isfpagDuxiu = lianmengduxiuurl.indexOf("book.duxiu.com/search?") != -1;
            var isCcelib = lianmengduxiuurl.indexOf("book.ly.superlib.net/search?") != -1;
            if (isfpagDuxiu || isCcelib) {
                //获取书本列表节点
                var jjjjjjj = document.getElementsByClassName("books");
                for (var i = 0; i < jjjjjjj.length; i++) {
                    itembook(jjjjjjj[i]);
                }
            } else {
                //深圳文献港，全国图书馆联盟搜索页
                var jjjjjjj = document.getElementsByClassName("book1");
                for (var i = 0; i < jjjjjjj.length; i++) {
                    itembook(jjjjjjj[i]);
                }
            }
        } else {
            window.clearInterval(deltemptime);
            deltemptime = null;
        }
    }
};

try {
    duxiuapp.run();
    temptime = setInterval(function () {
         duxiuapp.clearerrcontent();
    }, 50);
    deltemptime = setInterval(function () {
         duxiuapp.delsearchhtml();
    }, 50);
} catch (e) {
    //打印错误日志
    console.log(e);
}