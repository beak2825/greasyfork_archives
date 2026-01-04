// ==UserScript==
// @name         Google scholar 批量引用 bibtex
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  类似百度学术 批量引用
// @author       Johnson Django (江)
// @match        https://scholar.google.com/*
// @match        https://scholar.google.de/*
// @icon
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/460218/Google%20scholar%20%E6%89%B9%E9%87%8F%E5%BC%95%E7%94%A8%20bibtex.user.js
// @updateURL https://update.greasyfork.org/scripts/460218/Google%20scholar%20%E6%89%B9%E9%87%8F%E5%BC%95%E7%94%A8%20bibtex.meta.js
// ==/UserScript==

//add remove function in Array data structure
Array.prototype.remove = function(val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};

//class button which will be insert in Google scholar webpage
class btnClass {
  constructor(id,bottom, color){
    this.oneBtn = document.createElement("button"); //创建一个按钮
    this.oneBtn.id = id
	this.oneBtn.style.right = "20px"
	this.oneBtn.style.bottom = bottom
	this.oneBtn.style.position = "fixed"
	this.oneBtn.style.width = "20px"; //按钮宽度
	this.oneBtn.style.height = "20px"; //按钮高度
	this.oneBtn.style.align = "center"; //文本居中
	this.oneBtn.style.color = color; //按钮文字颜色
	this.oneBtn.style.background = "##993366"; //按钮底色
	this.oneBtn.style.border = "1px solid #033e33"; //边框属性
	this.oneBtn.style.borderRadius = "8px"; //按钮四个角弧度
  }
}

//save bibtex for one paper
//bibitem: the bibtex item of a paper
//btnPaper: the cite button of a paper
function saveOneBib(bibitem, btnPaper){
    var citeTotalNumBtn = document.getElementById("citeButton")

    //get from storage
    var cnt = GM_getValue("count",0)
    var citeList = GM_getValue("citeList",[])
    //alert(citeList)

    if(-1 == citeList.indexOf(bibitem)){ //no exist, add
        //alert("no exist, then add")
        cnt++;
        citeList.push(bibitem)
        btnPaper.textContent = "引用！"
    }else{ //delete
        //alert("exist, then remove")
        var r = confirm("are your sure delete it?");
        if (r == true){ // delete按钮
            citeList.remove(bibitem)
            cnt--;
            btnPaper.textContent = "引用？"
        }
    }

    citeTotalNumBtn.textContent = cnt;
    //save in storage
    GM_setValue("count",cnt)
    GM_setValue("citeList",citeList)
}

//select or cancel for one paper,
//if select, then whether if it in citeList, if no then send request and get bibtex for one paper
//if yes, confirm then dec; otherwise skip
function clickCitePaper(link){
    //alert(link)

    var btn = link.getElementsByTagName("button")[0]
    var s= ""

	//add or remove bib href for one select paper
	var bibLink = link.getElementsByClassName('gs_nta gs_nph')[0].href;
    //alert(bibLink)
    GM_xmlhttpRequest({
        method: "GET",
        url: bibLink,
        onload: function(response) {
            //这里写处理函数
            if(response.status === 200){
                console.log('成功')
                console.log(response.responseText)
                s = response.responseText + "\n\n";
                //alert(s)
                saveOneBib(s,btn)
            }else{
                console.log('失败')
                console.log(response)
            }
        }
    });
	
}

//batch download bibtex
function downloadBatchCiteBtn(){
    //traverse citeList and fetch bibtex    
    var s = GM_getValue("citeList",[])
    //alert(s)

    //save as
    var blob = new Blob([s], {type: "text/plain;charset=utf-8"});
    var fileName = "1"
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName + ".bib";
    link.click();
    window.URL.revokeObjectURL(link.href);
}

//clear storage
function clickClearBtn(){
    GM_setValue("count",0)
    GM_setValue("citeList",[])
    location.reload() //自动刷新
}

//main function
(function() {
	'use strict';
    // Your code here...
	//create a button and insert it into each reference item
    var papers = document.querySelectorAll('.gs_ri');

    papers.forEach(function(item){
        var batchCite_paper = document.createElement("button")
        batchCite_paper.textContent = "引用?"
        batchCite_paper.style.color = "red"
        batchCite_paper.style.fontWeight = "bold"
        batchCite_paper.onclick=function(){ clickCitePaper(item) }
        item.querySelector('.gs_ri .gs_fl').appendChild(batchCite_paper);
    });

	//create a citeBtn for each webpage
	let citeBtn = new btnClass("citeButton","70px","red")
	citeBtn.oneBtn.textContent = GM_getValue("count",0); //按钮内容
    citeBtn.oneBtn.addEventListener("click", downloadBatchCiteBtn) //监听按钮点击事件
	document.body.append(citeBtn.oneBtn)

    //create a clearBtn for each webpage
    let clearBtn = new btnClass("clearButton","45px","blue")
	clearBtn.oneBtn.textContent = "Clear"; //按钮内容
    clearBtn.oneBtn.addEventListener("click", clickClearBtn) //监听按钮点击事件
	document.body.append(clearBtn.oneBtn)
})();