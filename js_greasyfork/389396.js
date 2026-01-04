// ==UserScript==
// @name         众智小助手
// @namespace    http://www.zzcrowd.com
// @version      0.8
// @description  众智的小助手，更省力！
// @author       me10zyl
// @match        https://www.zzcrowd.com/label/index.html
// @connect      api.zzcrowd.com
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/389396/%E4%BC%97%E6%99%BA%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/389396/%E4%BC%97%E6%99%BA%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let interval1,interval2, insertBtn, span, input;
    let uid;
    let badmans = [];

    let clickGroup = function(){
                    console.log('group clicked');
                    setTimeout(function(){
                        bind();
                    }, 2000);
    }

    function bind(){
        insertBtn = document.createElement('button');
        insertBtn.id = 'insertBtn'
        insertBtn.innerText = '开启自动审核'
        span = document.createElement('span');
        span.id = 'insertSpan'
        span.innerText = '审核间隔(毫秒):'
        span.style['margin-left'] = '5px';

        input = document.createElement('input');
        input.id = 'insertInput'
        input.value = 500;

        function findInterval(selector, callback){
            /*
            let count = 0;
            let a = document.querySelector(selector);
            interval1 = setInterval(function(){
                if(a == null){
                    a = document.querySelector(selector);
                    count ++;
                    if(count === 30){
                        clearInterval(interval1);
                    }
                }else{
                    clearInterval(interval1);
                    callback(a);
                }
            }, 500);*/
            callback(document.querySelector(selector));
        }

        //insertBtn.style.float = 'right';
        findInterval('.label-edit-comment', function(div){
            if(!div){
                return;
            }
            div.insertBefore(insertBtn, div.lastChild);
            div.insertBefore(span, div.lastChild);
            div.insertBefore(input, div.lastChild);
           console.log('insert;');
             var config = { characterData: true, attributes : true, childList: true, subtree : true}
              var observer = new MutationObserver(function(mutations, ob) {//构造函数回调
                  console.log(mutations);
                  //bind();
              });

            //observer.observe(document.querySelector('svg'),config);
            checkBadman();
            insertKfName(div);

            let btns = document.querySelectorAll('.edit-groups .edit-button button');

            for(let i = 0;i < btns.length;i++){
                btns[i].removeEventListener('click', clickGroup);
                btns[i].addEventListener('click', clickGroup)
            }
        });

        insertBtn.onclick = function(){
            let self = this;
            interval2 = setInterval(function(){
                passOrNot(document.querySelector('.label-edit-comment'));
            }, input.value);
        }

        /*
        findInterval('.edit-groups', function(groups){
           groups.addEventListener('click', function(){
               //checkBadman();
           });
        });*/
    }
     setTimeout(function(){
         bind();
     }, 2000);
    function insertKfName(div){
           let current = document.querySelector('.label-edit-comment:last-of-type .el-button:first-of-type').textContent;
           getKfName(current, function(name){
               let span = document.createElement('span');
               span.innerText = '('+name+')';
               div.insertBefore(span,div.lastChild);
           });
    }

    function getKfName(username, callback){
         GM_xmlhttpRequest({
                url :  'https://api.zzcrowd.com/account/v2/companies/128/employees?page=1&per_page=10&search='+username+'&uid='+uid+'&platform_id=1',
                method : 'GET',
                onload :function(data){
                    let json = JSON.parse(data.responseText);

                    if(json.items.length > 0){
                        callback(json.items[0].real_name);
                    }

                },onerror : function(d){
                     console.error('getBadmanPoolIds failed',d);
                }});
    }



    function checkBadman(){
        console.log('checkbadman');
        let showAlert = false;
           calcBadmans(function(bads){
               console.log(bads);
                   let current = document.querySelector('.label-edit-comment:last-of-type .el-button:first-of-type').textContent;
                   let contains = bads.filter(e=>e==current);
                   if(!showAlert && contains.length > 0){
                       alert('注意认真检查，这个人含有批驳图片！');
                       showAlert = true;
                   }
               });
    }

    function passOrNot(div){
        let status = div.querySelector('.el-button:nth-of-type(4)').textContent;
        console.log(status);
        if(status.match('合格') || status.match('未被抽样')){
            document.querySelector("#sub-data-text").click();
        }else{
            clearInterval(interval2);
            //bind();
        }
    }

    function getUID(){
        let exec = new RegExp('uid=(.+)(?:&|$)','g').exec(location.href);
        uid = exec[1]
    }

    getUID();



    function getInspectJobs(callback){
         let ids = [];
         GM_xmlhttpRequest({
                url : 'https://api.zzcrowd.com/label/v2/inspect-jobs?state=1&work_type_id=5&platform_id=1&uid=' + uid,
                method : 'GET',
                onload :function(data){
                    let json = JSON.parse(data.responseText);
                    json.items.forEach(e=>{
                        ids.push(e.id);
                    });
                      console.log('getBadmanPoolIds');
                    callback(ids);
                },onerror : function(d){
                     console.error('getBadmanPoolIds failed',d);
                }});
    }
    function getKulian(callback){
       getInspectJobs(function(ids){
            ids.forEach(id=>{
         GM_xmlhttpRequest({
                url : 'https://api.zzcrowd.com/label/v2/review-jobs/'+id+'/label-tasks?work-type=5&&fetch_skip=all&fetch_tag=all&fetch_editor_name=&fetch_checker_name=&platform_id=1&uid='+uid,
                method : 'GET',
                onload :function(data){
                    let json = JSON.parse(data.responseText);
                    let badmans = json.task_units.filter((e, index, self)=>e.task_review_tag != 20).map(e=>e.record.username).filter((e,index,self)=> self.indexOf(e) === index);
                    console.log('getBadmanIds');
                    callback(badmans);
                },onerror : function(d){
                     console.error('getBadmanIds failed',d);
                }});
        });
        });
    }


   function calcBadmans(callback){
   getKulian(function(badmans_){
      for(let i in badmans_){
          if(badmans.indexOf(badmans_[i]) < 0){
              badmans.push(badmans_[i])
          }
      }
       //badmans = ['tj_yuan111']
       console.log('calcBadmans', badmans);
       callback(badmans);
   });}

    //calcBadmans(function(){});
})();