// ==UserScript==
// @name         linked in grab down
// @namespace    http://tampermonkey.net/
// @version      0.111
// @description  this is a test.
// @author       vyue
// @match        *://*.linkedin.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=linkedin.com
// @grant        none
// @license      this is a test
// @downloadURL https://update.greasyfork.org/scripts/475783/linked%20in%20grab%20down.user.js
// @updateURL https://update.greasyfork.org/scripts/475783/linked%20in%20grab%20down.meta.js
// ==/UserScript==

(function() {
    'use strict';
function isexists() {
    if (document.querySelectorAll(".page-not-found__subheadline").length>0 || window.location.href.indexOf('linkedin.cn') >= 0)
    {
        return false;
    };
    return true;
}


function detail() {

    if (document.querySelectorAll(".top-level-modal-container button").length>0) {
        document.querySelectorAll(".top-level-modal-container button")[0].click();
    }
    var obj = {};

    if (window.location.href.indexOf('linkedin.com/in') >= 0) {
        obj["type"] = "person";
        obj["name"] = document.querySelector(".top-card-layout__card h1").innerText;
        obj["position"] = document.querySelector(".top-card-layout__card h2").innerText;
        obj["country"] = document.querySelector(".top-card-layout__card h3 div").innerText;

        if (document.querySelectorAll(".top-card-layout__card h3 font").length>0) {
            obj["follows"] = document.querySelectorAll(".top-card-layout__card h3 font")[0].children[0].innerText.split(' ')[0];
            obj["friends"] = document.querySelectorAll(".top-card-layout__card h3 font")[0].children[1].innerText.split(' ')[0];
        }
        obj["company"] = document.querySelector(".top-card__links-container div span").innerText;
        if (document.querySelectorAll(".top-card__links-container div a").length > 0 && document.querySelectorAll(".top-card__links-container div a")[0].href.indexOf("company") >= 0) {
            obj["companylink"] = document.querySelectorAll(".top-card__links-container div a")[0].href;
        }



        var h2ary = document.querySelectorAll(".core-section-container__title.section-title");
        for (var i = 0; i < h2ary.length; i++) {
            if (h2ary[i].innerText.indexOf('工作经历') >= 0 || h2ary[i].innerText.indexOf('Experience') >= 0) {

                var workJarray = [];
                  var workAry= h2ary[i].nextElementSibling.children[0].children

                for (var wIndex = 0; wIndex < workAry.length; wIndex++) {
                    if (workAry[wIndex].querySelectorAll('ul').length == 0) {
                        var workObj = {};
                        workObj['position'] = workAry[wIndex].querySelector("div h3").innerText;
                        workObj["company"] = workAry[wIndex].querySelector("div h4").innerText;

                        if (h2ary[i].nextElementSibling.children.length > 0 && workAry[wIndex].querySelectorAll("div div p").length > 0) {


                            workObj["time"] = workAry[wIndex].querySelectorAll("div div p")[0].innerText;

                            if (workAry[wIndex].querySelectorAll("div div p").length > 1) {
                                workObj["country"] = workAry[wIndex].querySelectorAll("div div p")[1].innerText;
                            }
                            if (workAry[wIndex].querySelectorAll("div div p").length > 2) {
                                workObj["job"] = workAry[wIndex].querySelectorAll("div div p")[workAry[wIndex].querySelectorAll("div div p").length - 1].innerText.replace('收起', '').replace('Show less', '').trim('\n');
                            }
                        }
                        workJarray.push(workObj);
                    }
                    else if (workAry[wIndex].querySelectorAll('ul').length > 0) {

                        workAry[wIndex].querySelectorAll("a h4")[0].innerText

                        workAry[wIndex].querySelectorAll("ul li")


                        for (var positionIndex = 0; positionIndex < workAry[wIndex].querySelectorAll("ul li").length; positionIndex++) {

                            var workObj1 = {};
                            workObj1["company"] = workAry[wIndex].querySelectorAll("a h4")[0].innerText;

                            workObj1["position"] = workAry[wIndex].querySelectorAll("ul li")[positionIndex].querySelector("h3").innerText;

                            workObj1["time"] = workAry[wIndex].querySelectorAll("ul li")[positionIndex].querySelector("div p").innerText;
                            if (workAry[wIndex].querySelectorAll("ul li")[positionIndex].querySelectorAll("div div p").length > 2) {
                                workObj1["job"] = workAry[wIndex].querySelectorAll("ul li")[positionIndex].querySelectorAll("div div p")[workAry[wIndex].querySelectorAll("ul li")[positionIndex].querySelectorAll("div div p").length - 1].innerText.replace('收起', '').replace('Show less', '').trim('\n');
                            }

                            workJarray.push(workObj1);
                        }
                    }
                }

                obj["work"] = workJarray;
            }
            else if (h2ary[i].innerText.indexOf('关于') >= 0 || h2ary[i].innerText.indexOf('About') >= 0) {
                obj["intro"] = h2ary[i].nextElementSibling.innerText;
            }
            else if (h2ary[i].innerText.indexOf('教育经历') >= 0 || h2ary[i].innerText.indexOf('About') >= 0) {

                var studyAry = h2ary[i].nextElementSibling.children[0].children
                studyAry[0].querySelector("div h3").innerText
                studyAry[0].querySelector("div h4").innerText

                if (studyAry[0].querySelectorAll("div div p").length > 0) {
                    studyAry[0].querySelectorAll("div div p")[0].innerText
                }

                if (studyAry[0].querySelectorAll("div div p").length > 1) {
                    studyAry[0].querySelectorAll("div div p")[1].innerText
                }
                if (studyAry[0].querySelectorAll("div div p").length > 2) {
                    studyAry[0].querySelectorAll("div div p")[2].innerText
                }
            }
            else if (h2ary[i].innerText.indexOf('资格认证') >= 0 || h2ary[i].innerText.indexOf('Certifications') >= 0) {
                h2ary[i].nextElementSibling.querySelectorAll("ul li")
                h2ary[i].nextElementSibling.querySelectorAll("ul li")[0].querySelector("h3").innerText
                h2ary[i].nextElementSibling.querySelectorAll("ul li")[0].querySelector("h4").innerText
                h2ary[i].nextElementSibling.querySelectorAll("ul li")[0].querySelectorAll("time")[0].innerText

                if (h2ary[i].nextElementSibling.querySelectorAll("ul li")[0].querySelectorAll("time").length > 1) {
                    h2ary[i].nextElementSibling.querySelectorAll("ul li")[0].querySelectorAll("time")[1].innerText
                }
                if (h2ary[i].nextElementSibling.querySelectorAll("ul li")[0].querySelector("a[class='certifications__button']")) {
                    h2ary[i].nextElementSibling.querySelectorAll("ul li")[0].querySelector("a[class='certifications__button']").href
                }
            }
            else if (h2ary[i].innerText.indexOf('动态') >= 0 || h2ary[i].innerText.indexOf('Activity') >= 0 ) {

                var dongtaiAry = h2ary[i].nextElementSibling.querySelectorAll("li");
                var dongtaiJarray = [];
                for (var dtIndex = 0; dtIndex < dongtaiAry.length; dtIndex++) {

                    var dongtaiObj = {};
                    dongtaiObj["href"] = dongtaiAry[dtIndex].querySelectorAll("div")[0].querySelector("a").href;

                    if (dongtaiAry[dtIndex].querySelectorAll("div").length > 1 && dongtaiAry[dtIndex].querySelectorAll("div")[1].querySelectorAll("img").length>0)
                    {
                        dongtaiObj["img"] = dongtaiAry[dtIndex].querySelectorAll("div")[1].querySelector("img").src;
                    }
                    if (dongtaiAry[dtIndex].querySelectorAll("div").length > 2 && dongtaiAry[dtIndex].querySelectorAll("div")[2].querySelectorAll("h3").length>0) {
                        dongtaiObj["content"] = dongtaiAry[dtIndex].querySelectorAll("div")[2].querySelector("h3").innerText;
                    }
                    if (dongtaiAry[dtIndex].querySelectorAll("div").length > 2 && dongtaiAry[dtIndex].querySelectorAll("div")[2].querySelectorAll("h4").length>0) {
                        dongtaiObj["type"] = dongtaiAry[dtIndex].querySelectorAll("div")[2].querySelector("h4").innerText;
                    }

                    dongtaiJarray.push(dongtaiObj);
                }

                obj["dongtai"] = dongtaiJarray;
            }
        }
    }
    else if (window.location.href.indexOf('linkedin.com/company') >= 0) {
        obj["type"] = "company";
        obj["name"] = document.querySelector(".top-card-layout__card h1").innerText;;
        obj["instry"] = document.querySelector(".top-card-layout__card h2").innerText;;

        if (document.querySelector(".top-card-layout__card h3")) {
            obj["country"] = document.querySelector(".top-card-layout__card h3").innerText.replace(document.querySelector(".top-card-layout__card h3 span").nextSibling.textContent.trim('\n'),"");
            document.querySelector(".top-card-layout__card h3 span").nextSibling;
        }
        if (document.querySelector(".top-card-layout__card h4")) {
            document.querySelector(".top-card-layout__card h4").innerText;
        }

        var h2ary11 = document.querySelectorAll(".core-section-container__title.section-title");
        for (var i1 = 0; i1 < h2ary11.length; i1++) {
            if (h2ary11[i1].innerText.indexOf('关于我们') >= 0 || h2ary11[i1].innerText.indexOf('About us') >= 0) {

                obj["intro"] = h2ary11[i1].nextElementSibling.children[0].innerText;

                for (var companyInfoIndex = 0; companyInfoIndex < h2ary11[i1].nextElementSibling.children[1].children.length; companyInfoIndex++) {
                    var companyinfodetail= h2ary11[i1].nextElementSibling.children[1].children[companyInfoIndex];
                    if (companyinfodetail.innerText.indexOf('网站') >= 0 || companyinfodetail.innerText.indexOf('Website') >= 0) {
                        obj["website"] = companyinfodetail.innerText.split('\n')[1];
                    }
                    else if (companyinfodetail.innerText.indexOf('行业') >= 0 || companyinfodetail.innerText.indexOf('Industries') >= 0) {
                        obj["industry"] = companyinfodetail.innerText.split('\n')[1];
                    }
                    else if (companyinfodetail.innerText.indexOf('规模') >= 0 || companyinfodetail.innerText.indexOf('Company size') >= 0) {
                        obj["employeecount"] = companyinfodetail.innerText.split('\n')[1];
                    }
                    else if (companyinfodetail.innerText.indexOf('创立') >= 0 || companyinfodetail.innerText.indexOf('Founded') >= 0) {
                        obj["opentime"] = companyinfodetail.innerText.split('\n')[1];

                    }
                    else if (companyinfodetail.innerText.indexOf('领域') >= 0 || companyinfodetail.innerText.indexOf('Specialties') >= 0) {
                        obj["industrydetail"] = companyinfodetail.innerText.split('\n')[1];

                    }
                    else if (companyinfodetail.innerText.indexOf('类型') >= 0 || companyinfodetail.innerText.indexOf('Type') >= 0) {
                        obj["companytype"] = companyinfodetail.innerText.split('\n')[1];

                    }
                    else if (companyinfodetail.innerText.indexOf('总部') >= 0 || companyinfodetail.innerText.indexOf('Headquarters') >= 0) {
                        obj["mainaddress"] = companyinfodetail.innerText.split('\n')[1];

                    }
                }
            }
            else if (h2ary11[i].innerText.indexOf('地点') >= 0 || h2ary11[i].innerText.indexOf('Locations') >= 0) {
                obj["mainaddress"] = h2ary11[i].nextElementSibling.children[0].children[0].querySelector("div").innerText;

            }
            else if (h2ary11[i].innerText.indexOf('动态') >= 0 || h2ary11[i].innerText.indexOf('Updates') >= 0) {
                var dongTai = h2ary11[i].nextElementSibling.children[0].children;

                var dongtaiJarray1 = [];
                for (var dtIndex1 = 0; dtIndex1 < 3; dtIndex1++) {
                    var dongtaiObj1 = {};

                    var dtDetail = dongTai[dtIndex1];
                    dongtaiObj1["content"] = dtDetail.querySelectorAll("article>div")[2].innerText;
                    if (dtDetail.querySelectorAll("article>div video").length>0) {
                        dongtaiObj1["video"] = dtDetail.querySelectorAll("article>div video")[0].src;
                    }
                    if (dtDetail.querySelectorAll("article  ul li img").length > 0) {
                        var imgAry = dtDetail.querySelectorAll("article  ul li img");
                        var imgurl = '';
                        for (var imgIndex = 0; imgIndex < imgAry.length; imgIndex++) {
                            imgurl += (imgurl.length == 0 ? '' : ',');
                            imgurl += imgAry[imgIndex].src;
                        }
                        dongtaiObj1["img"] = imgurl;
                    }
                    else if (dtDetail.querySelectorAll("article>a>img").length>0) {
                        dongtaiObj1["img"] = dtDetail.querySelectorAll("article>a>img")[0].src;
                    }
                    dongtaiJarray1.push(dongtaiObj1);
                }
                obj["dongtai"] = dongtaiJarray1;
            }
        }
    }

    return JSON.stringify(obj);
}

    function downloadTxt(fileName, content) {
   let blob = new Blob([content], {
       type: "text/plain;charset=utf-8"
    });
   let reader = new FileReader();
   reader.readAsDataURL(blob);
   reader.onload = function(e) {
	  let a = document.createElement('a');
	  a.download = fileName;
	  a.href = e.target.result;
	  document.body.appendChild(a);
	  a.click();
	  document.body.removeChild(a);
  }
}
    isexists();
    var result=detail();
    downloadTxt(JSON.parse(result)["name"] ,result);

})();