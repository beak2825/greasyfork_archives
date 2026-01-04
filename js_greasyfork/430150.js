// ==UserScript==
// @name         easyv-大屏导出失败（组件404）
// @namespace    http://tampermonkey.net/
// @version      0.2.3
// @description  可修复，大屏导出组件404，导致失败的场景
// @author       nian_yi
// @match        */create/*
// @icon         https://www.google.com/s2/favicons?domain=dtstack.net
// @grant        none
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/2.1.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/430150/easyv-%E5%A4%A7%E5%B1%8F%E5%AF%BC%E5%87%BA%E5%A4%B1%E8%B4%A5%EF%BC%88%E7%BB%84%E4%BB%B6404%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/430150/easyv-%E5%A4%A7%E5%B1%8F%E5%AF%BC%E5%87%BA%E5%A4%B1%E8%B4%A5%EF%BC%88%E7%BB%84%E4%BB%B6404%EF%BC%89.meta.js
// ==/UserScript==




const baseUrl = `${window.location.origin}/api/easyv`;

function load(delay = 5000){
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            resolve()
        },delay)
    })
}




async function getComponets(data,fn){
    if(data.panelConfig && data.panelConfig.length){
        data.panelConfig.forEach(d=>{
            d.stateConfig?.length && d.stateConfig.forEach(d=>{
                d && getComponets(d,fn);
            })
        })
    }
    fn(data.componentsConfig || []);
}

class Utils {
    constructor(){
        this.count=0;
        this.maxCount=0;
        this.componets = [];
    }

   getState(){
       return {
           count:this.count,
           maxCount:this.maxCount
       }
   }
   async getComponets(componets,fn){
        const data = await getComponets(componets,(list)=>{
            list && this.componets.push(...list);
        });
       fn && fn(this.componets)
    }
   filterRepeatScript(){
   // 清除重复脚本

   }
   async asyncGetScript(list,fn,map = []){
       if(this.count < this.maxCount){
           const item = list[this.count];
           if(!item){
               this.count++;
               this.asyncGetScript(list,fn,map)
               return;
           }
           const base = JSON.parse(item.base);
           const key = `${base.module_name}-${base.version}`;
          // console.log(map.has(key),base)
           if(map[key]){
               if(map[key] === 404 && !item.parent){
                   fn(item);
               }
               this.count++;
               this.asyncGetScript(list,fn,map)
               return ;
           }
           const url = `${window.appConfig.ASSETS_URL}components/${base.module_name}/${base.version}/${base.module_name}.js`;
           const result = await fetch(url);
           map[key] = result.status;
           if(result.status === 404 && item.parent){
               fn(item);
                this.count++;
               this.asyncGetScript(list,fn,map);
               return;
           }
               this.count++;
               this.asyncGetScript(list,fn,map)
       }else{
           fn('end');
       }
    }
    getScriptState(scriptList){
      // 获取脚本状态
       const list = [];
       return new Promise((resolve,reject)=>{
           this.maxCount = scriptList.length;
           this.asyncGetScript(scriptList,(item)=>{
               if(item === 'end'){
                   // over
                   resolve(list);
               }else if(item){
                   list.push(item);
               }
           })
       })
    }
    recycle(param){
        // 删除接口
         return fetch(baseUrl+'/v4/components/recycle', {
             body: JSON.stringify({
                 screenId: param.screenId,
                 layers:[
                     {
                     children: [],
                     id:param.id
                     }
                 ]
             }),
             headers: {
                 'content-type': 'application/json'
             },
             method: 'POST'
         })
           .then(response => response.json());
    }
   async removeComponent(list){
        const len = list.length;
       list.forEach(async value=>{
           const  result = await this.recycle(value);
           if(result.success){
               layui.layer.msg(`${value.name}-${value.id}删除成功`);
           }else{
               layui.layer.msg(`${value.name}-${value.id}删除失败`);
           }
       })
       /*
       layui.layer.open({
           title: '删除中...',
           content: `当前进度：${Math.round(count / len * 100)}`,
           btn:''
       });
    */
    }
}



( async function() {
   $(document.head).append(`<link href="https://www.layuicdn.com/layui/css/layui.css?t=${Date.now()}" rel="stylesheet">`);
   $(document.body).append(`<script rel="preload" src='https://www.layuicdn.com/layui/layui.js?t=${Date.now()}'></script>`);
   const utils = new Utils();
    await load();
    const lastHeader = $('#screen-header>div:last');
    if(!lastHeader){
        return false;
    }
    const sdkDownload = $("#screen-header>div:last > span:eq(2)").clone().attr('id','sdkDownload');
    $(lastHeader).prepend(sdkDownload);
    layui.use('layer', function(){
        const layer = layui.layer;
    });
    await load(1000); //延迟1s
    $('#sdkDownload').click(async function(){

        const fetchLoading = layui.layer.open({
            title: '查询数据中...'
            ,content: `<div style="text-align:center" ><i class="layui-icon layui-icon-loading-1 layui-anim layui-anim-rotate layui-anim-loop"></i></div>`,
            btn:''
        });
       const result = await getExport();

        if(!result.success){
            layui.layer.closeAll()
            layui.laer.msg(result.message||'未知错误')
        }else {
            await utils.getComponets(result.data,async (component_list)=>{
                const result = await utils.getScriptState(component_list);
                layui.layer.close(fetchLoading);
                if(!result || !result.length){
                layui.layer.msg('当前大屏不存在404组件');
                return false;
                }
                const confirm =  layui.layer.confirm('是否确认删除?', {title:'提示'}, function(index){
                    //do something
                    layui.layer.close(confirm);
                    utils.removeComponent(result); // 删除组件
                });
                //console.log(result);
            });
        }
    })


    // 获取当前大屏导出数据信息
    async function getExport(){
        const id = window.location.pathname.split('create/')[1];
        if(!id){
            return { message: "当前大屏路径不正确",success: false }
        }
        return await fetch(baseUrl+'/v3/screen/export?id='+id)
            .then(function(response) {
            return response.json();
        })
    };
})();