// ==UserScript==
// @name         一个还凑合的自动生成表单和表格的工具
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @include    http://172.16.10*/doc.html
// @require    http://code.jquery.com/jquery-1.11.0.min.js
// @require    https://unpkg.com/vue/dist/vue.min.js
// @grant        GM_setClipboard

// @downloadURL https://update.greasyfork.org/scripts/407163/%E4%B8%80%E4%B8%AA%E8%BF%98%E5%87%91%E5%90%88%E7%9A%84%E8%87%AA%E5%8A%A8%E7%94%9F%E6%88%90%E8%A1%A8%E5%8D%95%E5%92%8C%E8%A1%A8%E6%A0%BC%E7%9A%84%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/407163/%E4%B8%80%E4%B8%AA%E8%BF%98%E5%87%91%E5%90%88%E7%9A%84%E8%87%AA%E5%8A%A8%E7%94%9F%E6%88%90%E8%A1%A8%E5%8D%95%E5%92%8C%E8%A1%A8%E6%A0%BC%E7%9A%84%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let fields = []
    $('body').append(`
<style>
tr.active{
background-color:#f003;
}
tr.active td{
background-color:#f003!important;
}
#form{
    position: absolute;
top:60px;
right:0;
z-index:100;
background-color:#0005;

}
#form ul{
margin:10px;
padding-left:0}
#form li {
color:#fff;
list-style:none
}
#form li a{
font-size:16px;
margin:4px;
}
</style>
`)
    $('body').append(`
<div id="form">
<template v-if="fields.length">
<ul>
<li v-for="(e,index) in fields " :key="e.field">
<a @click="up(index)">↑</a>
<a @click="down(index)">↓</a>
<a @click="remove(index)">x</a>
<span>{{e.field}}</span>
<span>{{e.title}}</span>
<span>{{e.type}}</span>
</li>
</ul>
<button @click=copyForm>复制表单</button>
<button @click=copyVxeTable>复制表格</button>
<button @click=copyDetail>复制详情</button>
</template>
</div>
`)
    const app = new Vue({
        el:'#form',
        data:{
            fields:[]
        },
        methods:{
            up(index){
                const prevItem = this.fields[index-1]
                this.fields[index-1] = this.fields[index]
                this.fields[index] = prevItem
                this.fields = this.fields.slice()
            },
            down(index){
                const nextItem = this.fields[index+1]
                this.fields[index+1] = this.fields[index]
                this.fields[index] = nextItem
                this.fields = this.fields.slice()
            },
            remove(index){
                this.fields.splice(index,1)
            },
            copyForm(){
                let result = `<el-form label-width="100px">`;
                for (let e of this.fields) {
                    result += `
        <el-form-item label="${e.title}" prop="${e.field}">
            <el-input v-model="form.${e.field}"></el-input>
        </el-form-item>`;
                }
                result += `
      </el-form>`;
                GM_setClipboard(result);
            },
            copyVxeTable() {
                let result = `<vxe-table :data="list">`;
                for (let e of this.fields) {
                    result += `
        <vxe-table-column title="${e.title}" field="${e.field}"></vxe-table-column>`;
                }
                result += `
      </vxe-table>`;
                GM_setClipboard(result);
            },
            copyDetail(){
                let result = `<ul>`
                  for (let e of this.fields) {
                      result += `
       <li><span>${e.title}</span><span>{{detail.${e.field}}}</span></li>`;
                  }
                result += `
       </ul>`;
                 GM_setClipboard(result);
            }

        },
        mounted(){
            const _this = this
            $('body').on('click','tr',function(e){
                console.log(e)
                if(!e.ctrlKey)return false
                const tr = $(this)
                const isActive = tr.hasClass('active')
                if(isActive){
                    _this.fields = _this.fields.filter(item=>item.field!==tr.find('td').eq(0).text())
                }else{
                    _this.fields.push({
                        field:tr.find('td').eq(0).text().trim(),
                        title:tr.find('td').eq(1).text().trim().replace(/（.*）/,''),
                        type:tr.find('td').eq(2).text().trim()
                    })
                }
                tr.toggleClass('active')
            })
        }
    })
    })();