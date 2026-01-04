// ==UserScript==
// @name         北京市环境整治管理平台索引脚本
// @namespace    http://tampermonkey.net/
// @description  用这个脚本让我们审核照片时更方便
// @author       福运连连
// @match        http://sjdc.rjhjhc.com/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      *
// @license MIT
// @version 0.7
// @downloadURL https://update.greasyfork.org/scripts/451119/%E5%8C%97%E4%BA%AC%E5%B8%82%E7%8E%AF%E5%A2%83%E6%95%B4%E6%B2%BB%E7%AE%A1%E7%90%86%E5%B9%B3%E5%8F%B0%E7%B4%A2%E5%BC%95%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/451119/%E5%8C%97%E4%BA%AC%E5%B8%82%E7%8E%AF%E5%A2%83%E6%95%B4%E6%B2%BB%E7%AE%A1%E7%90%86%E5%B9%B3%E5%8F%B0%E7%B4%A2%E5%BC%95%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
var plugin_innerHTML=''
var plugin_data= []
var classification_complete= []
var id_page_map= {}
function getURL_GM(url) {
    return new Promise(resolve => GM_xmlhttpRequest({
        method: 'GET',
        url: url,
        headers:{'Authorization': 'bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9zamRjLWFwaS5yamhqaGMuY29tXC91c2VyXC9sb2dpbiIsImlhdCI6MTY2MjU5NDEwOSwiZXhwIjoxNjYzMTk4OTA5LCJuYmYiOjE2NjI1OTQxMDksImp0aSI6Ilp2akpPZDdHRVNWVVN5cnQiLCJzdWIiOjM5NDIsInBydiI6ImY2NGQ0OGE2Y2VjN2JkZmE3ZmJmODk5NDU0YjQ4OGIzZTQ2MjUyMGEiLCJkb21haW4iOiJzamRjLWFwaS5yamhqaGMuY29tIn0.MDfviD1z6ZEdxthoTV0nXNJLv_-R9U5kzMOPy1ez3RI'    },
        onload: function (response) {
            if (response.status >= 200 && response.status < 400) {
                resolve(response.responseText);
            } else {
                console.error(`Error getting ${url}:`, response.status, response.statusText, response.responseText);
                resolve();
            }
        },
        onerror: function (response) {
            console.error(`Error during GM.xmlHttpRequest to ${url}:`, response.statusText);
            resolve();
        }
    }));
}
function createHTML() {
    let example = document.querySelector("#plugin")
    example.innerHTML = plugin_innerHTML
    function home_page_onclick( ){
        //console.log("home_page_onclick")
        //console.log( document.getElementsByClassName('el-button fr el-button--default')[0]  )
        if(document.getElementsByClassName('el-button fr el-button--default').length>0)
        {
            document.getElementsByClassName('el-button fr el-button--default')[0] .click()
        }
    }
    document.querySelector("#home_page") .onclick=home_page_onclick
    function plugin_onclick(t){
        //console.log("plugin_onclick")
        //console.log(t.srcElement.id)
        if(document.getElementsByClassName('el-button fr el-button--default').length>0)
        {
            document.getElementsByClassName('el-button fr el-button--default')[0] .click()
            setTimeout(()=>{
                plugin_onclick(t)
            },100 )
        }
        else{
            let temp_number =  document.getElementsByClassName('number')
            if(temp_number.length>0)
            {
                // console.log( id_page_map [ t.srcElement.id  ])
                for( let i=0  ;i< temp_number .length ;i++ )
                {
                    if (temp_number[i]. innerText ==   id_page_map [ t.srcElement.id  ]) {
                        let temp =document.getElementsByClassName('el-table__row')
                        if(temp.length>0)
                        {
                            for( let i=0  ;i< temp .length ;i++ )
                            {
                                if (temp[i]. innerText.includes( t.srcElement.id   )) {
                                    temp[i].children[8].children[0].children[1] .click()
                                    return
                                }
                            }
                        }
                        else{
                            setTimeout(()=>{
                                plugin_onclick(t)
                            },100 )
                        }
                        break
                    }
                }
                if(id_page_map [ t.srcElement.id  ]!=undefined){
                    if(temp_number[  id_page_map [ t.srcElement.id  ]-1]!=undefined){
                        temp_number[  id_page_map [ t.srcElement.id  ]-1].click()
                        setTimeout(()=>{
                            plugin_onclick(t)
                        },100 )
                    }
                }
            }
            else{
                setTimeout(()=>{
                    plugin_onclick(t)
                },100 )
            }
        }
    }
    let temp =document.getElementsByClassName('plugin_onclick_class')
    for( let i=0  ;i< temp .length ;i++ )
    {
        //console.log(temp[i])
        temp[i].onclick=plugin_onclick
    }
}
function addStyle() {//background-color:  #4caf50; color: #ffffff
    let css = `
.plugin{
position:fixed;
top:120px;
left:10px;
height:calc(100% - 150px);
width:180px;
z-index:11111111;
overflow-y: auto;
overflow-x: visible;
}
`
    GM_addStyle(css)
}
function get_images(n) {
    //console.log(n)
    if(n<plugin_data.length){
        if (classification_complete.includes(plugin_data[n]['id']) )
        {
            plugin_data[n]['images_number']=  0
            get_images(n+1)
        }
        else{
            getURL_GM('http://sjdc-api.rjhjhc.com/tasks/check/'+plugin_data[n]['id']+'?cate_id=0') .then(res => {
                if(res.length>100){
                    res =JSON.parse(res)
                    //console.log(res)
                    plugin_data[n]['images_number']= res.data.images.length
                    if(0==res.data.images.length)
                    {
                        classification_complete.push(plugin_data[n]['id'])
                    }
                }
                get_images(n+1)
            })
        }
    }
    else{
        //console.log(plugin_data)
        for( let i in plugin_data )
        {
            if(plugin_data [i] [ 'images_number']>10)      {
                plugin_data [i] [ 'images_number']    =   ' <b style="color:rgb(255,0,0)">'+plugin_data [i] [ 'images_number']+'</b> '
            }else if(plugin_data [i] [ 'images_number']>0)  {
                plugin_data [i] [ 'images_number']    =   ' <b style="color:rgb(0,0,255)">'+plugin_data [i] [ 'images_number']+'</b> '
            }    else{
                plugin_data [i] [ 'images_number']    =   ' <b >'+plugin_data [i] [ 'images_number']+'</b> '
            }
            plugin_innerHTML+= '<span id='+plugin_data [i] [ 'id']+' class="plugin_onclick_class el-tag el-tag--light">'+plugin_data [i] [ 'village_name']+ plugin_data [i] [ 'images_number'] +plugin_data [i] [ 'task_date']+'</span>'
        }
        createHTML()
        addStyle()
        setTimeout(()=>{
            plugin_data=[]
            get_lists('http://sjdc-api.rjhjhc.com/tasks/lists?check_status=1&search=&page=1')
        },1000 )
    }
}
function get_lists(url) {
    getURL_GM(url) .then(res => {
        if(res.length>100){
            res =JSON.parse(res)
            //console.log(res)
            for( let i in res.data.data )
            {
                //console.log(   res.data.data [i])
                if(res.data.data [i][ 'task_date'].length>5){
                    res.data.data [i][ 'task_date']=res.data.data [i][ 'task_date'].substring(5)
                }
                if(res.data.data [i][ 'task_date'].length>3){
                    res.data.data [i][ 'task_date']=res.data.data [i][ 'task_date'].substring(0,res.data.data [i][ 'task_date'].length-3)
                }
                let temp ={ 'id':   res.data.data [i][ 'id']  ,    'task_date': res.data.data [i][ 'task_date'],    'village_name':   res.data.data [i][ 'village'] [ 'village_name'], 'images_number':-1  }
                //console.log(temp)
                plugin_data.push(temp)
                id_page_map [ res.data.data [i][ 'id']]=  res.data.current_page
            }
            if( res.data.next_page_url!=null )
            {
                get_lists(res.data.next_page_url   )
            }else{
                //console.log(plugin_data)
                plugin_innerHTML='<span id="home_page" class="el-tag el-tag--light"><b>返回</b></span>'
                get_images(0)
            }
        }
    })
}
(function() {
    'use strict';
    console.log("test")
    window.onload=function(){
        let logo = document.querySelector("#app")   // console.log(logo)
        let example = document.createElement("div")
        example.classList.add("plugin")
        example.id='plugin'
        logo.appendChild(example)
        plugin_data=[]
        get_lists('http://sjdc-api.rjhjhc.com/tasks/lists?check_status=1&search=&page=1')
    }
})();