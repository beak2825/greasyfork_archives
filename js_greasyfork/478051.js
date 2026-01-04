// ==UserScript==
// @name         创科刷题
// @namespace    http://tampermonkey.net/
// @version      2.01
// @description  crtl+b
// @author       You
// @license      MIT
// @match        http://ckshool.cn/web/*
// @match        http://ckshool.cn/Web/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ckshool.cn
// @grant        GM_xmlhttpRequest
// @connect      www.sqlpub.com
// @downloadURL https://update.greasyfork.org/scripts/478051/%E5%88%9B%E7%A7%91%E5%88%B7%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/478051/%E5%88%9B%E7%A7%91%E5%88%B7%E9%A2%98.meta.js
// ==/UserScript==

(function() {



        var answer=''

     window.onload= function(){

  window.addEventListener("keydown", (e)=> {
     //http://ckshool.cn/teacher/exam/ResultsSummarize?id=275

//  location.href.substr(location.href.indexOf('id='))
 if((e.key=='s'||e.key=='S')&&(navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)){
        e.preventDefault();
  Array.from(document.getElementsByTagName("dd")).forEach(function (item,index) {
                     if(item.getAttribute("qid")==null){return;}
    if(item.getAttribute('title')==null){
    if(item.getAttribute('temp_title')==null){
    alert("请按键Ctrl+B获取数据")
       return;
    }else{
    item .setAttribute("title", item.getAttribute('temp_title'));
    }
    }else{
     item .setAttribute("temp_title", item.getAttribute('title'));
              item.removeAttribute('title')

    }

  })

 }
        if((e.key=='p'||e.key=='P')&&(navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)){
            e.preventDefault();
             	 if(location.href.indexOf('?id=')==-1){alert('仅可在考试中使用哦！！！'); return;}
            window.open("/teacher/exam/ResultsDetail?"+location.href.substr(location.href.indexOf('id=')),"_blank","toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=640, height=8000");
         }
         if((e.key=='g'||e.key=='G')&&(navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)){
            e.preventDefault();
             if(location.href.indexOf('?id=')==-1){alert('仅可在考试中使用哦！！！'); return;}
             	window.open("/teacher/exam/ResultsSummarize?"+location.href.substr(location.href.indexOf('id=')),"_blank","toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=420, height=8000");
         }
                //可以判断是不是mac，如果是mac,ctrl变为花键
                //event.preventDefault() 方法阻止元素发生默认的行为。
                if((e.key=='b'||e.key=='B')&&(navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)){
                    e.preventDefault();




              
                 Array.from(document.getElementsByTagName("dd")).forEach(async function (item,index) {
                     if(item.getAttribute("qid")==null){return;}
                        if(item.getAttribute('title')==null){
    if(item.getAttribute('temp_title')==null){
                   if(answer===''){
              try{

//                   fetch("http://www.sqlpub.com:8080/sql/execute?sql=SELECT%20%2A%20FROM%20%60answers%60%20WHERE%20%60TestUrl%60=%27"+item.getAttribute("qid")+"%27&dbId=mysql_mysql_sqlpub_com_3306_haibara_haibara&token=af9dd0d32a374ff19e9cbb64c0dd90f2",requestOptions)
//    .then(response => response.text())
//    .then(result => console.log(result))
     GM_xmlhttpRequest({
        url:"http://www.sqlpub.com:8080/sql/execute?sql=SELECT%20%2A%20FROM%20%60answers%60%20WHERE%20TestUrl%20=%27"+item.getAttribute("qid")+"%27&dbId=mysql_mysql_sqlpub_com_3306_haibara_haibara&token=af9dd0d32a374ff19e9cbb64c0dd90f2",
        method :"GET",
        headers: {
            "Content-type": "application/x-www-form-urlencoded"
        },
        onload:function(xhr){
            let tempAnswerTem=JSON.parse( xhr.responseText)
            console.log(tempAnswerTem );
                 answer=answer+","+(index+1)+":"+tempAnswerTem.result.rows[0].Answer;
                              item .setAttribute ("title", tempAnswerTem.result.rows[0].Answer);
        }
    });



//                        const { data, error } = await _supabase
//                             .from('Answers')
//                             .select('Answer')
//                             .eq('TestUrl',item.getAttribute("qid"))
//
//                             if(data){
//                                   answer=answer+","+(index+1)+":"+data[0].Answer;
//                                item .setAttribute ("title", data[0].Answer);
//                             }





     // answer=answer+","+(index+1)+":"+item.children[1].children[1].children[0].children[1].innerText
    }catch(err){
     answer=answer+","+(index+1)+":"+"空";
    }}

    }else{
    item .setAttribute("title",item.getAttribute('temp_title'));
    }
    }else{
     item .setAttribute("temp_title", item.getAttribute('title'));
      item.removeAttribute('title')
    }
            

                 // answer=answer+","+(index+1)+":"+item.children[0].children[1].children[1].children[0].children[1].innerText
                   });
              

                    console.log(answer)
                }

            }, false);
     }  // Your code here...
})();