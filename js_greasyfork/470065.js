// ==UserScript==
// @name         专利fee批量查询
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  。
// @author       angeljhon
// @match        *://www.qcc.com/*
// @match        *://interactive.cponline.cnipa.gov.cn/public-app-zljffw/feiyongcx/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/470065/%E4%B8%93%E5%88%A9fee%E6%89%B9%E9%87%8F%E6%9F%A5%E8%AF%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/470065/%E4%B8%93%E5%88%A9fee%E6%89%B9%E9%87%8F%E6%9F%A5%E8%AF%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create a new button element
    const button = document.createElement('button');
    button.innerText = '查询';

    // Change the button style
    button.style.backgroundColor = 'black';
    button.style.color = 'white';
    button.style.position = 'fixed';
    button.style.bottom = '20px';
    button.style.right = '5px';
    button.style.zIndex = '9999';
    button.style.width ='60px';
    button.style.height = '30px';

    const feecx_farme= document.createElement('ifarme');
    feecx_farme.style.backgroundColor='black';
    feecx_farme.style.bottom = '55px';
    feecx_farme.style.right = '5px';
    feecx_farme.style.height='400px';
    feecx_farme.style.width='280px';
    feecx_farme.style.zIndex = '9999';
    feecx_farme.style.position = 'fixed';

    const cp= document.createElement('p');
    cp.textContent='输入专利申请号，每行一个';
    cp.style.color='white';
    cp.style.fontSize='18px';

    const cl_btn=document.createElement('button');
    cl_btn.innerText = 'X';
    cl_btn.style.right = '5px';
    cl_btn.style.top='5px';
    cl_btn.style.position='absolute';

    const inp_text=document.createElement('textarea');
    inp_text.textContent='2023211529761\n2019218931256';
    inp_text.style.width='200px';
    inp_text.style.height='300px';
    inp_text.style.position='absolute';
    inp_text.style.left='5px';
    inp_text.style.top='25px';

    const cx_btn=document.createElement('button');
    cx_btn.innerText = '批量查询';
    cx_btn.style.backgroundColor='white';
    cx_btn.style.position='absolute';
    cx_btn.style.bottom='10px';
    cx_btn.style.left='80px';
    cx_btn.style.width='80px';
    cx_btn.style.height='30px';

    feecx_farme.appendChild(cp);
    feecx_farme.appendChild(cl_btn);
    feecx_farme.appendChild(inp_text);
    feecx_farme.appendChild(cx_btn);

    // Add the button to the page
    document.body.appendChild(button);

    // Add a click event listener to the button
    button.addEventListener('click', () => {document.body.appendChild(feecx_farme);});
    cl_btn.addEventListener('click',() => {document.body.removeChild(feecx_farme);});
    inp_text.addEventListener('click',() => {
        // inp_text.textContent='';
        var zlh=inp_text.value;
        var zll=zlh.split('\n');
        var zlls=[];
        for (var i=0; i<zll.length; i++){
            if(zll[i]!=""){zlls.push(zll[i]);
            }
        }
        console.log( zlls);
    });
    cx_btn.addEventListener('click', () => {
        var httpRequest = new XMLHttpRequest();//第一步：创建需要的对象
        httpRequest.open('POST', 'https://api.cponline.cnipa.gov.cn/zljffw/fycx/yjfywbl/listyjf-batchhdpage', true); //第二步：打开连接/***发送json格式文件必须设置请求头 ；如下 - */
        // httpRequest.setRequestHeader('Content-Type','application/json;charset=utf-8');//设置请求头 注：post方式必须设置请求头（在建立连接后设置请求头）
        httpRequest.setRequestHeader('User-Agent','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/114.0');
        httpRequest.setRequestHeader('Accept','application/json, text/plain, */*');
        httpRequest.setRequestHeader('Accept-Language','zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2');
        httpRequest.setRequestHeader('Accept-Encoding','gzip, deflate, br');
        httpRequest.setRequestHeader('Content-Type','application/json;charset=utf-8');
        httpRequest.setRequestHeader('Authorization','bearer 7047733e-c2ef-47ca-92d5-433bc07f5f22');
        var zlh=inp_text.value;
        var zll=zlh.split('\n');
        // var zlls=[];
        var obj = {"zhuanlisqhs":[],"size":10,"current":1};
        for (var i=0; i<zll.length; i++){
            if(zll[i]!=""){
                obj["zhuanlisqhs"].push(zll[i]);
            }
        }

        if (obj["zhuanlisqhs"].length!=0) {
           obj["size"]=obj["zhuanlisqhs"].length; 
           httpRequest.send(JSON.stringify(obj));//发送请求 将json写入send中
            /**
             * 获取数据后的处理程序
             */
            httpRequest.onreadystatechange = function () {//请求后的回调接口，可将请求成功后要执行的程序写在其中
                if (httpRequest.readyState == 4 && httpRequest.status == 200) {//验证请求是否发送成功
                    var json = httpRequest.responseText;//获取到服务端返回的数据
                    var jsobj = JSON.parse(json);
                    var scode = jsobj.code;
                    if (scode==200){
                        var jsdata= jsobj.result.records;
                        let str ='申请号,最近缴费日期,最近缴费类型,最近应缴费用,下次缴费日期,下次缴费类型,下次应缴费用\n';
                        jsdata.forEach(item => {
                            // 拼接json数据, 增加 \t 为了不让表格显示科学计数法或者其他格式
                            str = str + item.shenqingh+'\t,';
                            try{
                                var feelist=item.feeList;
                                feelist.forEach(ii =>{
                                    str = str + ii.jiaofeiqxjmr+'\t,'+ ii.feiyongmc+'\t,'+ ii.feiyongbz+'\t,';
                                })
                            }catch(e) {
                                str = str+"无费用"+'\t,';
                            }
                            // str = "${str + item[key] + '\t'},"
                            str += '\n'
                        });
                        console.log(str);
                        const uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(str);
                        // 通过创建a标签实现
                        const link = document.createElement("a");
                        link.href = uri;
                        // 对下载的文件命名
                        link.download ='zhualifeelist' + '.csv';
                        link.click();
                    }
                }
            };
        }
    });
}
)();