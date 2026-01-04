
// ==UserScript==
// @name         召唤之王辅助
// @namespace    PMscripts
// @version      3.9.0
// @description  召唤之王脚本
// @author       PM
// @license      GNU General Public License v3.0
// @match        http://129.204.193.135:8036/zhzw/*
// @match        http://119.29.88.183/nzh/*
// @match        http://47.108.60.249:9998/lszh/*
// @icon         http://129.204.193.135:8036/zhzw/pic/home/zhlogo.png

// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_addValueChangeListener
// @grant        GM_listValues
// @grant        GM_notification
// @grant        GM_xmlhttpRequest
// @connect      localhost
// @connect      192.168.43.37
// @connect      192.168.7.2

// @downloadURL https://update.greasyfork.org/scripts/454721/%E5%8F%AC%E5%94%A4%E4%B9%8B%E7%8E%8B%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/454721/%E5%8F%AC%E5%94%A4%E4%B9%8B%E7%8E%8B%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==
/* 
   @grant        GM_getResourceText
   @require      file://C:\Users\PM\OneDrive\召唤之王\召唤之王辅助.user.js
   @resource config file://C:\Users\PM\OneDrive\PMS\zhzw\zhzw_record.json
   GM_xmlhttpRequest({
    method: "GET",
    url: 'http://localhost:233/zhzw/zhzw_record.json',
    onload: function(response) {
        console.log(response.responseText);
    }
})

*/

function save_record(){
    let time=getdatetime()
    GM_setValue('记录修改时间',time)
    let config={'记录修改时间':time}
    for(let item of GM_listValues()){if(item=='记录修改时间'){continue};config[item]=GM_getValue(item)}
    GM_xmlhttpRequest({
        url:"http://localhost:233/update_record.ashx",
        method: "POST",
        data: JSON.stringify(config,null,space=' '),
        headers: {
            "Content-type": "application/x-www-form-urlencoded"
        },
        onload:function(xhr){
            console.log(xhr.responseText);
        }
    })
}

var script_version="3.8.8"
var href=window.location.href
var sid=href.match(/sid=([\d_\w]+)/)[1]
var myId=sid.split('_')[0]
var fenqu='/'+href.split('/')[3]
var All_GM_Value=GM_getValue(fenqu+'_'+myId+'_allGMvalue',{})

async function sync_GMvalue(){
    let config=''
    try{config=GM_getResourceText('config')}catch{}
    
    if(!config){
        
        await new Promise((resolve,reject)=>{
            GM_xmlhttpRequest({
                url:"http://192.168.7.2:233/zhzw/zhzw_record.json",
                method: "GET",
                timeout: 500,
                onload:function(xhr){
                    resolve(config=xhr.responseText)
                },
                ontimeout:()=>{
                    resolve()
                }
            })
        })
        
        await new Promise((resolve,reject)=>{
            GM_xmlhttpRequest({
                url:"http://192.168.43.37:233/zhzw/zhzw_record.json",
                method: "GET",
                timeout: 500,
                onload:function(xhr){
                    resolve(config=xhr.responseText)
                },
                ontimeout:()=>{
                    resolve()
                }
            })

        })
 
    }

    if(!config){return false}
    config=JSON.parse(config)

    if(config.脚本版本>script_version){window.location.href=homeurl}
    if(GM_getValue('记录修改时间')==config.记录修改时间){return false}
    for(let name in config){
        //console.log('导入',name)
       
        try{config[name].config.auto_refresh_switch=New_getValue('auto_refresh_switch',1)}catch{}
        GM_setValue(name,config[name])
    }
    All_GM_Value=GM_getValue(fenqu+'_'+myId+'_allGMvalue',{})
    console.log('已同步记录')
    return true
}
sync_GMvalue()

try{
    if(document.getElementsByClassName('margin-b-5')[0].innerHTML=="你的请求过快,请悠着点来吧!"){
        let record_refresh_times=New_getValue('record_refresh_times',0)
        if(record_refresh_times++ < 10){
            New_setValue('record_refresh_times',record_refresh_times)
            setTimeout(location.reload(),Math.floor(1000+Math.random()*1000))
        }
    }
}catch{New_setValue('record_refresh_times',0)}

var All_workers=[]
var HuoLiCaoNum={}

var demon_text=[]
var config_changed={}
var config_mode=false
var running_task={}
var isHome=false
var isWoker=false
var notWoker=true
var movetown_taskid=''

var fenqu_worker=href.split(':')[0]+'://'+window.location.host+fenqu
var weekday=new Date().getDay()
var xmlhttp=new XMLHttpRequest()

function syncTime(){
    datetime=getdatetime()
    console.log(datetime)
    today=datetime.split(' ')[0]
    timenow=datetime.split(' ')[1]
}
syncTime()
var going_task=All_GM_Value.going_task
if(!going_task){going_task={};All_GM_Value.going_task={}}
console.log(All_GM_Value)
var GM_share=GM_getValue('GM_share')
console.log(GM_share)
var Activity=New_getValue('record_Activity',[])

var city_map={林中空地: ['森林入口','宁静之森','森林秘境'],幻灵镇:['呼啸平原','天罚山'],定老城:['石工矿场','幻灵湖畔'],迷雾城:['回音之谷','死亡沼泽'],
飞龙港:['日落海峡','聚灵孤岛'],落龙镇:['龙骨墓地','巨龙冰原'],圣龙城:['圣龙城郊','皇城迷宫'],乌托邦:['梦幻海湾','幻光公园'],莫维尔:['英雄遗址','沉睡神殿']}

/*
GM_listValues().filter(name=>{name.match(/\/\w+_\d+_allGMvalue/) || GM_deleteValue(name)})
Object.keys(All_GM_Value).filter(name=>{
    ['going_task','time','config','record','配置名称'].indexOf(name)==-1 && delete All_GM_Value[name]
})
*/

Object.defineProperty(All_GM_Value, 'going_task', {
    //configurable: true,
    get: function() { //取值的时候会触发
        //console.log('get: ', going_task);  
        return going_task
    },
    set: function(value) { //更新值的时候会触发
        going_task = value;
        if(!isHome){return}

        let tasktext=[]
        for(let eachtask in going_task){
            let text=going_task[eachtask].text
            if(text){
                tasktext.push(text)
            }else{
                let value=going_task[eachtask].value
                if(value || value===0 || value==='0'){
                    tasktext.push(eachtask+': '+value)
                }else{
                    tasktext.push(eachtask)
                }
            }
        }
        setIdinnerHTML('task_text',tasktext.join(' | '))

    }
})


const newUrl= (url,add='') => {
    if(typeof(url)=='string'){
        return fenqu+url+sid+add
    }else{
        return fenqu+url.join(sid)+add
    }
}

class userInfo{
    constructor(userId){
        this.userId=userId
    }
    info(){return getHttpResponseAsync(fenqu+'/user/userInfo.asp?sid='+sid+'&userId='+this.userId)}
    Lv(){return this.info().match(/>等级:[^<]+Lv\.(\d+)/)[1]-0}
    Huoli(){return this.info().match(/>活力:(\d+)/)[1]-0}
    UsedHuoli(){let Huoli=this.info().match(/>活力:(\d+)\/(\d+)/);return Huoli[2]-Huoli[1]}
    Zhanli(){return this.info().match(/>战力:(\d+)/)[1]-0}
    PetNum(){return this.info().match(/petInfo/g).length}
    City(){return this.info().match(/townInfo.*?&amp;id=(\d+)/)[1]-0}
}

class myInfo{
    static info(){return new userInfo(myId).info()}
    static Lv(){return new userInfo(myId).Lv()}
    static Huoli(){return new userInfo(myId).Huoli()}
    static UsedHuoli(){return new userInfo(myId).UsedHuoli()}
    static Zhanli(){return new userInfo(myId).Zhanli()}
    static PetNum(){return getHttpResponseAsync(newUrl('/pet/battleTeam.asp?sid=')).match(/petInfo/g).length}
    static City(){return new userInfo(myId).City()}
    static VIP(){
        let VIPtext=getHttpResponseAsync(fenqu+'/vip/index.asp?sid='+sid)
        if(VIPtext.match('未成为VIP')){return 0}
        else{return VIPtext.match(/VIP(\d+)等级特权/)[1]-0}
    }
}

class Task{
    constructor(name,fn,value,text){
        this.name=name
        this.fn=fn
        this.value=value
        this.text=text
    }
    onlyShow(){
        if(this.value==undefined){this.value=''}
        update_goingtask('show',this.name,this.text,'text')
    }   
    add(){
        if(this.value==undefined){this.value=''}
        update_goingtask('add',this.name,{fn: this.fn, value: this.value, text: this.text})
    }
    run(){
        for(let task in going_task){
            let value=going_task[task].value
            if(typeof(value)=='object'){value=JSON.stringify(value)}
            try{
                eval(going_task[task].fn+'('+value+')')
                console.log('going task: '+going_task[task].fn+'('+value+')')
            }catch{update_goingtask('del',task)}
        }
    }
    del(){
        update_goingtask('del',this.name)
    }
}
//New_setValue('going_task',{})

const newWorker = args => {
    let script = `
All_GM_Value = ${JSON.stringify(All_GM_Value)}
going_task = ${JSON.stringify(going_task)}
running_task = ${JSON.stringify(running_task)}
Activity = ${JSON.stringify(Activity)}
GM_share = {}//${JSON.stringify(GM_share)}
var isWoker=true
var notWoker=false
var href='${href}'
var sid='${sid}'
var myId='${myId}'
var fenqu='${fenqu_worker}'
var weekday=${weekday}
var datetime='${datetime}'
var today='${today}'
var timenow='${timenow}'
var city_map=${JSON.stringify(city_map)}
var movetown_taskid='${movetown_taskid}'
var isHome=${isHome}
var HuoLiCaoNum={}
var last_sync_GM_share=''
var config_mode=false
var xmlhttp=new XMLHttpRequest()
const newUrl= (url,add='') => {
    if(typeof(url)=='string'){
        return fenqu+url+sid+add
    }else{
        return fenqu+url.join(sid)+add
    }
}
function command(fn){
    postMessage({data:{action:'command',command: fn}})
}
onmessage = ({data:{data}}) => {
    if(data.action=='sync'){
        eval('All_GM_Value='+data.value)
        going_task = All_GM_Value.going_task
        //console.log('sync',All_GM_Value)
        //console.log('sync',going_task)
    }else if(data.action=='sync_var'){
        eval(data.name+'='+data.value)
        if(data.name=='GM_share'){last_sync_GM_share=getdatetime()}
    }
}
`
    let presetFn=['update_goingtask','getHttpResponseAsync','postHttpResponseAsync','getdatetime','getdate','gettime','syncTime','timeDelta','New_getValue','New_setValue','sleep','get_moving_time']
    let fn_read=[]
    let fn_new=Array.from(new Set([...presetFn,...args.fn]))
    while(fn_new.length>0){
        let fn_newin=[]
        for(let fn of fn_new){
            fn_read.push(fn)
            fn=eval(fn).toString()
            script+=fn+'\n'
            let fn_in=fn.split('\n')[1].match(/fn_worker=(.*)/)
            if(!fn_in){continue}
            fn_newin.push(...eval(fn_in[1]))
        }
        fn_new=fn_newin.filter(fn=>fn_read.indexOf(fn)==-1)
    }

    if(args.task){
        new Task(args.task[0],args.task[1],args.task[2],args.task[3]).add()
        script+='\ngoing_task='+JSON.stringify(going_task)+';console.log(going_task)\n'

    }

    if(args.vars){
        for(variable of args.vars){
            if(typeof(variable)=='object'){
                for(let name in variable){
                    let value=variable[name]
                    value=JSON.stringify(value)
                    script+=name+' = '+value+'\n'
                }
            }else{
                let value_temp=eval(variable)
                value=JSON.stringify(value_temp)
                if(value == undefined){value=value_temp}
                script+=variable+' = '+value+'\n'
            }
        }
    }
    if(args.text){
        script+=args.text
    }
    const worker = new Worker (
        URL.createObjectURL(new Blob([script]))
    )
    All_workers.push(worker)
    worker.onmessage = ({data:{data}}) => {
        if(data.action=='command'){eval(data.command)}
        else if(data.action=='sync_var'){worker.postMessage({data:{action:'sync_var',name:data.name,value:JSON.stringify(eval(data.name))}})}
    }
}


function update_goingtask(action,name,value,item='',sync=1){
    if(action=='del'){delete running_task[name];delete going_task[name]}
    else if(action=='add'){
        going_task[name]=value
    }else if(action=='show'){
        if(!going_task[name]){going_task[name]={}}
        going_task[name][item]=value
    }

    if(isWoker){
        postMessage({data:{action:'command',command: `update_goingtask("${action}",${JSON.stringify(name)},${JSON.stringify(value)},"${item}",0)`}})
    }else{
        if(action!='show'){New_setValue('going_task',going_task,sync)}else{All_GM_Value.going_task=going_task}
    }
}

function New_setValue(name,value,sync=0){
    if(value===undefined || value===false){value=''}
    let add={}
    let is_root=false
    if(typeof(name)=='object'){
        let [type,list]=name
        add[type]={}
        if(typeof(list)=='object'){
            for(let item in list){
                Object.assign(add[type],{[item]:list[item]})
            }
        }else{
            if(type=='root'){
                is_root=true
                Object.assign(add,{[list]:value})
            }else{
                Object.assign(add,{[type]:{[list]:value}})
            }
        }
    }else{
        if(name=='going_task'){
            is_root=true
            Object.assign(add,{[name]:value})
        }else{
            let type='config'
            if(name.match('^last_|^next_')){type='time'}
            else if(name.match('^record_')){type='record'}
            Object.assign(add,{[type]:{[name]:value}})
        }
    }
    if(notWoker && GM_getValue('last_sync_config')>New_getValue('last_sync_config')){
        console.log('同步配置')
        All_GM_Value=GM_getValue(fenqu+'_'+myId+'_allGMvalue')
        if(All_GM_Value.time==undefined){All_GM_Value.time={}}
        All_GM_Value.time.last_sync_config=getdatetime()
    }
    if(is_root){
        config_mode && Object.assign(config_changed,add)
        Object.assign(All_GM_Value,add)
    }else{
        for(let item in add){
            if(config_mode){
                if(config_changed[item]==undefined){config_changed[item]={}}
                Object.assign(config_changed[item],add[item])
            }
            if(All_GM_Value[item]==undefined){console.log(All_GM_Value,item,'={}');All_GM_Value[item]={}}
            Object.assign(All_GM_Value[item],add[item])
        }
    }
    //console.log(add,config_changed)
    if(isWoker){
        postMessage({data:{action:'command',command: `New_setValue(${JSON.stringify(name)},${JSON.stringify(value)},0)`}})
    }else{
        if(sync && All_workers.length){
            let All_GM_Value_stringify=JSON.stringify(All_GM_Value)
            for(let worker of All_workers){worker.postMessage({data:{action: 'sync',value: All_GM_Value_stringify}})}
        }
        GM_setValue(fenqu+'_'+myId+'_allGMvalue',All_GM_Value)
    }
}

function New_getValue(name,defaultValue=''){
    let value=undefined
    if(typeof(name)=='object'){
        let [type,item]=name
        if(type=='root'){value=All_GM_Value[item]}else{try{value=All_GM_Value[type][item]}catch{}}
    }else{
        if(name=='going_task'){
            value=All_GM_Value[name]
        }else{
            let type='config'
            if(name.match('^last_|^next_')){type='time'}
            else if(name.match('^record_')){type='record'}
            try{value=All_GM_Value[type][name]}catch{}
        }
    }
    if(value===undefined || value===false || value===''){return defaultValue}else{return value}
}

function getdatetime(hrs=0,mins=0,secs=0,days=0,addmode=1){
    let ctime=new Date()
    mins-=ctime.getTimezoneOffset()
    if((typeof(days)=='number' && !addmode) || (days && addmode)){ctime.setDate(addmode?ctime.getDate()+(days-0):days)}
    if(hrs || !addmode){ctime.setHours(addmode?ctime.getHours()+(hrs-0):hrs)}
    if(mins || !addmode){ctime.setMinutes(addmode?ctime.getMinutes()+(mins-0):mins)}
    if(secs || !addmode){ctime.setSeconds(addmode?ctime.getSeconds()+(secs-0):secs)}
    return(ctime.toJSON().slice(0,-1).replace('T',' '))
}

function getdate(days=0,addmode=1){
    return getdatetime(0,0,0,days,addmode).split(/[ T]/)[0]
}

function gettime(hrs=0,mins=0,secs=0,addmode=1){
    return getdatetime(hrs,mins,secs,0,addmode).split(/[ T]/)[1]
}

function timeDelta(time1,time2,no_ms=false){
    if(!time1){return 0}
    if(time1==time2){return 1}

    time1=time1&&time1.match(' ')?time1:today+' '+time1
    if(no_ms){time1=time1.split('.')[0]}
    time1=new Date(time1).getTime()
    if(!time2){
        time2=new Date().getTime()
    }else{
        time2=time2.match(' ')?time2:today+' '+time2
        time2=new Date(time2).getTime()
    }
    return time1-time2>0?time1-time2:0
}

async function showUserInfo(info,skip=[]){
    if(!info){return}
    var alluser=document.documentElement.outerHTML.match(/userId=\d+/g)
    if(alluser){
        replaceHTML(/(\/user\/userInfo.*?a>)/g,"$1<span class=userInfo></span>")
        for(let i=0;i<alluser.length;i++){
            if(skip.indexOf(i)>=0){continue}
            let url=fenqu+'/user/userInfo.asp?sid='+sid+'&'+alluser[i]

            await getHttpResponse(url).then(text=>{
                let showInfo=[]
                if(info.match('战力')){showInfo.push(text.match(/战力:(\d+)/)[0])}
                if(info.match('黑名单') && text.match('解除黑名单')){showInfo.push('黑名单')}
                if(showInfo.length){document.getElementsByClassName('userInfo')[i].innerHTML='('+showInfo.join(',')+')'}
            })
                
        }
    }
}

function sleep(time) {
    return new Promise(resolve => setTimeout(resolve, time))
}

function randomOne(array){
    let index=Math.floor(Math.random()*array.length)
    return [array[index],index]
}

function getHttpResponse(url,delay=0) {
    return new Promise(resolve=>{
        setTimeout(()=>{
            xmlhttp.open('GET', url, true)
            xmlhttp.send()
            xmlhttp.onreadystatechange=function(){
                if (xmlhttp.readyState==4 && xmlhttp.status==200){
                    resolve(xmlhttp.responseText)
                }
            }
        },delay)
    })
}

function getHttpResponseAsync(url,add,no_retry=0){
    if(add){url=fenqu+url+sid+add}
    xmlhttp.open("GET",url,false)
    let retry=3
    while(retry-- >0){
        try{
            xmlhttp.open("GET",url,false)
            xmlhttp.send()
            if(xmlhttp.status != 200){continue}
            var text=xmlhttp.responseText.split(/<\/?body>/)[1]
            if(no_retry){break}
            if(text.substring(0,150).match(/请求过快|请稍后访问/)){
                console.log('请求过快，重新获取',url)
            }else{break}
        }catch(e){console.log(e)}
    }
    return text
}

function postHttpResponse(url,send){
    return new Promise(function (resolve, reject) {
        xmlhttp.open("POST",url,true)
        xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
        xmlhttp.send(send)
        xmlhttp.onreadystatechange=function(){
            if (xmlhttp.readyState==4 && xmlhttp.status==200){
                    resolve(xmlhttp.responseText)
            }
        }     
    })
}

function postHttpResponseAsync(url,send){
    xmlhttp.open("POST",url,false)
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
    xmlhttp.send(send)
    return xmlhttp.responseText
}

function getUserName(id){
    let text=getHttpResponseAsync(newUrl('/user/userInfo.asp?sid=')+'&userId='+id)
    console.log(text.match(/昵称:(.*?)<br\/>/)[1].replace(/[【<].*?[>】]/g,''))
}

function getuserzhanli(id){
    var url=fenqu+'/user/userInfo.asp?sid='+sid+'&userId='+id
    xmlhttp.open("GET",url,false)
    xmlhttp.send()
    return xmlhttp.responseText.match(/战力:(\d+)/)[1]
}

async function get_moving_time(map_html){
    if(!map_html){map_html=getHttpResponseAsync(newUrl('/nmap/index.asp?sid='))}
    let moving_time=map_html.match(/(?<=当前正在移动城市\(剩)\d+/) || [0]
    return moving_time[0]
}


async function movetown(dest,addTask=0){
    if(!isHome){
        await sleep(timeDelta(New_getValue('next_movetown')))
    }
    if(addTask){new Task('移动','movetown',dest,'').add()}
    var allcity=[,'林中空地','幻灵镇','定老城','迷雾城','飞龙港','落龙镇','圣龙城','乌托邦','莫维尔']
    let map_html=getHttpResponseAsync(newUrl('/nmap/index.asp?sid='))
    let moving_time=await get_moving_time(map_html)
    let current_city=map_html.match(/(?<=当前位置:)\S+/)[0]
    var current=allcity.indexOf(current_city)
    var moveto=dest>current?current+1:current-1

    while(current!=dest){
        if(moving_time > 0){
            
            let all_moving_time=parseInt(moving_time)+Math.abs(dest-moveto)*60
            movetown_taskid=setInterval(() => {
                //console.log("正在移动到"+allcity[dest]+"(剩"+all_moving_time+'秒)')
                new Task('移动',0,0,'移动:'+current_city+'到'+allcity[dest]+'(剩'+ all_moving_time-- +'秒)').onlyShow()
            }, 1000)
            await sleep(moving_time*1000)
            clearInterval(movetown_taskid)
            //moving_time--
            current=moveto
        }

        if(going_task.移动){
            let new_dest=going_task.移动.value
            if(!new_dest){new Task('移动').del()}
            else if(new_dest!=dest){return}
        }else if(!going_task){return}
  
        map_html=getHttpResponseAsync(fenqu+'/nmap/index.asp?sid='+sid)
        current_city=map_html.match(/(?<=当前位置:)\S+/)[0]
        current=allcity.indexOf(current_city)
        if(current==dest){break}

        moveto=dest>current?current+1:current-1
        let text=getHttpResponseAsync(newUrl('/nmap/moveTown.asp?sid=','&id='+moveto))
        if(text.match('你的等级不足')){new Task('移动').del();return 'level_over'}
        New_setValue('next_movetown',getdatetime(0,1))
        moving_time=60
        
        console.log("从"+allcity[current]+"移动到"+allcity[dest])
        if(notWoker){setIdinnerHTML('move_dest',' 移动到'+allcity[dest])}
    }

    new Task('移动').del()
}

async function HuoLiCao(num=200){
    let fn_worker=['use_HuoLiQuan','movetown']

    if(!going_task.副本){
        let HuoLiQuan=await use_HuoLiQuan()
        if(HuoLiQuan){return true}
    }
    if(datetime>New_getValue('next_crystalToPower','0')){
        let text=getHttpResponseAsync(newUrl('/fri/crystalToPower.asp?sid='))
        let crystal=text.match(/领取了(\d+)点活力/)
        if(crystal){num-=crystal[1]}
        
        New_setValue('next_crystalToPower',getdatetime(6))
    }
    if(num<=0){return true}
    let all_using=[
        {name:'小活力草', id: 20003, count: Math.ceil(num/10), best: Math.ceil(num/10)/5},
        {name:'中活力草', id: 20004, count: Math.ceil(num/20), best: Math.ceil(num/20)/2.5},
        {name:'大活力草', id: 20005, count: Math.ceil(num/50), best: Math.ceil(num/50)}
    ]

    all_using.sort((a,b)=>b.best-a.best)
    for(let using of all_using){
        let id=using.id
        count=using.count>20?20:using.count
        if(count>=HuoLiCaoNum[id]){//console.log(using.name+'不足'+count+'个,跳过')
            continue
        }
        console.log('使用'+count+'个'+using.name)
        let url=fenqu+'/power/addPower.asp?sid='+sid+'&id='+id+'&count='+count
        let text=getHttpResponseAsync(url)

        if(text.match('道具数目不足')){HuoLiCaoNum[id]=count}else{return true}
    }
    return false
}

async function buyball(count,min=1){
    for(let i=0;i<2;i++){
        let text=postHttpResponseAsync(newUrl('/mall/buy.asp?sid=','&type=0'),'count='+count+'&id=7')
        if(text.match('成功')){break}else{count=min}
    }
    if(text.match('成功')){console.log('成功购买'+count+'个捕捉球');return 1}
    console.log(text,'购买'+count+'个捕捉球失败')
    return 0
}



async function getAllTaskAward(){
    if(!outerHTML.match(/home\/w.gif[^|]+>任务</)){return}
    let page_task=getHttpResponseAsync(fenqu+'/task/index.asp?sid='+sid+'&type=1')
    let ids=page_task.match(/id=\d+(?=.>领取奖励)/g)
    let type=1
    if(!ids){
        type=0
        page_task=getHttpResponseAsync(fenqu+'/task/index.asp?sid='+sid+'&type=0')
        ids=page_task.match(/id=\d+(?=.>领取奖励)/g)
    }
    if(!ids){return}
    for(let id of ids){
        let text=getHttpResponseAsync(fenqu+'/task/takeTaskAward.asp?sid='+sid+'&type='+type+'&'+id)
        if(text.match('不足')){
            await compress_bag()
            text=getHttpResponseAsync(fenqu+'/task/takeTaskAward.asp?sid='+sid+'&type='+type+'&'+id)
            if(text.match('不足')){replaceHTML('>任务<','>任务(背包容量不足)<');break}
        }
    }
}

async function guanshui(){
    if(!isWoker){
        if(New_getValue("last_guanshui")==today){new Task("水晶塔",0,0,'今日已灌注').del();return}
        console.log('开始灌水')
        newWorker({
            task: ['水晶塔','guanshui'],
            fn: ['Task','getHttpResponseAsync','guanshui'],
            text:`
            guanshui()
            `
        })
        return
    }
    let idlist=[]
    var page1=getHttpResponseAsync(fenqu+'/fri/crystalFeeds.asp?sid='+sid+'&pageNo=1')
    idlist.push(page1.match(/userId=\d+/g))

    if(page1.match('下页')){
        let page2=getHttpResponseAsync(fenqu+'/fri/crystalFeeds.asp?sid='+sid+'&pageNo=2')
        idlist.push(...page2.match(/userId=\d+/g))
    }

    var fripage1=getHttpResponseAsync(fenqu+'/fri/socialRank.asp?sid='+sid+'&pageNo=1')
    let friends=fripage1.match(/userId=\d+/g)
    if(!friends){new Task("水晶塔",0,0,'无好友可灌注').del();return}
    let max_page=fripage1.match(/\/(\d+)页/)
    max_page=max_page?max_page[1]:1
    idlist.push(...friends)
    for(let i=2;i<=max_page;i++){
        let fripage=getHttpResponseAsync(fenqu+'/fri/socialRank.asp?sid='+sid+'&pageNo='+i)
        idlist.push(...fripage.match(/userId=\d+/g))
    }
    //var idlist=[...page1.match(/userId=\d+/g),...page2.match(/userId=\d+/g),...fripage1.match(/userId=\d+/g),...fripage2.match(/userId=\d+/g)]
    idlist=Array.from(new Set(idlist))
    for(let i=0;i<idlist.length;i++){
        let text=getHttpResponseAsync(fenqu+'/fri/addCrystal.asp?sid='+sid+"&"+idlist[i])
        await sleep(30)
        if(text.match("次数已经用完")){
            console.log('灌水结束')
            New_setValue("last_guanshui",today)
            new Task("水晶塔",0,0,'次数已经用完').del()
            break
        }
    }
    new Task("水晶塔",0,0,'水晶塔灌注完成').del()
}

function replaceHTML(text1,text2='',no_replace,index){
    if(no_replace){return}
    if(isWoker){
        if(typeof(text1)=='string'){text1='"'+text1+'"'}
        postMessage({data:{action:'command',command: `replaceHTML(${text1.toString().replace('\\','\\')},"${text2}",${no_replace})`}})
    }else{
        let outerHTML=null
        if(index==null){index=0}
        outerHTML=document.querySelectorAll('.gaps.normal')[index].innerHTML
        if(typeof(text1[0])=='object'){
            for(let each_replace of text1){
                if(each_replace[2]){continue}
                outerHTML=outerHTML.replace(each_replace[0],each_replace[1])
            }
        }else{
            outerHTML=outerHTML.replace(text1,text2)
        }
        document.querySelectorAll('.gaps.normal')[index].innerHTML = outerHTML
    }
}

function setIdinnerHTML(id,text){
    if(isWoker){
        postMessage({data:{action:'command',command: `setIdinnerHTML('${id}',\`${text}\`)`}})
    }else{
        if(document.getElementById(id)){document.getElementById(id).innerHTML=text}
    }
}

function addIdinnerHTML(id,text,before=0,newline=0){
    if(isWoker){
        postMessage({data:{action:'command',command: `addIdinnerHTML('${id}','${text}',${before})`}})
    }else if(document.getElementById(id)){
        if(newline){text='<br>'+text}
        if(before){
            document.getElementById(id).innerHTML=text+document.getElementById(id).innerHTML
        }else{
            document.getElementById(id).innerHTML+=text
        }
    }
}

function clickRun(id,fn,refresh=0){
    sleep(300).then(()=>{
        //console.log(id+' '+fn)
        try{document.getElementById(id).onclick=()=>{eval(fn);if(refresh==1){location.reload()}else if(refresh==2){scriptConfig()}}}catch{}
    })
}

function changeRun(id,fn){
    sleep(300).then(()=>{
        try{document.getElementById(id).onchange=()=>{eval(fn)}}catch{}
    })
}

function checkboxRun(id){
    let box=document.getElementById(id)
    if(New_getValue(id)){box.checked=true}
    box.onclick=()=>{
        New_setValue(id,box.checked?1:0)
    }
}

function inputSet(id,fn){
try{
    let value=New_getValue(id)
    let inputbox=document.getElementById(id)
    if(value){inputbox.value=value}
    inputbox.oninput=()=>{New_setValue(id,inputbox.value);fn && eval(fn)}
}catch{}
}

async function EveryList(){
    if(datetime<New_getValue('next_EveryList')){return}
    let list={
        签到      :  {url: '/note/note.asp?sid=', match: "签到"},
        祝贺幻王  :  {url: '/dare/worship.asp?sid=', match: "铜钱|已经膜拜过"},
        幸运古树  :  {url: '/luckytree/takeNum.asp?sid=', match: "领取"},
        幸运号码  :  {url: '/luckystar/takeNum.asp?sid=', match: "领取", time: ['09:00']},
        幸运星奖励:  {url: '/luckystar/getAward.asp?sid=', match: "领取"},
        VIP礼包   :  {url: '/vip/drawDayVipGift.asp?sid=', match: "领取|你还没开通vip"},
        骰子1     :  {url: ['/nmap/takeDice.asp?sid=','&sureFlag=1&type=1&pageType=0'], match: "成功|已领取", time: ['12:00','14:00']},
        骰子2     :  {url: ['/nmap/takeDice.asp?sid=','&sureFlag=1&type=2&pageType=0'], match: "成功|已领取", time: ['18:00','20:00']},
        骰子3     :  {url: ['/nmap/takeDice.asp?sid=','&sureFlag=1&type=3&pageType=0'], match: "成功|已领取", time: ['21:00','23:00']},
        挑战赛奖励:  {url: ['/dare/takeFirstAward.asp?sid=','&id='+getdate(-4).replaceAll('-','_')], match: "领取", time: ['12:00'], skip: weekday!=5},
        争霸赛报名:  {url: '/clanrace/applyRace.asp?sid=', match: '报名', time: ['08:00'], skip: !New_getValue('clanrace_apply')}
    }
    let EveryList=New_getValue(['record','EveryList'],{})
    let changed=0
    let completed=1
    let next_time=gettime(1)
    //0: 未完成  1: 已完成  2:已超时  3: 跳过
    for(let item in list){
        if(EveryList[item]>=1){continue}
        if(list[item].skip){changed=1;EveryList[item]=3;continue}
        completed=0
        let timeLimit=list[item].time
        if(timeLimit){
            if(timeLimit[1] && timenow>timeLimit[1]){EveryList[item]=2;changed=1;continue}
            if(timenow<timeLimit[0]){
                if(timeLimit[0]<next_time){next_time=timeLimit[0]}
                continue
            }
        }
        let text=getHttpResponseAsync(newUrl(list[item].url))
        if(text.match(list[item].match)){
            EveryList[item]=changed=1
        }else{
            console.log(item,text)
        }
    }
    if(changed){New_setValue(['record','EveryList'],EveryList)}

    let next_EveryList=completed?getdate(1):today+' '+next_time
    New_setValue('next_EveryList',next_EveryList)
}

function run_remain_nmap(force=0){
    if(!force && (going_task.副本 || datetime < New_getValue('next_run_remain_nmap') || !New_getValue('autonmap_starttime'))){return}
    console.log('副本：扫荡剩余副本')
    let autonmaplist=New_getValue('autonmaplist',{})
    let remain=[]
    for(let node in autonmaplist){
        if(autonmaplist[node].remain!=0){
            remain.push(node.replace('node','')-0)
        }
    }
    if(timenow<'18:00'){New_setValue('next_run_remain_nmap',today+' 18:30')}else{New_setValue('next_run_remain_nmap',getdate(1)+' 13:00')}
    if(remain.length==0){return}
    Worker_autonmap_all(remain.sort((a,b)=>{return b-a}),'remain_mode')
}

function ResetActivity(){
    let Activity_Name={
        monstre: '杀人蜂',
        dayconsume: '每日消费',
        nov: '限时点券',
        transport: '押镖',
        pointsrace: '积分赛',
        christmas: '任务活动',
        raffle: '许愿池',
        statue: '神像祈福',
        dlogin: '登录领奖',
    }
    Activity={}
    let links=outerHTML.split('欢迎您')[0].match(/\w+\/index.asp[^>]+/g)
    for(let link of links){
        let nameid=link.match(/^(\w+)\/.*?(activityId=(\w+))?['"]$/)
        if(!Activity_Name[nameid[1]]){continue}
        Activity[Activity_Name[nameid[1]]]=nameid[3]?nameid[3]:true
    }
    New_setValue('record_Activity',Activity)
    
}

async function dailyReset(){
    if(New_getValue('last_dailyReset')==today){return}
    going_task={}
    New_setValue('going_task',{})
    if(timenow<'07:00'){GM_setValue('GM_share',{})}

    ResetActivity()
    let ResetValue={
        HuoLiQuan_nodes: {},
        EveryList: {},
        automining_times: 0,
        record_today_contest: 0,
        statue_task_list: {捕捉球: 0,切磋: 0},
        record_rebirth_count: [0,New_getValue('record_rebirth_count',[0,5])[1]],
        today_dianquan_start: outerHTML.match(/>(点券:\d+)</)[1],
        通天塔完成: false,龙纹塔完成: false,战灵塔完成: false,天空塔完成: false
    }
    New_setValue(['record',ResetValue])
    let contest={value:5,state:0}
    if(Activity.限时点券){contest={value:10,state:0}}
    let sport={state:0}
    if(Activity.神像祈福 && get_bag_item_count(20005)>500){sport={state:0,value:100}}
    set_dailyConsume('切磋',contest)
    set_dailyConsume('竞技',sport)
    set_dailyConsume('闯塔',{state:0})
    reset_autonmap()

    if(New_getValue('autodemon_10')){
      try{
        await get_demon_text()
        let free_times=demon_text[0].match(/试炼层:(\d)次/)[1]
        if(free_times==0){free_times=1}
        New_setValue('autodemon_max_times',10-free_times)
      }catch{}
    }

    New_setValue('last_dailyReset',today)
}

function reset_autonmap(){
    let autonmaplist=New_getValue('autonmaplist',{})
    let max_node=parseInt(myInfo.Lv()/10)*2+3
    for(node in autonmaplist){
        if(node.replace('node','')>max_node){delete autonmaplist[node];continue}
        let count=autonmaplist[node].count
        if(!count){count=1}
        autonmaplist[node].remain=count
        autonmaplist[node].event=''
    }
    New_setValue('autonmaplist',autonmaplist)
}

async function dailyStartTask(force=0){
    let start_time=New_getValue('dailyTask_startTime')
    if(!force){
        if(datetime < New_getValue('next_dailyStartTask')){return}
        
        if(!start_time){New_setValue('next_dailyStartTask',getdate(1)+' 00:00');return}
        if(timenow<start_time){New_setValue('next_dailyStartTask',today+' '+start_time);return}
        console.clear()
        console.log(New_getValue('next_dailyStartTask'))
    }
    await compress_bag()
    getMonthCardAward()

    if([5,10,20,28].indexOf(today.split('-')[2])){getHttpResponseAsync(newUrl('/note/drawNoteMonthDaysAward.asp?sid='))}

    if(New_getValue('next_dare','0')<=today && weekday==1){
        getHttpResponseAsync(newUrl('/dare/index.asp?sid='))
        getHttpResponseAsync(fenqu+'/dare/apply.asp?sid='+sid)
        New_setValue('next_dare',getdate(7))
        getHttpResponseAsync(fenqu+'/luckytree/award.asp?sid='+sid)
        
    }
    if(weekday==5){await auto_celebrity()}
    
    guanshui()

    New_getValue('next_dailyStartTask',New_setValue('next_dailyStartTask',getdate(1)+' '+(start_time?start_time:'00:00')))
}

async function auto_teamList(){
    let max_page=1
    let current_page=1
    let page=href.match('/clanrace/teamList.asp?sid=\w$')?outerHTML:getHttpResponseAsync(newUrl('/clanrace/teamList.asp?sid='))
    let page_num=page.match(/第(\d)\/(\d)页/)
    let all_page_text=''
    if(page_num){max_page=page_num[2];current_page=page_num[1]}
    for(let i=1;i<=max_page;i++){
        if(i==current_page){all_page_text+=outerHTML}else{all_page_text+=getHttpResponseAsync(newUrl('/clanrace/teamList.asp?sid=')+'&pageNo='+i)}
    }
    let all_user=all_page_text.match(/userId=(\d+)[^.]+\.(\d+)\.(\d+)[^&]待命/g)
    if(!all_user){return}
    let all_user_info=[]
    for(let user of all_user){
        let info={
            userId: user.match(/userId=(\d+)/)[1],
            teamId: user.match(/.*\.(\d+)\.(\d+)\./)[1][0]+'001',
            zhanli: user.match(/.*\.(\d+)\.(\d+)\./)[2]-0
        }
        all_user_info.push(info)
    }
    all_user_info.sort((a,b)=>b.zhanli-a.zhanli)
    let team_complete=[]
    for(let user of all_user_info){
        if(team_complete.indexOf(user.teamId)>-1){continue}
        let text=getHttpResponseAsync(newUrl('/clanrace/teamAdd.asp?sid=')+'&teamId='+user.teamId+'&userId='+user.userId)
        if(text.match('已满')){team_complete.push(user.teamId)}
        else if(text.match('战队调整时间已过')){console.log('战队调整时间已过');return}
    }
    New_setValue('next_auto_teamList',getdate(weekday==5?7:6)+' 08:00')
    if(href.match('/clanrace/teamList.asp')){location.reload()}
}

async function daily12pmTask(){
    if(today==New_getValue('last_daily12pmTask')){return}
    New_setValue(['record','today_dianquan_start'], outerHTML.match(/>(点券:\d+)</)[1])
    New_setValue('last_daily12pmTask',today)
    buy_compensation_award()
    await auto_enhanceTask()
    if(weekday>=5){
        if(New_getValue('clanrace_apply') && New_getValue('next_auto_teamList')<datetime){await auto_teamList()}
    }
    if(timenow > '13:00'){return}
    autostage(1)
}

async function dailyEndTask(){
    if(today==New_getValue('last_dailyEndTask')){return}
    New_setValue('last_dailyEndTask',today)
    
    await compress_bag()
    await sleep(10000)
    console.log('开始火修')
    console.log(getHttpResponseAsync(newUrl('/clan/beginPractice.asp?sid=')))
    console.log(getHttpResponseAsync(newUrl('/evilsoul/takeAward.asp?sid=')))
    if(Activity.神像祈福){getHttpResponseAsync(newUrl('/statue/takeRankAward.asp?sid='));await auto_statue(1)}
    if(weekday==0){
        getHttpResponseAsync(newUrl('/clanrace/personalAward.asp?sid='))
        getHttpResponseAsync(newUrl('/clanrace/familyAward.asp?sid='))
    }
    getHttpResponseAsync(newUrl('/clan/beginPractice.asp?sid='))
}

async function home_task(){
    auto_practice()
    if(timenow>'01:00' && timenow<'06:30'){return}
    
    autodemon()
    automining()
    auto_miningsite()

    if(Activity.登录领奖){get_dloginAward()}
    if(Activity.押镖){auto_transport()}
    if(Activity.杀人蜂){auto_monstre()}
    if(Activity.积分赛){auto_pointsrace()}
    
    if(Activity.任务活动){await auto_christmas()}
    if(Activity.每日消费){await auto_get_dayconsume_award()}
    if(Activity.神像祈福){await auto_statue()}
    if(Activity.许愿池){await auto_raffle()}
    if(Activity.限时点券){await auto_get_dianquan()}

    await getAllTaskAward()
    await auto_manor()
    await auto_clanPractice()
    await autoncopy()
    await auto_signwar()
    await auto_pcompete()
    await auto_bground()
    await auto_copy_map()
    await EveryList()

    if(timenow>'12:00'){await daily12pmTask()}
    
    if(timenow>New_getValue('autonmap_starttime',1) && New_getValue('last_autonmap_all') != today){Worker_autonmap_all();New_setValue('last_autonmap_all',today)}
    
    dailyConsumeTask()
    run_remain_nmap()
}

function home_modify(){
    var add_entry=''
    let pagoda_url=fenqu+'/pagoda/index.asp?sid='+sid
    let todemon_url=fenqu+'/pagoda/todemon.asp?sid='+sid+'&id=1&pvpType=1'
    add_entry+='|<a id=entry_pagoda href='+pagoda_url+'>闯塔</a>|<a id=entry_todemon href='+todemon_url+'>镇妖</a>'
    let mining_url=fenqu+'/mining/index.asp?sid='+sid
    add_entry+='|<a id=entry_mining href='+mining_url+'>矿山</a><span id=entry_remain></span>'
    let auto_refresh=New_getValue('auto_refresh_switch')?'自动刷新:开':'自动刷新:关'
    let suspend_script=New_getValue('suspend_script')?'暂停脚本:开':'暂停脚本:关'

    let replace_array=[
        ['幻兽宝鉴</a><br>','幻兽宝鉴</a> '],
        //[/>凝神香.*?<br>/,">"],
        //[/声望.*?<br>/,""],
        [/<a[^>]+>升级<\/a>/,''],
        [/(联盟<\/a>)】/,'$1|<a href="'+fenqu+'/news/index.asp?sid='+sid+'">系统</a>】'],
        [/(nodeId=\d+.*?)<br/,'$1 <a id=autonmap_all href="javascript:;">&nbsp;&nbsp;&nbsp;&nbsp;扫荡全部副本</a><br'],
        [/(>恢复<\/a>)/,'$1 <a id=consume_huoli href="javascript:;">消耗活力</a>'],
        [/(<br>庄园:)/,' <a id=run_remain_map href="javascript:;">&nbsp;&nbsp;&nbsp;&nbsp;扫荡剩余副本</a>$1'],
        [/【常用功能】[^|]+\|(.*?)\|师徒\|婚恋】/,"【常用功能】<br>【$1"+add_entry+"】"],
        [/(<br><br>)/,`<br><div id=task_div>【后台任务】<a id=clear_task href='javascript:;'>清空</a> <a id=config_task href='javascript:;'>设置</a> \
        <a id=auto_refresh href='javascript:;'>${auto_refresh}</a> <a id=suspend_script href='javascript:;'>${suspend_script}</a>\
        <br><span id=task_text></span></div><br>`]
    ]

    //if(New_getValue('last_guanshui')!=today){replace_array.push([/(水晶塔.*?)<br>/,"$1 <a id=autoguanshui href='javascript:;'>灌注水晶</a><br>"])}
    /*if(outerHTML.match('>盟聊<')){
        let mengliao=getHttpResponseAsync(fenqu+'/clan/chatIndex.asp?sid='+sid).match(/(?<=>)(\(.*?<br.>){1,3}/)//.match(/<\/form>(.*?<br\/>.*?<br\/>.*?<br\/>)/)
        replace_array.push([/(盟聊<\/a>】).*?<br>.*?<br>/,"$1<br>"+mengliao[0]])//.replace(/<img src=.*?>/g,''))
    }*/
    replaceHTML(replace_array)
}

async function get_demon_text(){
    demon_text=[]
    let pageNo=New_getValue('record_demon_pageNo',6)
    let url_demon1=newUrl('/pagoda/demon.asp?sid=')+'&pvpType=0&id=1&pageNo='+pageNo
    let page_text=getHttpResponseAsync(url_demon1)
    if(page_text.match('镇妖-30级开放')){New_setValue('next_demon_detect',getdate(1)+' 08:00');return}

    let text_demon_free=page_text.split('pageNo')[0]
    if(!text_demon_free.match(/>(占领|挑战)<\/a>/)){
        let url_demon_free=fenqu+'/pagoda/todemon.asp?sid='+sid+'&id=1&pvpType=0'
        text_demon_free=getHttpResponseAsync(url_demon_free)
        pageNo=text_demon_free.match(/第(\d+)\/\d+页/)
        if(pageNo){pageNo=pageNo[1];New_setValue('record_demon_pageNo',pageNo)}else{return}
        
    }
    let url_demon=newUrl('/pagoda/demon.asp?sid=')+'&pvpType=1&id=1&pageNo='+pageNo
    let text_demon=getHttpResponseAsync(url_demon).split('pageNo')[0]
    syncTime()
    demon_text=[text_demon_free,text_demon,datetime]
    console.log('镇妖查看时间:',datetime)

}

outerHTML=document.querySelector('.gaps.normal').innerHTML

async function home_refresh_task(){
    HuoLiCaoNum={}
    auto_refresh()
    Current_Huoli=outerHTML.match(/活力:(\d+)/)[1]
    isHome=true
    home_modify()
    await sleep(50)
    clickRun('clear_task',"New_setValue('going_task',{});location.reload()")
    clickRun('config_task','scriptConfig()')
    auto_switch('auto_refresh','auto_refresh_switch',0,1,0,'自动刷新:开','自动刷新:关')
    auto_switch('suspend_script','suspend_script',0,1,0,'暂停脚本:开','暂停脚本:关')
    if(New_getValue('suspend_script')){return}

    clickRun('autonmap_all','Worker_autonmap_all()')
    clickRun('run_remain_map','run_remain_nmap(1)')
    clickRun('consume_huoli','dailyConsumeTask(1,1)')
    await dailyReset()
    
    new Task().run()
    await dailyStartTask()
    if(timenow>'23:30'){await dailyEndTask()}
    
    home_task()
}

//首页
if (href.match('/home/main.asp?')){
    home_refresh_task()
}else{
    if(!New_getValue('suspend_script')){
        if(New_getValue('auto_backto_home')!==0){auto_refresh()}
        new Task().run()
    }
}

function config_changed_applyto_All(){
//try{
    delete config_changed.going_task
    if(typeof(config_changed.time)=='object'){delete config_changed.time.last_sync_config}
    let apply=[]
    for(let item of GM_listValues()){
        let [fenqu_o,myId_o]=item.split('_')
        if(fenqu_o!=fenqu || myId==myId_o){continue}
        let All_GM_Value_o=GM_getValue(fenqu+'_'+myId_o+'_allGMvalue')
        for(let type in config_changed){
            if(typeof(config_changed[type])=='object'){
                Object.assign(All_GM_Value_o[type],config_changed[type])
            }else{
                All_GM_Value_o[type]=config_changed[type]
            }
        }
        //console.log(item,All_GM_Value_o)
        apply.push(myId_o)
        GM_setValue(fenqu+'_'+myId_o+'_allGMvalue',All_GM_Value_o)
    }
    console.log('同步到',apply.join(','))
    New_setValue('last_sync_config',getdatetime(0,0,10))
    GM_setValue('last_sync_config',getdatetime())
    
    setIdinnerHTML('applyto_All_result','同步成功')
//}catch(e){console.log(e);setIdinnerHTML('applyto_All_result','同步异常')}
}

function scriptConfig(){
    config_mode=true
    config_changed={}
    All_GM_Value=GM_getValue(fenqu+'_'+myId+'_allGMvalue')
    var config_text=`
    【脚本配置】当前:<select id=record_scriptConfig style="width:80px"></select> <span id=info></span><br>
    仅限配置: <a id=apply_scriptConfig href='javascript:;'>应用</a> <input type=file id=load_json accept=".json" style="display:none"><a id=load_scriptConfig href='javascript:;'>导入</a> <a id=download_scriptConfig href='javascript:;'>下载</a>
    <a id=delete_scriptConfig href='javascript:;'>删除</a> <a id=save_scriptConfig href='javascript:;'>另存为:</a><input id=name_scriptConfig type="text" style="width:80px" placeholder=""><br>
    所有记录: <a id=download_allConfig href='javascript:;'>下载</a> <input type=file id=load_Configjson accept=".json" style="display:none"><a id=load_allConfig href='javascript:;'>导入</a><br>
    <a id=applyto_All href='javascript:;'>将本次更改应用到本区其他号</a> <span id=applyto_All_result></span><br>
    【副本】<br>
    自动修行: <a id=autopractice_switch href='javascript:;'></a> 城市: <select id=auto_practice_city></select> 时间: <select id=practice_time></select>
    <br>
    Boss宝箱: <a id=autonmap_bossbox_switch href='javascript:;'></a> 打开所有宝箱: <a id=nmap_open_allbox href='javascript:;'></a> <a id=nmap_reset href='javascript:;'>重置副本</a>
    <br>
    自动副本: <input id=autonmap_starttime type="time" min="07:00" max="23:30"> <a id=reset_autonmap_starttime href='javascript:;'>重置时间</a> <a id=autonmap_switch href='javascript:;'></a><br>
    副本结束后移动到: <select id=autonmap_to_city></select> <a id=clear_autonmap href='javascript:;'>清空副本配置</a><br>
    <div id=autonmap_config hidden="hidden"></div>
    【常用】<a id=ResetActivity href='javascript:;'>重置活动</a> <br>
    每日自动任务: <input id=dailyTask_startTime type="time" min="00:00" max="23:59"> <a id=reset_dailyTask_startTime href='javascript:;'>重置时间</a> <a id=start_dailyTask href='javascript:;'>执行任务</a><br>
    首页自动刷新: <a id=auto_refresh_switch href='javascript:;'></a> 每隔<input id="auto_refresh_time" type="number" min="0" step="0.01" onkeyup="if(value<0)value=0" style="width:40px" placeholder="20">分钟 \
    <input id="auto_refresh_time_range" type="number" min="0" max=100 step="1" onkeyup="if(value<0)value=0" style="width:40px" placeholder="20">%浮动<br>
    自动返回首页: <a id=auto_backto_home href='javascript:;'></a><br>
    自动庄园: <a id=automanor_switch href='javascript:;'></a> <a id=manor_reset href='javascript:;'>重置庄园</a><br>
    【活力任务】<br>
    切磋: <input id="dailyConsume_contest" type="number" min=0 step=1 onkeyup="if(value<0)value=0" style="width:30px" placeholder="5"> 竞技: <input id="dailyConsume_sport" type="number" min=0 step=1 onkeyup="if(value<0)value=0" style="width:50px" placeholder="50">
    <label for=dailyConsume_pagoda>闯塔</label><input type="checkbox" id=dailyConsume_pagoda> <label for=dailyConsume_exppool>化仙池</label><input type="checkbox" id=dailyConsume_exppool> <a id=huoliTask_reset href='javascript:;'>重置任务</a><br> 
    【联盟】<br>
    创建火修房间: <a id=create_clanPractice_switch href='javascript:;'></a> 指定时间后开始: <input id=clanPractice_startTime type="time" min="07:00" max="23:30"><br>
    盟战报名: 飞龙: <select id=clanwar1></select> 伏虎: <select id=clanwar2></select><br>
    盟战签到: <a id=auto_signwar href='javascript:;'></a> 指定时间后开始: <input id=signwar_starttime type="time" min="00:00" max="23:59"><br>
    争霸赛报名: <a id=clanrace_switch href='javascript:;'></a><br>
    【镇妖】<a id=autodemon_reset href='javascript:;'>重置时间</a><br>
    自动镇妖: <a id=autodemon_switch href='javascript:;'></a> 仅免费试炼: <a id=autodemon_freeOnly href='javascript:;'></a><br>
    匿名模式: <a id=autodemon_hidename href='javascript:;'></a> <input id=autodemon_hide_username type=text style="width:80px" placeholder="匿名名称"> 试炼卡点: <a id=autodemon_freelast href='javascript:;'></a><br>
    锁黑名单: <a id=findBlacklist_switch href='javascript:;'></a> 炼狱镇妖上限: <input id="autodemon_max_times" type="number" min="0" step="1" onkeyup="if(value<0)value=0" style="width:30px" placeholder="0: 无限制"> <label for=autodemon_10>卡10次</label><input type="checkbox" id=autodemon_10>
    <br>
    【挖矿】<a id=automining_reset href='javascript:;'>重置时间</a><br>
    自动除妖: <a id=autominingsite_switch href='javascript:;'></a><br>
    自动挖矿: <a id=automining_switch href='javascript:;'></a> 挖矿卡点: <a id=automining_last href='javascript:;'></a> 挖矿上限: <input id="automining_max_times" type="text" style="width:40px" placeholder="0: 无限制"> <br>
    选中: <span id=mining_selected></span><br>
    剩余: <span id=mining_left></span>
    <br>
    【押镖活动】(刷出更稀有的会停止刷新)<br>
    自动押送: <a id=auto_transport_switch href='javascript:;'></a> 刷新次数上限: <select id=auto_transport_max_reset></select><span id=auto_transport_dianquan></span>
    <br>
    【福利副本】<br>
    自动副本: <span id=run_copy_map></span>
    <br>
    <br><a id=back href='javascript:;'>返回前页</a> <a id=refresh href='javascript:;'>刷新</a>
    `
    var script=`
    `
    var body=document.querySelector('body')
    body.innerHTML=config_text
    var newScript = document.createElement('script')
    //newScript.type = 'text/javascript';
    newScript.innerHTML = script
    body.appendChild(newScript)

    setIdinnerHTML('auto_transport_switch',New_getValue('auto_transport',["已关闭"])[0])
    auto_transport_max_reset()
    autopractice_city_time()
    autonmap_switch()

    auto_switch('auto_refresh_switch','auto_refresh_switch')
    auto_switch('auto_backto_home','auto_backto_home',1)
    auto_switch('auto_signwar','auto_signwar',1)
    auto_switch('clanrace_switch','clanrace_apply')
    auto_switch('autopractice_switch','autopractice_state')
    auto_switch('autodemon_switch','autodemon_state',1)
    auto_switch('findBlacklist_switch','findBlacklist')
    auto_switch('autodemon_freeOnly','only_freedemon',1)
    auto_switch('autodemon_freelast','autodemon_freelast')
    auto_switch('autodemon_hidename','autodemon_hidename')
    auto_switch('automining_switch','automining_state')
    auto_switch('automining_last','automining_last')
    auto_switch('autominingsite_switch','autominingsite_state')
    auto_switch('automanor_switch','auto_manor',1)
    auto_switch('autonmap_bossbox_switch','nmap_openbox_use','优先骰子','优先骰子','优先活力','优先骰子','优先活力')
    auto_switch('nmap_open_allbox','nmap_open_allbox')
    auto_switch('create_clanPractice_switch','create_clanPractice')

    auto_refresh(setup=true)
    let autodemon_max_times=New_getValue('autodemon_max_times')
    if(autodemon_max_times){document.getElementById('autodemon_max_times').value=autodemon_max_times}
    inputSet('autodemon_max_times')
    automining_config()
    let automining_max_times=New_getValue('automining_max_times')
    if(automining_max_times){document.getElementById('automining_max_times').value=automining_max_times}
    inputSet('automining_max_times')
    inputSet('auto_refresh_time_range')
    inputSet('autodemon_hide_username')
    dailyConsumeRun('dailyConsume_contest')
    dailyConsumeRun('dailyConsume_sport')
    dailyConsumeRun('dailyConsume_pagoda')
    dailyConsumeRun('dailyConsume_exppool')

    clickRun('applyto_All','config_changed_applyto_All()')
    clickRun('start_dailyTask','dailyStartTask(force=1)')
    clickRun('reset_dailyTask_startTime',"New_setValue('dailyTask_startTime',null)")
    clickRun('reset_autonmap_starttime',"New_setValue('autonmap_starttime',null)")
    clickRun('manor_reset',"New_setValue('next_ManorTime','')")
    clickRun('nmap_reset',"reset_autonmap()")
    clickRun('clear_autonmap',"New_setValue('autonmaplist',{});scriptConfig()")
    clickRun('auto_transport_switch','auto_transport_switch()')
    //New_setValue('autonmaplist','')
    changeRun('autonmap_to_city',"New_setValue('autonmap_to_city',document.getElementById('autonmap_to_city').selectedOptions[0].value)")
    changeRun('auto_practice_city',"New_setValue('auto_practice_city',document.getElementById('auto_practice_city').selectedOptions[0].value)")
    changeRun('practice_time',"New_setValue('auto_practice_time',document.getElementById('practice_time').selectedOptions[0].value)")
    
    settimeRun('dailyTask_startTime')
    settimeRun('autonmap_starttime')
    settimeRun('clanPractice_startTime')
    settimeRun('signwar_starttime')
    checkboxRun('autodemon_10')

    changeRun('auto_transport_max_reset',"auto_transport_max_reset('change')")
    clickRun('autodemon_reset',"New_setValue('next_demon_detect','0')")
    clickRun('automining_reset',"New_setValue('next_mining_detect','0')")
    clickRun('back','location.reload()')
    clickRun('refresh','scriptConfig()')
    clickRun('ResetActivity','ResetActivity()')
    let clanwar_applytext='<option value=-1>不报名</option><option value=0>联盟数最多</option><option value=1>1号地</option><option value=2>2号地</option>'
    setIdinnerHTML('clanwar1',clanwar_applytext)
    setIdinnerHTML('clanwar2',clanwar_applytext)
    let clanwar_apply=New_getValue('clanwar_apply',{})
    if(clanwar_apply.飞龙军!=undefined){{document.getElementById('clanwar1').value=clanwar_apply.飞龙军}}
    if(clanwar_apply.伏虎军!=undefined){{document.getElementById('clanwar2').value=clanwar_apply.伏虎军}}
    changeRun('clanwar1','clanwar_apply_set(1)')
    changeRun('clanwar2','clanwar_apply_set(2)')

    document.getElementById('huoliTask_reset').onclick=()=>{
        let tasks=[
            {name: '闯塔', fn: 'Worker_autopagoda_all', state: 0, enabled: true},
            {name: '化仙池', fn: 'auto_exppool', enabled: true},
            {name: '竞技', value: '50', sendValue: true, state: 0, startTime: '07:00', fn: 'autosport'},
            {name: '切磋', value: '5', sendValue: true, fn: 'autocontest', state: 0, startTime: undefined}
        ]
        New_setValue('dailyConsumeTask',tasks)
    }

    run_copy_map_switch()
    set_scriptConfig()
    setIdinnerHTML('info','')
}

function dailyConsumeRun(id){
    let dailyConsumeTask=New_getValue('dailyConsumeTask',[])
    let name=''
    if(id=='dailyConsume_contest'){name='切磋'}else if(id=='dailyConsume_sport'){name='竞技'}else if(id=='dailyConsume_exppool'){name='化仙池'}else if(id=='dailyConsume_pagoda'){name='闯塔'}
    let item=dailyConsumeTask.find(item=>item.name==name)
    if(name.match(/化仙池|闯塔/)){
        let value=item?item.enabled:false
        document.getElementById(id).checked=value
        document.getElementById(id).onclick=()=>{
            set_dailyConsume(name,{enabled: document.getElementById(id).checked})
        }
    }else{
        let value=item?item.value:false
        document.getElementById(id).value=value
        document.getElementById(id).oninput=()=>{
            set_dailyConsume(name,{value: document.getElementById(id).value})
        }
    }
}

function set_scriptConfig(){
    let saved_scriptConfig=GM_getValue('saved_scriptConfig',{})
    let text=''
    for(let name in saved_scriptConfig){
        text+=`<option value=${name}>${name}</option>`
    }
    if(!text){text=`<option value=0>无可用配置</option>`}
    text+=`<option value=clear>清空配置</option>`
    setIdinnerHTML('record_scriptConfig',text)
    
    let record_scriptConfig=document.getElementById('record_scriptConfig')
    let apply_scriptConfig=document.getElementById('apply_scriptConfig')
    let delete_scriptConfig=document.getElementById('delete_scriptConfig')
    let load_json=document.getElementById('load_json')
    let load_scriptConfig=document.getElementById('load_scriptConfig')
    let name_scriptConfig=document.getElementById('name_scriptConfig')
    let save_scriptConfig=document.getElementById('save_scriptConfig')
    let download_scriptConfig=document.getElementById('download_scriptConfig')
    let download_allConfig=document.getElementById('download_allConfig')
    let load_allConfig=document.getElementById('load_allConfig')
    let load_Configjson=document.getElementById('load_Configjson')

    let current=All_GM_Value.配置名称
    if(current && saved_scriptConfig[current]){record_scriptConfig.options[Object.keys(saved_scriptConfig).indexOf(current)].selected=true}
    
    apply_scriptConfig.onclick=()=>{
        let name=record_scriptConfig.selectedOptions[0].value
        if(name==0){setIdinnerHTML('info','请先选配置');return}
        if(name=='clear'){delete All_GM_Value.config}
        else{
            let config=saved_scriptConfig[name]
            Object.assign(All_GM_Value,config)
        }
        GM_setValue(fenqu+'_'+myId+'_allGMvalue',All_GM_Value)
        scriptConfig()
    }
    name_scriptConfig.oninput=()=>{
        let name=name_scriptConfig.value
        if(!name || !name.match(/^[\S ]+$/)){setIdinnerHTML('info','配置名不可用')}
        else if(saved_scriptConfig[name]){setIdinnerHTML('info','配置名已存在，保存会覆盖')}else{setIdinnerHTML('info','')}
    }
    delete_scriptConfig.onclick=()=>{
        let name=record_scriptConfig.selectedOptions[0].value
        try{delete saved_scriptConfig[name];GM_setValue('saved_scriptConfig',saved_scriptConfig)}catch{setIdinnerHTML('info','该配置不存在');return}
        scriptConfig()
    }
    load_scriptConfig.onclick=()=>{
        load_json.click()
    }
    load_json.oninput=()=>{
        let file=new FileReader()
        file.readAsText(load_json.files[0])
        file.onload=()=>{
            let config=JSON.parse(file.result)
            let name=config.配置名称
            if(saved_scriptConfig[name]){if(!confirm('导入配置名已存在,是否覆盖')){return}}
            Object.assign(All_GM_Value,config)
            saved_scriptConfig[name]=config
            GM_setValue('saved_scriptConfig',saved_scriptConfig)
            GM_setValue(fenqu+'_'+myId+'_allGMvalue',All_GM_Value)
            scriptConfig()
        }
    }
    save_scriptConfig.onclick=()=>{
        let name=name_scriptConfig.value
        if(!name || !name.match(/^[\S ]+$/)){setIdinnerHTML('info','新配置名(右侧)不可用');return}
        saved_scriptConfig[name]={配置名称: name}
        Object.assign(saved_scriptConfig[name],{config: All_GM_Value.config})
        GM_setValue('saved_scriptConfig',saved_scriptConfig)
    }
    download_scriptConfig.onclick=()=>{
        let name=record_scriptConfig.selectedOptions[0].value
        if(!saved_scriptConfig[name]){setIdinnerHTML('info','请先选配置');return}
        let blob = new Blob([JSON.stringify(saved_scriptConfig[name])], {type: 'application/json'})
        let download = document.createElement('a')
        let url=window.URL.createObjectURL(blob)
        download.href = url
        download.download = `召唤之王配置_${name}.json`
        download.click()
    }
    download_allConfig.onclick=()=>{
        let config={'记录修改时间':getdatetime()}
        for(let item of GM_listValues()){config[item]=GM_getValue(item)}
        let blob = new Blob([JSON.stringify(config,null,space=' ')], {type: 'application/json'})
        let download = document.createElement('a')
        let url=window.URL.createObjectURL(blob)
        download.href = url
        download.download = `zhzw_record.json`
        download.click()
    }
    load_allConfig.onclick=()=>{
        load_Configjson.click()
    }
    load_Configjson.oninput=()=>{
        let file=new FileReader()
        file.readAsText(load_Configjson.files[0])
        file.onload=()=>{
            let config=JSON.parse(file.result)
            for(let name in config){
                console.log('导入',name)
                GM_setValue(name,config[name])
            }
            //GM_setValue(fenqu+'_'+myId+'_allGMvalue',All_GM_Value)
            scriptConfig()
        }
    }
}

function settimeRun(id){
    changeRun(id,`New_setValue('${id}',document.getElementById('${id}').value)`)
    let value=New_getValue(id)
    if(value){document.getElementById(id).value=value}
}


async function auto_refresh(setup=false){
    if(setup){
        document.getElementById('auto_refresh_time').value=New_getValue('auto_refresh_time',null)
        document.getElementById('auto_refresh_time').oninput=()=>{
            New_setValue('auto_refresh_time',document.getElementById('auto_refresh_time').value)
        }
        return
    }
    if(!New_getValue('auto_refresh_switch')){return}
    let refresh_time=New_getValue('auto_refresh_time',20)
    let time_range=New_getValue('auto_refresh_time_range',20)/100
    
    let wait_time=Math.floor(refresh_time*60*(1-time_range*(Math.random()*2-1)))
    if(timenow>'01:00:00' && timenow<'06:30:00'){wait_time=timeDelta(getdatetime(6,30,0,null,0))/1000}
    if(href.match('/pagoda/index.asp')){wait_time=29}
    for(let n=0;n<10;n++){
        console.log(wait_time+`秒后(${gettime(0,0,wait_time)})自动刷新`)
        await sleep(wait_time*1000)
        for(let i=0;i<10;i++){
            if(window.navigator.onLine){
                let homeurl=newUrl('/home/main.asp?sid=')
                
                try{
                    let text=getHttpResponseAsync(homeurl)
                    if(text.match('欢迎您')){
                        sync_GMvalue()
                        save_record()
                        //if(GM_getValue('记录修改时间','')>last_save_record){}
                        if(!isHome){href=homeurl}
                        syncTime()
                        
                        if((timenow>'11:40' && timenow<'12:10') || href.match('/pagoda/index.asp')){window.location.href=homeurl}
                        outerHTML=text
                        document.querySelector('body').outerHTML=text
                        weekday=new Date().getDay()
                        
                        All_GM_Value=GM_getValue(fenqu+'_'+myId+'_allGMvalue')
                        home_refresh_task()
                        return
                    }
                }catch{}
                console.log('刷新失败,等待60秒')
            }else{
                console.log('网络已断开,等待60秒')
            }
            await sleep(6e4)
        }
        console.log('网络等待超时-'+n)
    }
}

function clanwar_apply_set(id){
    let clanwar_apply=New_getValue('clanwar_apply',{})
    let index=[,'飞龙军','伏虎军']
    clanwar_apply[index[id]]=document.getElementById('clanwar'+id).value
    New_setValue('clanwar_apply',clanwar_apply)
}

function autopractice_city_time(){
    var practice_city_text=''
    var citynum=1
    let mylv=myInfo.Lv()
    var last_city=parseInt(mylv/10)>7?8:parseInt(mylv/10)+1
    for(let city in city_map){
        if(citynum > last_city){break}
        practice_city_text='<option value='+citynum+'>'+city+'</option>'+practice_city_text
        citynum++
    }

    setIdinnerHTML('auto_practice_city',practice_city_text)
    setIdinnerHTML('autonmap_to_city','<option value=-1>不移动</option><option value=0>最后一个城市</option>'+practice_city_text)
    let auto_practice_city=New_getValue('auto_practice_city',0)
    if(auto_practice_city==0){var practice_city_index=0}else{var practice_city_index=last_city-auto_practice_city}
    document.getElementById('auto_practice_city').options[practice_city_index].selected=true
    let autonmap_to_city=New_getValue('autonmap_to_city')-0
    if(!autonmap_to_city){var to_city_index=1}else if(autonmap_to_city = -1){var to_city_index=0}else{var to_city_index=last_city-autonmap_to_city+2}
    document.getElementById('autonmap_to_city').options[to_city_index].selected=true
    
    var VIPlevel=myInfo.VIP()
    var practice_time_text=''
    var all_practice_time=[2,4,8,12]
    for(let hour of all_practice_time){
        if(hour==12 && VIPlevel-6<0){break}
        practice_time_text+='<option value='+hour+'>'+hour+'小时</option>'
    }
    setIdinnerHTML('practice_time',practice_time_text)
    var practice_time=New_getValue('auto_practice_time');if(!practice_time){practice_time=8}
    var practice_time_index=all_practice_time.indexOf(parseInt(practice_time))
    document.getElementById('practice_time').options[practice_time_index].selected=true
}

function autonmap_bossbox_switch(){
    if(New_getValue('nmap_openbox_use')=='优先骰子'){
        var autonmap_bossbox_switch_text='优先骰子'
        clickRun('autonmap_bossbox_switch',"New_setValue('nmap_openbox_use','优先活力');autonmap_bossbox_switch()")
    }else{
        var autonmap_bossbox_switch_text='优先活力'
        clickRun('autonmap_bossbox_switch',"New_setValue('nmap_openbox_use','优先骰子');;autonmap_bossbox_switch()")
    }
    setIdinnerHTML('autonmap_bossbox_switch',autonmap_bossbox_switch_text)
}

async function auto_switch(id,GMvar,defaultValue=0,onGMvalue=1,offGMvalue=0,onText='已开启',offText='已关闭',refresh=0){
    if(!document.getElementById(id)){return}
    await sleep(25)
    document.getElementById(id).onclick=()=>{
        if(New_getValue(GMvar)==onGMvalue){
            New_setValue(GMvar,offGMvalue)
            setIdinnerHTML(id,offText)
            //auto_switch(id,GMvar,onGMvalue,offGMvalue,onText,offText)
            if(GMvar=='only_freedemon'){New_setValue('next_demon_detect','0')}
            else if(GMvar=='autodemon_state'){New_setValue('next_demon_detect',getdate(1)+' 07:00')}
            else if(GMvar=='automining_state'){New_setValue('next_mining_detect',getdate(1)+' 08:00')}
            else if(GMvar=='autominingsite_state'){New_setValue('next_miningsite_detect',getdate(1)+' 08:00')}
        }else{
            New_setValue(GMvar,onGMvalue)
            setIdinnerHTML(id,onText)
            if(GMvar=='autodemon_state'){New_setValue('next_demon_detect','0')}
            else if(GMvar=='automining_state'){New_setValue('next_mining_detect','0')}
            else if(GMvar=='autominingsite_state'){New_setValue('next_miningsite_detect','0')}
            //auto_switch("${id}","${GMvar}",${onGMvalue},"${offGMvalue}","${onText}","${offText}")`)
        }
        if(refresh){location.reload()}
    }
    let GM_value=New_getValue(GMvar)
    if(GM_value===''){GM_value=defaultValue;New_setValue(GMvar,GM_value)}
    if(GM_value==onGMvalue){
        setIdinnerHTML(id,onText)
    }else{
        setIdinnerHTML(id,offText)
    }
}

function autonmap_switch(){
    if(New_getValue('autonmap_showstate')){
        var all_pets=`,
        血螳螂,小黑鼠,大黄蜂,
        毒毛虫,追风狼,獠牙猪,
        羽精灵,怒冠鸟,黑灵鸟,
        采矿猴,弑魂蚁,吞岩兽,大嘴蛇,
        厚甲龟,蓝灵鱼,水草兽,巨齿鳄,
        雷翼雕,血蝙蝠,荒原豹,苍山鹫,
        紫雾虫,巨甲虫,沼泽蛙,水蜥蜴,
        海龙鱼,双吻鱼,大钳蟹,日落豚,
        落魂兽,风雷蛛,幻灵狐,飞泪蝶,
        龙翼兽,半龙羽,蚀骨狼,巡游使,
        龙魂龟,雪人怪,冰晶猿,噬天虎,
        巨盾兽,龙吼鸟,黑灵虎,双头雕,
        圣晶怪,金甲虫,幽冥蚁,半人鱼,
        浴火龟,逐浪鲨,软泥虫,啸海螺,
        圣灵蚁,飞翼蛇,幻光兔,九霄鹰`.replaceAll('\n','').replaceAll(' ','').split(',')

        

        var citynum=1;var nodenum=1;var grabnum=1
        var nmap_text_used=''
        let mylv=myInfo.Lv()
        var last_city=parseInt(mylv/10)>8?8:parseInt(mylv/10)+1

        for(let city in city_map){
            if(citynum++ > last_city){break}
            nmap_text_used+=city+':'
            let nodeStart=nodenum
            city_map[city].forEach(map => {
                nmap_text_used+=` <label for="node${nodenum}">${map}</label><input type="checkbox" class=namp_checkbox id="node${nodenum}"><select id="count_node${nodenum}">
                <option value=1>1次</option>
                <option value=2>2次</option>
                <option value=3>3次</option>
                <option value=4>4次</option>
                <option value=5>5次</option>
                <option value=6>6次</option>
                </select>`
                nodenum++
                if(map=='宁静之森'){nmap_text_used+='<br><span style="opacity: 0;">:&emsp;&emsp;&emsp;&emsp;</span>'}
            })
            let nodeEnd=nodenum-1
            nmap_text_used+=` <a class=change_node_count id=sub_${nodeStart}_${nodeEnd} href='javascript:;'>减</a> <a class=change_node_count id=add_${nodeStart}_${nodeEnd} href='javascript:;'>增</a><br>&emsp;`
            var map_pet_num=grabnum>9?4:3
            var cycle=city=='林中空地'?1:2
            let petStart=grabnum
            for(let i=1;i<=cycle;i++){
                for(let i=1;i<=map_pet_num;i++){
                    nmap_text_used+='<a class=grabBall id=grab'+grabnum++ +' href="javascript:;"></a>'
                    if(i<map_pet_num){nmap_text_used+='|'}
                }
                if(i==cycle){
                    let petEnd=grabnum-1
                    nmap_text_used+=` <a class=switchgrabBall id=${petStart}_${petEnd} href="javascript:;">切换</a>`
                }
                nmap_text_used+='<br>'
                if(i<cycle){nmap_text_used+='&emsp;'}
            }
        }
        setIdinnerHTML('autonmap_switch','收起')
        setIdinnerHTML('autonmap_config',nmap_text_used)
        document.getElementById('autonmap_config').hidden=false
        clickRun('autonmap_switch',"New_setValue('autonmap_showstate',0);autonmap_switch()")
        for(let item of document.getElementsByClassName('switchgrabBall')){
            let petStart=item.id.split('_')[0]-0
            let petEnd=item.id.split('_')[1]-0

            document.getElementById(item.id).onclick=()=>{
                for(let i=petStart;i<=petEnd;i++){grabPetBall('grab'+i,all_pets[i],1)}
            }
        }

        for(let item of document.getElementsByClassName('change_node_count')){
            let [action,nodeStart,nodeEnd]=item.id.split('_')
            document.getElementById(item.id).onclick=()=>{
                for(let i=nodeStart-0;i<=nodeEnd;i++){
                    let id='count_node'+i
                    let node_count=document.getElementById(id)
                    if(document.getElementById('node'+i).checked){if(action=='add'){node_count.value++}else{node_count.value--}}
                    set_nmaplist(i,'change',node_count.value)
                    if(!node_count.value){node_count.options[0].selected=true}
                }
            }
        }
        var nmap_checkbox=document.getElementsByClassName('namp_checkbox')
        var grabBall=document.getElementsByClassName('grabBall')
        var nmaplist=New_getValue('autonmaplist',{})
        if(typeof(nmaplist)!="object"){nmaplist={}}

        let reset_node=0
        for(let i=1;i<=nmap_checkbox.length;i++){
            if(typeof(nmaplist['node'+i])!="object"){reset_node=1;console.log('reset node'+i);nmaplist['node'+i]={}}
            if(nmaplist['node'+i].state==1){document.getElementById('node'+i).checked=true}
            let count_index=0
            if(nmaplist['node'+i].count){
                count_index=nmaplist['node'+i].count-1
            }
            document.getElementById('count_node'+i).options[count_index].selected=true
            clickRun('node'+i,'set_nmaplist('+i+')')
            changeRun('count_node'+i,`set_nmaplist(${i},'count')`)
        }
        if(reset_node){New_setValue('autonmaplist',nmaplist)}
        
        for(let i=1;i<=grabBall.length;i++){
            grabPetBall('grab'+i,all_pets[i])
        }
    }else{
        document.getElementById('autonmap_config').hidden=true
        setIdinnerHTML('autonmap_switch','展开')
        clickRun('autonmap_switch',"New_setValue('autonmap_showstate',1);autonmap_switch()")
    }
}

function set_nmaplist(n,mode=null,count=null){
    let id='node'+n
    var nmaplist=New_getValue('autonmaplist',{})
    if(typeof(nmaplist[id])!='object'){nmaplist[id]={}}
    if(!mode){   
        let newValue=1
        if(nmaplist[id].state==1){newValue=0}
        nmaplist[id].state=newValue
    }else{
        if(mode=='change'){
            console.log(count)
            let state=count?true:false
            nmaplist[id].state=state
            let node=document.getElementById(id)
            node.checked=state
            count=count || 1
        }else{count=document.getElementById('count_node'+n).value}
        nmaplist[id].count=count
    }
    New_setValue('autonmaplist',nmaplist)
}

//New_setValue('BallToGrabPet','')
function setGrabPetBall(id,petName,newValue){
    let BallToGrabPet=New_getValue('BallToGrabPet',{})
    if(newValue==0){
        delete BallToGrabPet[petName]
    }else{
        BallToGrabPet[petName]=newValue
    }
    //console.log(BallToGrabPet)
    New_setValue('BallToGrabPet',BallToGrabPet)
    grabPetBall(id,petName)
}

function grabPetBall(id,petName,switch_mode=0){
    let BallToGrabPet=New_getValue('BallToGrabPet',{})
    let type=BallToGrabPet[petName]?BallToGrabPet[petName]-0:0

    let value=[]
    if(type==1){
        value=['-普',2]
    }else if(type==2){
        value=['-强',0]
    }else{
        value=['-无',1]
    }
    setIdinnerHTML(id,petName+value[0])
    if(switch_mode){setGrabPetBall(id,petName,value[1])}else{
        document.getElementById(id).onclick=()=>{setGrabPetBall(id,petName,value[1])}
    }
}
//New_setValue('run_copy_map',{})
function run_copy_map_switch(){
    let maps=['铜钱','灵石','灵力','综合']
    let text=''
    let run_maps=New_getValue('run_copy_map',{})
    for(let map of maps){
        text=`<input type="checkbox" id=${map}><label for=${map}>${map}</label> `
        addIdinnerHTML('run_copy_map',text)
        
        sleep(20).then(()=>{
            if(run_maps[map]){document.getElementById(map).checked=true}
            document.getElementById(map).onclick=()=>{
                let run_maps=New_getValue('run_copy_map',{})
                if(run_maps[map]){run_maps[map]=0}else{run_maps[map]=1}
                New_setValue('run_copy_map',run_maps)
                console.log(map)
            }
        })
    }
}

async function auto_manor(){
    if(New_getValue('auto_manor')!=1){return}
    if(datetime<New_getValue('next_ManorTime')){return}
    console.log('查看庄园')
    let alltext=getHttpResponseAsync(fenqu+'/manor/index.asp?sid='+sid)
    
    if(alltext.match('庄园-20级开放')){console.log('庄园-20级开放');return}
    if(alltext.match('恢复时间:')){
        let nexttimehour=alltext.match(/恢复时间:(\d+)时/)
        if(nexttimehour){var hour=nexttimehour[1]}
        let nexttimemin=alltext.match(/恢复时间:(\d时)*(\d+)分/)
        if(nexttimemin){var min=nexttimemin[2]- -1}
        New_setValue('next_ManorTime',getdatetime(hour,min))
    }else if(alltext.match('建造需要')){
        console.log('未建造庄园')
        New_setValue('next_ManorTime',getdatetime(1))
    }else{
        if(alltext.match('收获')){
            console.log('开始收获')
            getHttpResponseAsync(fenqu+'/manor/pickAll.asp?sid='+sid)
        }
        console.log('开始种植')
        let text=getHttpResponseAsync(fenqu+'/manor/plantAll.asp?sid='+sid+'&seedId=1')
        if(text.match('种植成功')){
            console.log('开始收获')
            getHttpResponseAsync(fenqu+'/manor/pickAll.asp?sid='+sid)
        }else if(text.match('今日内该种子已达种植上限')){
            text=getHttpResponseAsync(fenqu+'/manor/plantAll.asp?sid='+sid+'&seedId=4')
            console.log('开始收获')
            getHttpResponseAsync(fenqu+'/manor/pickAll.asp?sid='+sid)
        }
    }
}

function auto_transport_switch(){
    let sender=New_getValue('auto_transport',["已关闭"])[0]
    let all_senders=['采矿猴','神火龙','暗螳螂','蜂将军']
    let new_sender='已关闭'
    if(sender=='已关闭'){
        new_sender='采矿猴'
    }else if(sender=='采矿猴'){
        new_sender='神火龙'
    }else if(sender=='神火龙'){
        new_sender='暗螳螂'
    }else if(sender=='暗螳螂'){
        new_sender='蜂将军'
    }else{
        all_senders=["已关闭"]
    }
    if(new_sender != '已关闭'){
        while(all_senders[0] != new_sender){
            all_senders.shift()
        }
        if(new_sender != '采矿猴' && New_getValue('auto_transport_max_use_dianquan',0)==0){
            New_setValue('auto_transport_max_use_dianquan',50)
            document.getElementById('auto_transport_max_reset').value=1
            setIdinnerHTML('auto_transport_dianquan','(50点券)')
        }
    }
    New_setValue('auto_transport',all_senders)
    setIdinnerHTML('auto_transport_switch',new_sender)
}

function auto_transport_max_reset(max_count=10){
    if(max_count=='change'){
        let dianquan=50 * document.getElementById('auto_transport_max_reset').selectedOptions[0].value
        New_setValue('auto_transport_max_use_dianquan',dianquan)
        setIdinnerHTML('auto_transport_dianquan','('+dianquan+'点券)')
        
    }else{
        let options=''
        for(let i=0;i<=max_count;i++){
            options+='<option value='+i+'>'+i+'</option>'
        }
        setIdinnerHTML('auto_transport_max_reset',options)
        let index=New_getValue('auto_transport_max_use_dianquan')/50
        document.getElementById('auto_transport_max_reset').options[index].selected=true
        setIdinnerHTML('auto_transport_dianquan','('+index*50+'点券)')
    }
}

function getMonthCardAward(){
    if(New_getValue('last_getmonthcardAward')==today){return}
    let url=fenqu+'/monthcard/index.asp?sid='+sid
    let text=getHttpResponseAsync(url)
    let url_get=text.match(/每日200点券&nbsp;&nbsp;<a href=['"](.*?)['"]>领取</)
    if(url_get){
        let result=getHttpResponseAsync(url_get[1].replaceAll('&amp;','&'))
        if(result.match('领取')){New_setValue('last_getmonthcardAward',today)}
    }else{New_setValue('last_getmonthcardAward',today)}
}

if(href.match('/monstre/index')){
    replaceHTML(/(挑战开始时间.*?)</,"$1 <a id=auto_monstre href='javascript:;'>自动挑战</a><")
    clickRun('auto_monstre','auto_monstre()')
}

async function auto_monstre(){
    if(running_task.挑战杀人蜂){return}
    running_task.挑战杀人蜂=true
    if(timenow < '19:35' || timenow >= '21:00' || New_getValue('next_monstre')>(today+' 21:00')){new Task('挑战杀人蜂').del();return}
    

    if(timenow<'20:00'){
        let wait_time=timeDelta(getdatetime(20,0,0,null,0))
        console.log('杀人蜂: 等待'+wait_time/1000+'秒')
        await sleep(wait_time)
    }
    let wait_time=timeDelta(New_getValue('next_monstre'))
    if(wait_time!=0){
        console.log('杀人蜂: 等待'+Math.floor(wait_time/1000)+'秒')
        await sleep(wait_time)
    }
    if(href.match('monstre/index.asp')){
        var activityId=href.match(/(?<=activityId=)sshd\d+/)[0]
        var monstre_text=outerHTML
    }else{
        var [activityId,monstre_text]=await get_activity('monstre')
        var no_replace=1
    }
    
    let left_count=monstre_text.match(/今日剩余挑战次数:(\d+)/)
    if(left_count){
        left_count=left_count[1]
    }else if(monstre_text.match('当前等级无法挑战Boss')){
        New_setValue('next_monstre',getdatetime(0,10))
        new Task('挑战杀人蜂').del()
        return
    }
    new Task('挑战杀人蜂','auto_monstre',left_count).add()

    let url=fenqu+'/monstre/fight.asp?sid='+sid+'&activityId='+activityId
    let waitsec=monstre_text.match(/当前冷却时间:(\d分)?(\d+秒)?/)

    if(waitsec){waitsec=transfer_time(waitsec[0])+1;console.log('杀人蜂: 等待'+waitsec+'秒')}else{waitsec=0}
    await sleep(waitsec*1000)
    while(left_count>0){
        let text=getHttpResponseAsync(url)

        if(text.match('现在不是挑战时间')){break}
        else if(text.match('所需活力不足')){await HuoLiCao(left_count*15);continue}
        else if(text.match('冷却时间未过')){await sleep(3000);continue}

        let damage=text.match(/(对杀人蜂造成\d+伤害.*?获得了.*?)</)
        if(damage){
            console.log(damage[1])
            replaceHTML(/今日伤害排名:排名\d+/,'$1<br>'+damage[1],no_replace)
            left_count--
            if(left_count>0){
                new Task('挑战杀人蜂','auto_monstre',left_count).add()
            }else{
                break
            }
        }else if(text.match(/活动已结束|挑战次数为0/)){
            break
        }else{
            console.log(text)
            console.log("挑战杀人蜂异常")
        }
        console.log('杀人蜂: 等待120秒')
        await sleep(2*60*1000)
    }
    new Task('挑战杀人蜂').del()
    New_setValue('next_monstre',getdate(1)+' 20:00')
}

if (href.match('/christmas')){
    replaceHTML([
        [/(任务(\d):([^&]+)[^(]+\((\d+)\/(\d+)[^已]*?(activityId=(\w+)&amp;taskId=(\w+).>提交<\/a>)?)<b/g,'$1 <a class=task id=task$2_$4_$5_$7_$8 title=$3 href=javascript:;>自动完成</a><b'],
        [/(<br>任务奖励)/,'<br><span id=task_option></span>$1']
    ])

    for(let task of document.getElementsByClassName('task')){
        let name=task.title
        let id=task.id
        document.getElementById(id).onclick=async()=>{
            let [_,current,target,activityId,taskId]=id.split('_')
            let result=''
            console.log(name)
            if(name.match('除妖')){New_setValue('autominingsite_state',1);New_setValue('next_miningsite_detect','0');result='自动除妖已开启'}
            else if(name.match('矿山')){New_setValue('automining_state',1);New_setValue('next_mining_detect','0');result='自动挖矿已开启'}
            else if(name.match('镇妖')){New_setValue('autodemon_state',1);New_setValue('next_demon_detect','0');result='自动镇妖已开启'}
            else if(name.match('凝神香')){postHttpResponseAsync(newUrl('/christmas/handed.asp?sid=',`&activityId=${activityId}&taskId=${taskId}`),'count='+(target-current));result='凝神香已提交'}
            else if(name.match('竞技')){New_setValue('next_dailySport','');autosport(0,target);result='开始自动竞技'}
            else if(name.match('切磋')){autocontest(target-current,target);result='开始自动切磋'}
            else if(name.match('擂台')){autostage(target-current);result='开始自动擂台'}
            else if(name.match('水晶')){guanshui();result='开始灌注水晶'}
            else if(name.match('小喇叭')){
                let url=newUrl('/christmas/handed.asp?sid=',`&activityId=${activityId}&taskId=${taskId}`)
                let text=postHttpResponseAsync(url,'count='+(target-current))
                if(text.match('物品数量不足')){
                    if(document.getElementById('auto_buy_xiaolaba').checked){
                        let page=getHttpResponseAsync(newUrl('/christmas/handIndex.asp?sid=',`&activityId=${activityId}&taskId=${taskId}`))
                        let remain=page.match(/库存数量:(\d+)/)[1]
                        setIdinnerHTML(id,'2秒钟后购买'+(target-current-remain)+'个小喇叭')
                        await sleep(2000)
                        let buy=postHttpResponseAsync(newUrl('/mall/buy.asp?sid='),`count=${target-current-remain}&id=8`)
                        if(!buy.match('成功')){console.log(buy);setIdinnerHTML(id,'购买失败');return}
                        text=postHttpResponseAsync(url,'count='+(target-current))
                    }else{setIdinnerHTML(id,'数量不足');return}
                }
                result='小喇叭已提交'
            }
            setIdinnerHTML(id,result)
        }
        if(name.match('小喇叭')){
            addIdinnerHTML('task_option','<input type=checkbox id=auto_buy_xiaolaba><label for=auto_buy_xiaolaba>自动购买小喇叭</label>')
            checkboxRun('auto_buy_xiaolaba')
        }
    }
}

if(href.match('/pagoda/demon.asp')){
    let all_pk=0//outerHTML.match(/userId=\d+.*?floor=\d+['"]>挑战<\/a>/g)
    let replace_array=[]
    let userId_floor={}
    if(all_pk){
        for(let i=0;i<all_pk.length;i++){
            let userId=all_pk[i].match(/(?<=userId=)\d+/)[0]
            let floor=all_pk[i].match(/(?<=floor=)\d+/)[0]
            userId_floor[userId]=floor
            replace_array.push([all_pk[i],all_pk[i].replace(/href=['"].*?['"]/,'href="javascript:;" id='+userId)])
        }
    }
    replace_array.push([/(ID显示<\/a>)/,"$1 <a id=showZhanli href='javascript:;'></a> <a id=showBalcklist href='javascript:;'></a>"])
    replace_array.push([/(:\d+次)<br>/,"$1&emsp;自动镇妖: <a id=autodemon_switch href='javascript:;'></a><br>"])

    replaceHTML(replace_array)
    let showInfo=''
    auto_switch('autodemon_switch','autodemon_state')
    if(New_getValue('autodemon_showZhanli_state')==1){
        var autodemon_showZhanli_text='关闭战力显示'
        clickRun('showZhanli',"New_setValue('autodemon_showZhanli_state','')",1)
        showInfo+='战力'
    }else{
        var autodemon_showZhanli_text='增加战力显示'
        clickRun('showZhanli',"New_setValue('autodemon_showZhanli_state',1)",1)
    }

    if(New_getValue('autodemon_showBalcklist_state')==1){
        var autodemon_showBalcklist_text='关闭黑名单显示'
        clickRun('showBalcklist',"New_setValue('autodemon_showBalcklist_state','')",1)
        showInfo+='黑名单'
    }else{
        var autodemon_showBalcklist_text='增加黑名单显示'
        clickRun('showBalcklist',"New_setValue('autodemon_showBalcklist_state',1)",1)
    }
    showUserInfo(showInfo)
    setIdinnerHTML('showZhanli',autodemon_showZhanli_text)
    setIdinnerHTML('showBalcklist',autodemon_showBalcklist_text)
/*
    for(let userId in userId_floor){
        document.getElementById(userId).onclick=async ()=>{
            if(await Smart_Contest(userId)){
                window.open(newUrl('/pagoda/pk4Site.asp?sid=')+'&id=1&floor='+userId_floor[userId])
            }
        }
    }
*/
}

if(href.match('/pagoda/grabSiteRes.asp')){New_setValue('next_demon_detect','0')}

async function findBlacklist(){
    let selectedBlacklist=New_getValue('selectedBlacklist')
    selectedBlacklist=[833541]
    if(!selectedBlacklist){return}

    let text=demon_text.join()
    let Blacklist_found=text.match(eval('/userId=('+selectedBlacklist.join('|')+')/'))
    if(Blacklist_found){
        addIdinnerHTML('entry_todemon','(黑)')
        document.getElementsByTagName('title')[0].innerText='发现黑名单'
        if(!New_getValue('auto_fight_Blacklist')){return}
        let userId=Blacklist_found[1]
        let floor=text.match(eval('/第(\\d+)层&nbsp;<a href[^>]+userId='+userId+'/'))[1]
        if(!await Smart_Contest(userId)){return}
        let result=getHttpResponseAsync(newUrl('/pagoda/pk4Site.asp?sid=')+'&id=1&floor='+floor)
        if(result.match(/胜利|成功/)){
            console.log('抢占黑名单成功')
            addIdinnerHTML('entry_todemon','(抢占成功)')
            document.getElementsByTagName('title')[0].innerText='抢占黑名单成功'
        }else{
            console.log('抢占黑名单失败',result)
            addIdinnerHTML('entry_todemon','(抢占失败)')
            document.getElementsByTagName('title')[0].innerText='抢占黑名单失败'
        }
    }else if(text.match('【镇妖】')){
        addIdinnerHTML('entry_todemon','(无)')
    }
}
async function GM_share_var(name,floor,read=true,min=30){
    if(isWoker){
        postMessage({data:{action:'sync_var',name:'GM_share'}})
        await sleep(10)
        if(last_sync_GM_share && timeDelta(getdatetime(),last_sync_GM_share)>1000){
            console.log('GM_share还未同步',last_sync_GM_share);await sleep(50);console.log('GM_share可能同步',last_sync_GM_share)
        }
    }else{
        GM_share=GM_getValue('GM_share',{})
    }
    if(GM_share[name]==undefined){GM_share[name]={}}
    let this_floor=GM_share[name][floor]
    if(this_floor==undefined){this_floor={}}

    if(this_floor.id!=myId){
        //console.log(name,floor,this_floor.id,this_floor.endtime)
        if(timeDelta(this_floor.endtime)){return 0}
    }
    if(read){return 1}
    this_floor.id=myId
    this_floor.endtime=getdatetime(0,min)
    GM_share[name][floor]=this_floor
    if(isWoker){
        //console.log(`GM_setValue('GM_share',${JSON.stringify(GM_share)})`)
        postMessage({data:{action:'command',command:`GM_setValue('GM_share',${JSON.stringify(GM_share)})`}})
    }else{
        GM_setValue('GM_share',GM_share)
    }
}


async function autodemon(){
    if(notWoker && running_task.镇妖){console.log('镇妖:任务运行中');return}
    running_task.镇妖=true
    let wait_time=timeDelta(New_getValue('next_demon_detect'))
    if(wait_time>18e5 || timenow<'07:00' || timenow>'23:00'){new Task('镇妖').del();return}
    if(notWoker){
        newWorker({
            task: ['镇妖','autodemon','',''],
            fn: ['Task','GM_share_var','randomOne','setIdinnerHTML','addIdinnerHTML','findBlacklist','get_demon_text','transfer_time','autodemon'],
            vars: [],
            text:`
            autodemon().then(()=>{new Task('镇妖').del()})
            `
        })
        return
    }
    demon_text=[]
    if(New_getValue('findBlacklist')){await get_demon_text();await findBlacklist()}

    let autodemon_hidename=New_getValue('autodemon_hidename')
    let autodemon_freelast=New_getValue('autodemon_freelast')
    let only_freedemon=New_getValue('only_freedemon')

    if(autodemon_freelast){
        if(timenow > '22:00' && timenow < '22:30'){
            let wait_time=timeDelta(getdatetime(22,29,50,null,0),null,no_ms=true)
            console.log('镇妖: 等待'+wait_time/1000+'秒')
            await sleep(wait_time)
        }else if(!autodemon_hidename){New_setValue('next_demon_detect',getdatetime(22,0,0,null,0));return}
    }else if(timenow < '22:30'){
        
        if(wait_time){
            setIdinnerHTML('entry_todemon','镇妖(剩'+transfer_time(wait_time/1000,part=1)+')')
            await sleep(wait_time>18e4?18e4:wait_time + Math.random()*5000)
        }
    }
    let last_get_demon=timeDelta(getdatetime(),demon_text[2])
    if(!last_get_demon || last_get_demon > 5000){await get_demon_text()}
    if(demon_text.length==0){console.log('无镇妖文字');return}

    let types=[0,1]
    let free_times=demon_text[0].match(/试炼层:(\d)次/)[1]-0
    if(only_freedemon && !demon_text[0].split('试炼层')[0].match('首次免费')){console.log('镇妖退出-0');New_setValue('next_demon_detect',getdate(1)+' 07:00');return}
    if(free_times==0){types.shift();console.log('试炼镇妖次数达上限')}
    
    let times=demon_text[1].match(/炼狱层:(\d+)次/)[1]-0
    let max_times=New_getValue('autodemon_max_times',9)
    if(times==0 || 10-times>=max_times){types.pop();console.log('炼狱镇妖次数达上限:'+max_times)}

    if(types.length==0){console.log('镇妖次数已达上限');New_setValue('next_demon_detect',getdate(1)+' 07:00');return}
    
    let endsoon=[]
    let name='镇妖'
    for(let i=types[0]; i<=1; i++){
        let hadSite=demon_text[i].split('层&nbsp')[0].match(/我正占领第\d+层\(剩(.*?)\)/)
        if(hadSite){
            console.log(hadSite[1],transfer_time(hadSite[1]))
            let wait_time=transfer_time(hadSite[1])
            setIdinnerHTML('entry_todemon','镇妖(剩'+transfer_time(wait_time,1)+')')
            New_setValue('next_demon_detect',getdatetime(0,0,wait_time))
            console.log('镇妖: 等待'+wait_time+'秒')
            await sleep(wait_time*1000)
            await get_demon_text()
        }

        if(timenow>'22:29:58' || !New_getValue('autodemon_state')){console.log('镇妖退出-1');New_setValue('next_demon_detect',getdate(1)+' 07:00');return}

        let empty=demon_text[i].match(/(?<=floor=)\d+(?=.>占领<)/g) || []
        let min_empty=timenow<'15:00'?3:2
        if(empty.length<min_empty){console.log(`镇妖空位:${empty.length},小于${min_empty}`);empty=false}
        if(empty.length && timenow<'22:00' && autodemon_hidename && demon_text[0].match('/pagoda/openHideNameIndex.asp')){
            console.log(postHttpResponseAsync(newUrl('/pagoda/openHideName.asp?sid=','&id=1'),'vestName='+encodeURI(New_getValue('autodemon_hide_username')||'无名')),'匿名模式镇妖')
        }
        while(empty.length){
            let [floor,index]=randomOne(empty)
            if(GM_share_var(name,floor,0,30)==0){empty.splice(index,1);console.log(`镇妖:第${floor}层已分配给其他号-1`);continue}
            await sleep(100)
            if(GM_share_var(name,floor)==0){console.log(`镇妖:第${floor}层已分配给其他号-2`);empty.splice(index,1);continue}
            let url=fenqu+'/pagoda/grabSite.asp?sid='+sid+'&id=1&floor='+floor
            if(autodemon_freelast && i==0){
                if(timenow > '22:29' && timenow < '22:30'){
                    let wait_time=timeDelta(getdatetime(22,29,58,null,0),null,no_ms=true)
                    console.log('镇妖: 等待'+wait_time/1000+'秒')
                    await sleep(wait_time)
                }else{console.log('镇妖退出-2');return}
            }
            console.log('镇妖即将开始',getdatetime())
            if(timenow < '22:29' && timeDelta(getdatetime(),demon_text[2]) > 5000){console.log('镇妖退出-3');return}
            let grabtext=getHttpResponseAsync(url,0,1)
            console.log('镇妖开始时间',getdatetime())
            if(grabtext.match('镇妖符')){
                setIdinnerHTML('entry_todemon','镇妖符不足')
            }else if(grabtext.match('成功占领')){
                setIdinnerHTML('entry_todemon','镇妖(剩30分)')
                New_setValue('next_demon_detect','0')
            }else if(grabtext.match('当前镇妖中')){
                setIdinnerHTML('entry_todemon','镇妖(已镇妖)')
            }else if(grabtext.match('当前自动闯塔中')){
                setIdinnerHTML('entry_todemon','镇妖(闯塔中)')
                New_setValue('next_demon_detect',getdatetime(0,10))
            }else{
                console.log(grabtext)
                setIdinnerHTML('entry_todemon','镇妖(异常)')
                New_setValue('next_demon_detect','0')
            }
            console.log('镇妖退出-end');
            return
        }
        /*
        let endsoontime=demon_text[i].match(/剩余:(\d+分)?(\d+秒)?\.</g)
        for(let time of endsoontime){
            endsoon.push(transfer_time(time))
        }
        
        if(i==1 && endsoon.length){
            console.log('镇妖',endsoon)
            endsoon.sort((a,b)=>a-b)
            let wait_time=endsoon[0]
            setIdinnerHTML('entry_todemon','镇妖(等待'+wait_time+'秒)')
            console.log('等待'+wait_time+'秒，其他人镇妖结束')
            await sleep(wait_time*1000)
            i=2-types.length-1
            endsoon=[]
            await sleep(1000+Math.random()*1000)
            await get_demon_text(force=1)
        }*/
    }
    
}

if(href.match('/mining/index.asp')){
    replaceHTML(/(选择矿脉)/,"$1 自动挖矿: <a id=automining_switch href='javascript:;'></a> 自动除妖: <a id=autominingsite_switch href='javascript:;'></a>")
    auto_switch('automining_switch','automining_state')
    auto_switch('autominingsite_switch','autominingsite_switch')
}

if(href.match('/mining/pkRes.asp')){New_setValue('next_mining_detect','0')}

async function automining(){
    if(notWoker && running_task.矿山){console.log('挖矿:任务运行中');return}
    running_task.矿山=true
    let wait_time=timeDelta(New_getValue('next_mining_detect'))
    if(wait_time>18e5 || timenow<'08:00' || timenow > '22:30'){new Task('矿山').del();return}
    if(notWoker){
        newWorker({
            task: ['矿山','automining','',''],
            fn: ['Task','GM_share_var','randomOne','setIdinnerHTML','addIdinnerHTML','transfer_time','automining'],
            vars: [],
            text:`
            automining().then(()=>{
            new Task('矿山').del()})
            `
        })
        return
    }
    
    if(wait_time){
        setIdinnerHTML('entry_mining','矿山(剩'+transfer_time(wait_time/1000,part=1)+')')
        if(timenow>'22:00'){return}
        let waitsec=wait_time>18e4?18e4:wait_time
        console.log('矿山: 等待'+waitsec/1000+'秒')
        await sleep(waitsec)
    }
    let mining_config=New_getValue('automining_config',[])
    if(!mining_config.length){New_setValue('next_mining_detect',getdate(1)+' 08:00');return}

    let all_mining={石矿山1: 1001,石矿山2: 1002,铁眉山: 1003,赤峰山: 1004,地银山: 1005,牛神山: 'nx01'}
    let max_times=New_getValue('automining_max_times','0')
    let all_max_times=max_times
    let each_times={}
    if(max_times.match(',')){
        let n=0
        all_max_times=0
        for(let times of max_times.split(',')){
            times=parseInt(times)
            if(n>=mining_config.length){break}
            each_times[mining_config[n++]]=times
            all_max_times+=times
        }
    }
    if(max_times){
        if(New_getValue(['record','automining_times'])>=all_max_times){console.log('挖矿次数达上限:'+all_max_times);New_setValue('next_mining_detect',getdate(1)+' 08:00');return}
    }
    let page_text=getHttpResponseAsync(newUrl('/mining/index.asp?sid='))
    let hadSite=page_text.match(/第\d+矿位&nbsp;\((.*?)\)/)
    if(hadSite){
        let wait_time=transfer_time(hadSite[1])
        console.log(hadSite[1],wait_time)
        setIdinnerHTML('entry_mining','矿山(剩'+transfer_time(wait_time,1)+')')
        New_setValue('next_mining_detect',getdatetime(0,0,wait_time))
        console.log('矿山: 等待'+wait_time+'秒')
        await sleep(wait_time*1000)
    }else{
        let wait_time=timeDelta(New_getValue('next_mining_detect'))
        if(wait_time){setIdinnerHTML('entry_mining','矿山(等待'+Math.floor(wait_time/1000)+'秒)');await sleep(wait_time)}
    }
    if(New_getValue('automining_state')!=1){New_setValue('next_mining_detect',getdate(1)+' 08:00');return}
    if(max_times){
        let times=0
        let remain_times=0

        for(let name in all_mining){
            let id=all_mining[name]
            let count=getHttpResponseAsync(newUrl('/mining/miningItemInfo.asp?sid=')+'&activityId=&id='+id).match(/采矿上限:(\d+)/)
            if(!count){continue}
            if(each_times[name]){
                let remain=each_times[name]-count[1]>0?each_times[name]-count[1]:0
                if(remain==0){mining_config=mining_config.filter(item=>item!=name)}else{remain_times+=remain}
                times+=parseInt(count[1])
            }
        }
        if(remain_times==0 && times != 0){
            console.log('挖矿次数达上限:'+max_times)
            New_setValue(['record','automining_times'],times)
            New_setValue('next_mining_detect',getdate(1)+' 08:00')
            return
        }
    }

    if(mining_config.length==0){console.log('挖矿都够了，不该到这');return}
    let idlist=[]
    for(let mining of mining_config){idlist.push(all_mining[mining])}
    let endtime={}
    let automining_last=New_getValue('automining_last')

    for(let i=0;i<idlist.length;i++){
        let id=idlist[i]
        let mining_url=fenqu+'/mining/miningItemInfo.asp?sid='+sid+'&activityId=&id='+id

        await sleep(1000+Math.random()*1000)
        if(automining_last){
            if(timenow > '21:30' && timenow < '22:00'){
                let wait_time=timeDelta(getdatetime(21,59,50,null,0),null,no_ms=true)
                console.log('等待:'+wait_time/1000+'秒')
                await sleep(wait_time)
                syncTime()
            }else if(timenow>'10:00'){
                New_setValue('next_mining_detect',getdate(1)+' 08:00');return
            }else{New_setValue('next_mining_detect',getdatetime(21,30,0,null,0));return}
        }
        
        alltext=getHttpResponseAsync(mining_url)
        let headinfo=alltext.split('矿位1')[0]
        if(headinfo.match('没有此矿脉')){console.log('无此矿脉:',idlist,i,id);continue}

        if(timenow>'21:59:58'){return}
        let limit=headinfo.match(/采矿上限:(\d+)\/(\d+)/)
        if(!limit){i--;continue}
        let name=Object.keys(all_mining).filter(key=>all_mining[key]==id)[0]
        console.log('查看矿位 -',name)
        if(limit[1]==limit[2]){continue}

        let min_empty=1
        if(timenow<'13:00'){
            min_empty=name=='地银山'?3:2
        }else if(timenow<'16:00'){
            min_empty=name=='地银山'?2:1
        }
        let wait_index=min_empty-1
        let empty=alltext.match(/(?<=index=)\d+(?=[^<]+占位<\/a><br)/g)
        if(empty){
            if(empty.length<min_empty){
                console.log(`${name}空位:${empty.length}, 小于${min_empty}`)
                wait_index-=empty.length
                empty=[]
            }
            while(empty.length){
                let [floor,index]=randomOne(empty)
                if(GM_share_var(name,floor,0,30)==0){empty.splice(index,1);console.log(`矿山:${name}-第${floor}层已分配给其他号-1`);continue}
                await sleep(100)
                if(GM_share_var(name,floor)==0){console.log(`矿山:${name}-第${floor}层已分配给其他号-2`);empty.splice(index,1);continue}
                let url=fenqu+'/mining/occupy.asp?sid='+sid+'&id='+id+'&index='+floor+'&activityId='
                if(automining_last){
                    if(timenow > '21:59' && timenow < '22:00'){
                        let wait_time=timeDelta(getdatetime(21,59,58,null,0),null,no_ms=true)
                        console.log('挖矿卡点: 等待'+wait_time/1000+'秒')
                        await sleep(wait_time)
                    }else{return}
                }
                let text=getHttpResponseAsync(url,0,1)
                //console.log(text)
                if(text.match('开放时间')){
                    New_setValue('next_mining_detect',getdate(1)+' 08:00')
                }else if(text.match('采矿队伍不能为空')){
                    console.log('采矿队伍不能为空')
                    setIdinnerHTML('entry_mining','矿山(队伍为空)')
                }else if(text.match('绑定手机')){
                    console.log('挖矿需绑定手机')
                    setIdinnerHTML('entry_mining','矿山(绑定手机)')
                }else if(text.match('道具不足')){
                    setIdinnerHTML('entry_mining','矿山(镐子不足)')
                }else if(text.match('成功')){
                    setIdinnerHTML('entry_mining','矿山(剩30分)')
                    console.log('开始挖矿')
                    New_setValue('next_mining_detect',getdatetime(0,30))
                }else{console.log(url,text)}
                return
            }
            
        }
        let endsoontime=alltext.match(/剩余:(\d+分)?(\d+秒)?/g)
        let other_end=[]
        for(let time of endsoontime){
            other_end.push(transfer_time(time))
        }
        other_end.sort((a,b)=>a-b)
        console.log('前三位完成倒计时(s):',other_end[0],other_end[1],other_end[2])
        endtime[id]=other_end[wait_index]
        //console.log('wait_index',wait_index)
        if(idlist.length == Object.keys(endtime).length){
            console.log(endtime)

            let wait_time=Math.min(...Object.values(endtime))
            setIdinnerHTML('entry_mining','矿山(等待'+wait_time+'秒)')
            console.log('等待'+wait_time+'秒，其他人挖矿结束')
            New_setValue('next_mining_detect',getdatetime(0,0,wait_time))
            await sleep(wait_time*1000)
            let id=Object.keys(endtime).filter(id=>endtime[id]==wait_time)
            i=idlist.indexOf(id[0]-0)-1
            Object.keys(endtime).forEach(id=>endtime[id]-=wait_time)
        }
    }
}

async function auto_miningsite(){
    if(notWoker && running_task.除妖){console.log('除妖:任务运行中');return}

    running_task.除妖=true
    let wait_time=timeDelta(New_getValue('next_miningsite_detect'))
    if(wait_time>18e5 || New_getValue('record_no_miningsite') || timenow > '22:30' || timenow < '10:00'){new Task('除妖').del();return}
    if(notWoker){
        newWorker({
            task: ['除妖','auto_miningsite','',''],
            fn: ['Task','GM_share_var','randomOne','setIdinnerHTML','addIdinnerHTML','transfer_time','auto_miningsite'],
            vars: [],
            text:`
            auto_miningsite().then(()=>{new Task('除妖').del()})
            `
        })
        return
    }
    
    if(isHome){addIdinnerHTML('entry_remain','|<a id=entry_miningsite href='+newUrl('/miningsite/index.asp?sid=')+'></a>')}
    if(wait_time){
        setIdinnerHTML('entry_miningsite','除妖(剩'+transfer_time(wait_time/1000,part=1)+')')
        await sleep(wait_time>18e4?18e4:wait_time)
    }
    let page_text=getHttpResponseAsync(newUrl('/miningsite/index.asp?sid='))
    if(page_text.match('今日进入矿山争霸需要消耗除妖令牌')){
        if(!New_getValue('autominingsite_state')){New_setValue('next_miningsite_detect',getdate(1)+' 08:00');return}
        if(timenow>'18:00'){setIdinnerHTML('entry_miningsite','除妖(请手动进入除妖)');return}
        page_text=getHttpResponseAsync(newUrl('/miningsite/passObject.asp?sid='))
        if(page_text.match('所需物品不足')){
            setIdinnerHTML('entry_miningsite','除妖(除妖令不足)')
            return
        }
    }else if(page_text.match('仅限20-29级玩家')){New_setValue('record_no_miningsite',true);return}

    let hadSite=page_text.match(eval(`/userId=${myId}.*?(剩余.*?)</`))
    let remain=page_text.match(/挑战次数:(\d+)\/(\d+)/)
    if(hadSite){
        let wait_time=transfer_time(hadSite[1])
        console.log(hadSite[1],wait_time)
        setIdinnerHTML('entry_miningsite','除妖(剩'+transfer_time(wait_time,1)+')')
        New_setValue('next_miningsite_detect',getdatetime(0,0,wait_time))
        await sleep(wait_time*1000)
    }else{
        if(remain[1]==remain[2]){New_setValue('next_miningsite_detect',getdate(1)+' 08:00');return}
        let wait_time=timeDelta(New_getValue('next_miningsite_detect'))
        if(wait_time){setIdinnerHTML('entry_miningsite','除妖(等待'+Math.floor(wait_time/1000)+'秒)');await sleep(wait_time)}
    }
    if(New_getValue('autominingsite_state')!=1){New_setValue('next_miningsite_detect',getdate(1)+' 08:00');return}
    if(timenow>'21:59:58'){return}
    let endsoon=[]
    for(let i=0;i<1;i++){
        await sleep(2000+Math.random()*3000)
        page_text=getHttpResponseAsync(newUrl('/miningsite/index.asp?sid='))
        let alltext=page_text.split('>矿场霸主&')[0]
        let empty=alltext.match(/(?<=;id=)\d+(?=.>占领<)/g)
        if(empty && timenow<'14:00' && empty.length<2){console.log(`除妖空位:${empty.length}, 小于2`);empty=false}
        let name='除妖'
        while(empty && empty.length){
            let [floor,index]=randomOne(empty)
            if(GM_share_var(name,floor,0,30)==0){empty.splice(index,1);console.log(`${name}:第${floor}层已分配给其他号-1`);continue}
            await sleep(100)
            if(GM_share_var(name,floor)==0){console.log(`${name}:第${floor}层已分配给其他号-2`);empty.splice(index,1);continue}
            let text=getHttpResponseAsync(newUrl('/miningsite/occupy.asp?sid=','&id='+floor))
            if(text.match('占领成功')){
                setIdinnerHTML('entry_miningsite','除妖(剩30分)')
                New_setValue('next_miningsite_detect',getdatetime(0,30))
            }else if(text.match('队伍不能为空')){
                console.log('队伍不能为空')
                setIdinnerHTML('entry_miningsite','除妖(队伍为空)')
            }else if(text.match('绑定手机')){
                console.log('除妖需绑定手机')
                setIdinnerHTML('entry_miningsite','除妖(绑定手机)')
            }else{console.log('异常',text)}
            return
        }
        let endsoontime=alltext.match(/剩余:(\d+分)?(\d+秒)?/g)
        for(let time of endsoontime){
            endsoon.push(transfer_time(time))
        }
        if(endsoon.length){
            console.log('除妖',endsoon)
            endsoon.sort((a,b)=>a-b)
            let wait_time=endsoon[0]
            setIdinnerHTML('entry_miningsite','除妖(等待'+wait_time+'秒)')
            console.log('等待'+wait_time+'秒，其他人除妖结束')
            await sleep(wait_time*1000)
            i= -1
            endsoon=[]
        }
    }
}

function automining_config(){
    let mining_config=New_getValue('automining_config',[])
    let all_mining={石矿山1: 1001,石矿山2: 1002,铁眉山: 1003,赤峰山: 1004,地银山:1005 ,牛神山: 'nx01'}
    let left_mining=Object.keys(all_mining)
    if(mining_config.length){
        let config=''
        let n=1
        //for(let i=0;i<mining_config.length;i++){
        for(let mining of mining_config){
            config+=`[${n++}]<a id=${mining} href='javascript:;'>${mining}</a> `
            left_mining.splice(left_mining.indexOf(mining),1)
        }
        setIdinnerHTML('mining_selected',config)
        let mining_selected=document.getElementById('mining_selected').children
        for(let item of mining_selected){
            document.getElementById(item.id).onclick=()=>{
                let mining_config=New_getValue('automining_config',[])
                mining_config.splice(mining_config.indexOf(item.id),1)
                New_setValue('automining_config',mining_config)
                automining_config()
            }
        }
    }else{setIdinnerHTML('mining_selected','无')}
    if(left_mining.length){
        let config=''
        for(let mining of left_mining){
            config+=`<a id=${mining} href='javascript:;'>${mining}</a> `
        }
        setIdinnerHTML('mining_left',config)
        let mining_left=document.getElementById('mining_left').children
        for(let item of mining_left){
            document.getElementById(item.id).onclick=()=>{
                let mining_config=New_getValue('automining_config',[])
                mining_config.push(item.id)
                New_setValue('automining_config',mining_config)
                automining_config()
            }
        }
    }else{setIdinnerHTML('mining_left','无')}
}

async function auto_practice(){
    if(!New_getValue('autopractice_state')){return}
    let next_PracticeTime=New_getValue('next_PracticeTime')
    if(timenow<'06:30'){
        if(timeDelta(next_PracticeTime,today+' 06:30:00')){console.log('修行结束时间在6:30之后，不等待');return}
        let wait_time=timeDelta(next_PracticeTime)
        console.log('修行: 等待'+wait_time/1000+'秒')
        await sleep(wait_time)
    }else if(next_PracticeTime>datetime){return}
    
    let page_text=getHttpResponseAsync(newUrl('/practice/index.asp?sid='))
    let remain=page_text.match(/(剩余：[^<]+)/)
    if(remain){
        let wait_time=transfer_time(remain[1])
        console.log('修行: 还剩'+wait_time+'秒')
        New_setValue('next_PracticeTime',getdatetime(0,0,wait_time))
        if(timenow<'06:30'){await sleep(wait_time*1000)}else{return}
    }else{
        getHttpResponseAsync(newUrl('/practice/practiceCompute.asp?sid='))
    }
    console.log('开始修行')

    let map_num=New_getValue('auto_practice_city')
    let map_hour=New_getValue('auto_practice_time',8)
    if(!map_num){let mylv=myInfo.Lv();map_num=parseInt(mylv/10)>7?7:parseInt(mylv/10)+1}
    let url_start=fenqu+'/practice/practiceStart.asp?sid='+sid+'&&mapId=dt00'+map_num+'&hour='+map_hour

    let practice_huoli={hour2: 30, hour4: 50, hour8: 80, hour12: 120}
    let text=getHttpResponseAsync(url_start)

    if(text.match('尚未配置修行队伍')){
        console.log('尚未配置修行队伍');return
    }
    for(let i=0;i<3;i++){
        if(text.match('活力不足')){
            await HuoLiCao(practice_huoli['hour'+map_hour]-myInfo.Huoli())
            text=getHttpResponseAsync(url_start)
        }else{break}
    }

    if(text.match('修行进行中')){
        New_setValue('next_PracticeTime',getdatetime(map_hour))
    }else{console.log(text);New_setValue('next_PracticeTime',getdatetime(0,10));return}

    if(timenow>'00:00' && timenow<'06:30'){auto_practice()}
}


if(href.match('/ncopy/list.asp')){
    replaceHTML('活动副本地图:',"活动副本地图:<a id=autoncopy href='javascript:;'>&nbsp;&nbsp;&nbsp;&nbsp;自动扫荡</a>")
    clickRun('autoncopy','autoncopy(1)')
}

async function autoncopy(force=0){
    
    if(!isWoker){
        if(!force && New_getValue('last_autoncopy')==today || timenow<'10:00'){new Task('活动副本').del();return}
        newWorker({
            task : ['活动副本','autoncopy'],
            fn: ['Task','autoncopy','compress_bag'],
            vars: [],
            text:`
            autoncopy()
            `
        })
        return
    }

    for(let id=1;id<=3;id++){
        let awards=getHttpResponseAsync(newUrl('/ncopy/index.asp?sid=')+'&id='+id).match(/\d+(?=['"]>领取奖励<)/g)
        if(awards){
            for(let floor of awards){
                getHttpResponseAsync(newUrl('/ncopy/takeAward.asp?sid=')+'&id='+id+'&floor='+floor)
            }
        }
        let end=0
        for(let floor=1;floor<=13;floor++){
            let url=fenqu+'/ncopy/pk.asp?sid='+sid+'&id='+id+'&floor='+floor
            let text=getHttpResponseAsync(url)

            if(text.match('人物等级不满足该层要求')){New_setValue('last_autoncopy',today);return}
            if(text.match("挑战成功！")){
                console.log(id+'-'+floor+' 挑战成功')
            }
            else if(text.match('挑战该层不合法')){
                console.log(id+'-'+floor+' 已挑战过')
            }
            else if(text.match('挑战次数已用完')){
                console.log('活动副本-'+id+'挑战次数用完')
                end=1
            }
            else{
                console.log(id+'-'+floor+' 挑战失败')
                end=1
            }
            let award_url=fenqu+'/ncopy/takeAward.asp?sid='+sid+'&id='+id+'&floor='+floor
            let Award_text=getHttpResponseAsync(award_url)
            if(Award_text.match('获得')){console.log('领取第'+id+'副本第'+floor+'层奖励')}
            else if(Award_text.match('背包容量不足')){
                await compress_bag()
                Award_text=getHttpResponseAsync(award_url)
                if(Award_text.match('获得')){console.log('领取第'+id+'副本第'+floor+'层奖励')}
            }
            if(end){
                text=getHttpResponseAsync(newUrl('/ncopy/index.asp?sid=','&id='+id))
                let remain=text.match(/今日挑战:(\d)\/(\d)/)||[1,1,1]
                if(remain[1]==remain[2]){break}
                floor=end=0
            }
        }
    }
    new Task('活动副本').del()
    New_setValue('last_autoncopy',today)
}

if(/\/equip\/index/.test(href)){
    let petId=outerHTML.match(/:[^>]+petId=(\w+)/)[1]
    replaceHTML(/>强化</g,' class="enhance">强化<')
    replaceHTML('<br><br><br>','<br><a id=equipAll href="javascript:;">一键装备</a> <a id=upgradeAll href="javascript:;">一键炼制</a> <a id=enhanceAll href="javascript:;">一键强化所有</a><br><br>')
    replaceHTML(/(>..(.骨|.魂)<\/a>\.<a) href=[^>]+upgrade2pet[^>]+;id=(\w+)[^>]+>炼制/g,' id=name_$2$1 class=upgrade id=$2_$3 href="javascript:;">炼制')
    let all_upgrade=document.getElementsByClassName('upgrade')
    document.getElementById('upgradeAll').onclick=()=>{
        if(!all_upgrade){return}
        for(let item of all_upgrade){
            let name=item.id.split('_')[0]
            let id=item.id.split('_')[1]
            let text=getHttpResponseAsync(newUrl('/equip/upgrade2pet.asp?sid=')+'&id='+id+'&petId='+petId)
            if(text.match('材料不足')){setIdinnerHTML(item.id,'材料不足')}else(setIdinnerHTML('name_'+name,text.match(/战骨名称:(....)/)[1]))
        }
    }
    for(let item of all_upgrade){
        let name=item.id.split('_')[0]
        let id=item.id.split('_')[1]
        document.getElementById(item.id).onclick=()=>{
            let text=getHttpResponseAsync(newUrl('/equip/upgrade2pet.asp?sid=')+'&id='+id+'&petId='+petId)
            if(text.match('材料不足')){setIdinnerHTML(item.id,'材料不足')}else(setIdinnerHTML('name_'+name,text.match(/战骨名称:(....)/)[1]))
        }
    }
    let all_enhance=document.getElementsByClassName('enhance')
    clickRun('equipAll','equipAll()')
    for(let i=0;i<all_enhance.length;i++){
        let each_enhance=all_enhance[i]
        each_enhance.outerHTML+='.<a id=do_enhance'+i+' href="javascript:;">一键强化</a>.<a id=do5_enhance'+i+' href="javascript:;">强化5次</a><span id=enhanceResult'+i+'></span>'
        let id=each_enhance.href.split('&id=')[1]
        clickRun('do_enhance'+i,'autoenhance("'+id+'","enhanceResult'+i+'")')
        clickRun('do5_enhance'+i,'autoenhance("'+id+'","enhanceResult'+i+'",5)')
    }
    document.getElementById('enhanceAll').onclick=()=>{
        for(let i=0;i<all_enhance.length;i++){
            let each_enhance=all_enhance[i]
            let id=each_enhance.href.split('&id=')[1]
            autoenhance(id,'enhanceResult'+i)
        }
    }
}



async function equipAll(){
    var alluse=outerHTML.match(/type=\d/g)
    var petId=outerHTML.match(/petId=(\w+)&amp;type=/)[1]
    let refresh=1

    for(let i=0;i<alluse.length;i++){
        let type=alluse[i].match(/type=(\d)/)[1]
        let url=fenqu+'/equip/wearIndex.asp?sid='+sid+'&petId='+petId+'&type='+type
        let text=getHttpResponseAsync(url)
        let equipId=text.match(/(?<=&amp;id=)(\w+)(?=&)/g)
        if(equipId){
            let text=getHttpResponseAsync(fenqu+'/equip/wear.asp?sid='+sid+'&id='+equipId[equipId.length-1]+'&petId='+petId)
            if(text.match('等级不足')){setIdinnerHTML('equipAll','宠物等级不足');refresh=0}
        }else{
            let text=postHttpResponseAsync(fenqu+'/mall/buy.asp?sid='+sid+'&type=0','count=1&id=zg100'+type)
            if(text.match('余额不足')){setIdinnerHTML('equipAll','铜钱余额不足');return}
            i--
        }
    }
    refresh && location.reload()
}

async function autoenhance(id,resultId,count=100){
    let url=fenqu+'/equip/enhance2pet.asp?sid='+sid+'&id='+id
    while(count > 0){
        let text=getHttpResponseAsync(url)
        if(text.match('不足')){return count}
        if(resultId){setIdinnerHTML(resultId,text.match(/强化等级:([^<]+\d级)→/)[1])}
        count--
        await sleep(20)
    }
    return count
}

async function auto_enhanceTask(count){
    if(count<=0){return}

    if(!count){
        let task_text=getHttpResponseAsync(newUrl('/task/taskInfo.asp?sid=','&type=1&id=1004'))
        let current=task_text.match(/当前值:(\d)/)
        if(current){count=5-current[1]}else{return}
    }
    let petId=New_getValue('record_last_enhance_petId')
    let page_text=''
    if(petId){page_text=getHttpResponseAsync(newUrl('/equip/index.asp?sid=','&petId='+petId))}
    else{page_text=getHttpResponseAsync(newUrl('/equip/index.asp?sid='))}
    let enhance=page_text.match(/(?<=;id=)[^>]+(?=.>强化)/g)
    if(!enhance){
        let all_petId=page_text.match(/(?<=petId=)\w+/g)
        all_petId=Array.from(new Set(all_petId))
        for(let petId of all_petId){
            page_text=getHttpResponseAsync(newUrl('/equip/index.asp?sid=','&petId='+petId))
            enhance=page_text.match(/(?<=;id=)[^>]+(?=.>强化)/g)
            if(enhance){New_setValue('record_last_enhance_petId',petId);break}
        }
    }
    if(!enhance){return}

    while(enhance.length>0){
        let [id,index]=randomOne(enhance)
        count=await autoenhance(id.replaceAll('&amp;','&'),'',count)
        if(!count){console.log('强化任务完成');return}
        enhance.splice(index,1)
    }
    console.log('强化任务剩'+count)
    New_setValue('record_last_enhance_petId','')
    auto_enhanceTask(count)
}

//战灵界面
async function autoWaskSoul(SoulType,unlocked,url,usemax=1000,used=0){
    if(notWoker){
        newWorker({
            task: ['战灵','autoWaskSoul',`"${SoulType}","${unlocked}","${url}",${usemax},${used}`,'战灵:洗练中'],
            fn: ['Task','addIdinnerHTML','setIdinnerHTML','autoWaskSoul'],
            vars: [{SoulType,unlocked,url,usemax,used}],
            text:`
            autoWaskSoul(SoulType,unlocked,url,usemax,used)
            `
        })
        return
    }
    if(used-usemax>=0){
        if(used-usemax>=0){console.log('洗练结束 已使用'+used+'灵力,达到设定值'+usemax)}
        new Task('战灵').del()
        return
    }
    setIdinnerHTML('result','')
    try{
        var soul_target_config=New_getValue('soul_target_config',{})
        var target_item=Object.keys(soul_target_config[SoulType]).join('|')
    }catch{
        setIdinnerHTML('result','未设置属性项');console.log('未设置属性项')
        new Task('战灵').del()
        return
    }
    let all_soul_type=['土灵','火灵','水灵','木灵','金灵','神灵']
    let target_value=soul_target_config[SoulType]
    let petId=url.match(/petId=(\w+)/)[1]
    let positionId=all_soul_type.indexOf(SoulType)+1
    let text=getHttpResponseAsync(newUrl('/soul/waskSoulIndex.asp?sid=','&petId='+petId+'&positionId='+positionId))
    let lockednum=text.match(/属性\d/g).length-unlocked.split('|').length
    let index=all_soul_type.indexOf(SoulType)

    let use=(10*index || 5) * 3**lockednum

    let regex=new RegExp(`属性(${unlocked}).(${target_item})[^<]+`,'g')

    let result=''
    while(used<usemax){
        //console.log(used,usemax)
        let matched=text.match(regex)
        if(matched){
            for(let line of matched){
                let item=line[4]+line[5]
                if(line.match('传奇')){addIdinnerHTML('histroy',line.replace('传奇','<label style="color:red;">传奇<label/>')+'<br>')}
                if(['生命','速度','物攻','法攻','物防','法防'].indexOf(item)<0){result='发生异常-无类型';break}
                let target=target_value[item]
                if(target.品质){
                    if(line.match(target.品质)){result='洗练成功-品质';break}
                }
                let value=line.match(/\+([\d.]+)/)[1]-0
                let target_num=line.match('%')?target.百分比:target.数值
                if(target_num){
                    if(value - target_num >= 0){result='洗练成功-数值';break}
                }
            }
            if(result){break}
        }else if(!text.match('属性1')){result='发生异常-刷新失败';break}

        text=getHttpResponseAsync(url)
        if(text.match('需要灵力不足')){result='需要灵力不足';break}
        else if(text.match('当前洗练包含战灵传奇属性')){
            text=getHttpResponseAsync(url+'&sureFlag=1')
        }
        else if(!text.match('属性1.')){result='发生异常-无属性';break}
        setIdinnerHTML('soul_info','<br>'+text.match(/属性1.*?温馨提示:更换后战灵不会保存/))
        used+=use
        new Task('战灵','autoWaskSoul',`"${SoulType}","${unlocked}","${url}",${usemax},${used}`,`战灵:${used}/${usemax}`).add()
        await sleep(1)
    }

    if(used>=usemax){result='达到灵力上限'+used}
    setIdinnerHTML('result',result)
    console.log(result)
    new Task('战灵',0,0,'战灵:'+result).del()
}

if(href.match('/soul')){

  if(href.match(/index|okSellIndex|addSoulIndex/)){
    showSoulExp()
    if(href.match(/okSellIndex/)){
        if(outerHTML.match(/[2-3]条属性/)){
            replaceHTML(/<a[^>]+>(确定丢弃<\/a>)/,'<span style="color:red;">含有多属性战灵</span>')
        }else if(href.match(/positionId=[4-6]/)){
            replaceHTML(/<a[^>]+>(确定丢弃<\/a>)/,'<a id=sell_all href=javascript:;>$1')
            document.getElementById('sell_all').onclick=()=>{
                setIdinnerHTML('sell_all','正在丢弃')
                let positionId=href.match(/positionId=(\d)/)[1]
                let ids=outerHTML.match(/(?<=;id=)\w+/g)
                for(let id of ids){
                    getHttpResponseAsync(newUrl('/soul/sell.asp?sid=','&id='+id+'&positionId='+positionId))
                }
                location.replace(document.referrer)
            }
        }
    }

  }

  if(href.match('/petSoulInfo.asp')){
    replaceHTML([
        [/soulPositionInfo.asp/g,'waskSoulIndex.asp'],
        [/(一键卸下<\/a>)/,'$1&emsp;显示战灵属性: <a id=show_switch href=javascript:;></a>'],
        [/(positionId=(\d).>卸下<\/a>)/g,'$1 <span class=info id=$2></span>']
    ])
    auto_switch('show_switch','show_soul_info_switch')
    if(New_getValue('show_soul_info_switch')){
        let petId=outerHTML.match(/petId=(\w+)&/)[1]
        async function show(){
            for(let item of document.getElementsByClassName('info')){
                let positionId=item.id
                await getHttpResponse(newUrl('/soul/waskSoulIndex.asp?sid=','&petId='+petId+'&positionId='+positionId)).then(text=>{
                    let shuxing=text.match(/(?<=属性\d.)[^<]+/g).join('|')
                    setIdinnerHTML(positionId,shuxing)
                })
            }
        }
        show()
    }
  }


  if(href.match('/waskSoulIndex')){

    var soul_target_config=New_getValue('soul_target_config',{})
    var all_soul_type=['土灵','火灵','水灵','木灵','金灵','神灵']
    var max_use=New_getValue('Soul_maxuse',1000)
    var soul_type=outerHTML.match(/(.灵)-.族/)[1]
    var all_unlocked=outerHTML.match(/\d&amp;flag=1/g)
    replaceHTML([
        ['>确定洗练</a>',"id=OkWask>确定洗练</a> <a id=autowask href='javascript:;'>一键洗练</a> <span id=result></span><span id=soul_info>"],
        ["不会保存</span><br><br>",`不会保存</span></span><br><a id=config_switch href="javascript:;"></a><div id=soul_config></div><span id=histroy></span><br>`]
    ])
    if(all_unlocked){

        let unlocked=[]
        for(let i=0;i<all_unlocked.length;i++){
            unlocked.push(all_unlocked[i][0])
        }
        unlocked=unlocked.join('|')
        var url=document.getElementById('OkWask').href
        
        sleep(50).then(()=>{
            document.getElementById('autowask').onclick=()=>{if(going_task.战灵){console.log('战灵洗练中');return}autoWaskSoul(soul_type,unlocked,url,max_use)}
        })
    }
    var soul_max={
        土灵:{百分比:25,生命:768, 速度:50, 物攻:502, 法攻:502, 物防:302,法防:302},
        火灵:{百分比:35,生命:1076,速度:70, 物攻:703, 法攻:703, 物防:423,法防:423},
        水灵:{百分比:45,生命:1383,速度:90, 物攻:904, 法攻:904, 物防:544,法防:544},
        木灵:{百分比:55,生命:1691,速度:110,物攻:1105,法攻:1105,物防:665,法防:665},
        金灵:{百分比:65,生命:1998,速度:130,物攻:1306,法攻:1306,物防:786,法防:786},
        神灵:{百分比:75,生命:2306,速度:150,物攻:1507,法攻:1507,物防:907,法防:907}
    }

    soul_config()
  }
}

async function soul_config(){
    try{
        current_config=soul_target_config[soul_type].配置 || '未配置'
    }catch{current_config='未配置'}
    if(!New_getValue('soul_switch')){
        setIdinnerHTML('config_switch','展开配置 - 当前: '+current_config)
        document.getElementById('soul_config').hidden=true
        clickRun('config_switch','New_setValue("soul_switch",1);soul_config()')
        return
    }

    document.getElementById('soul_config').hidden=false
    setIdinnerHTML('config_switch','收起配置')
    clickRun('config_switch','New_setValue("soul_switch",0);soul_config()')
    let soul_config_text='灵力使用上限: <input id="max_use" type="number" min="0" step="100" onkeyup="if(value<0)value=0" style="width:70px" placeholder="默认1000">\
     <a class=config id=配置1 href="javascript:;">配置1</a>&emsp;<a class=config id=配置2 href="javascript:;">配置2</a>&emsp;<a class=config id=配置3 href="javascript:;">配置3</a><br>'
    setIdinnerHTML('soul_config',soul_config_text)
    let soul_item=['生命','速度','物攻','法攻','物防','法防']
    let max_per=soul_max[soul_type].百分比
    for(let n=0;n<soul_item.length;n++){
        let item=soul_item[n]
        let max_value=soul_max[soul_type][item]
        if(item=='生命'){var max_life_value=max_value}
        //<input type="checkbox" class=soul_item_checkbox id="${item}"><label for="${item}">${item}</label> 
        let add_soul_config_text=`
            ${item}-品质:<select class=target id=${item}_品质><option value=''>无</option><option value='传奇'>传奇</option><option value='优秀'>优秀</option></select> 或 数值:
            <input class=target name=${item}_lock id="${item}_百分比" type="number" min="0" max="${max_per}" step="1" onkeyup="if(value<0)value=0;if(value>${max_per})value=${max_per}" style="width:50px" placeholder="0~${max_per}">% 
            <input class=target name=${item}_lock id="${item}_数值" type="number" min="0" max="${max_value}" step="1" onkeyup="if(value<0)value=0;if(value>${max_value})value=${max_value}" style="width:80px" list="${item}_preset" placeholder="0~${max_value}">
            <datalist id=${item}_preset>
                <option>${parseInt(max_value*0.75)}</option>
            </datalist>
            
            <br>`
        addIdinnerHTML('soul_config',add_soul_config_text)
        sleep(30).then(()=>{
            document.getElementById('max_use').oninput=()=>{
                max_use=document.getElementById('max_use').value
                New_setValue('Soul_maxuse',max_use)
            }
        })
    }
    await sleep(20)
    let config={
        配置1: {配置:'配置1',法攻:{品质: '传奇'},物攻:{品质: '传奇'},生命:{品质: '传奇'}},
        配置2: {配置:'配置2',法攻:{品质: '传奇', 百分比: max_per-5},物攻:{品质: '传奇', 百分比: max_per-5},生命:{品质: '传奇', 百分比: max_per-5}},
        配置3: {配置:'配置3',法攻:{品质: '传奇', 百分比: max_per-5},物攻:{品质: '传奇', 百分比: max_per-5},生命:{品质: '传奇', 百分比: max_per-5, 数值: max_life_value-100}}
    }
    if(current_config.match(/\d/)){document.getElementById(current_config).style.color='red'}
    for(let item of document.getElementsByClassName('config')){
        let btn=document.getElementById(item.id)
        btn.onclick=()=>{
            soul_target_config[soul_type]=config[item.id]
            New_setValue('soul_target_config',soul_target_config)
            location.reload()
        }
    }

    let all_target=document.getElementsByClassName('target')
    if(max_use>0){document.getElementById('max_use').value=max_use}else{max_use=undefined}
    for(let target of all_target){
        let item=target.id.split('_')[0]
        let type=target.id.split('_')[1]
        try{
            let value=soul_target_config[soul_type][item][type]
            if(value){document.getElementById(target.id).value=value}
        }catch{}
    
        document.getElementById(target.id).oninput=()=>{
            //let soul_target_config=New_getValue('soul_target_config',{})
            if(!soul_target_config[soul_type]){soul_target_config[soul_type]={}}
            soul_target_config[soul_type].配置='自定义配置'
            if(!soul_target_config[soul_type][item]){soul_target_config[soul_type][item]={}}
            if(target.value==''){
                delete soul_target_config[soul_type][item][type]
                if(Object.keys(soul_target_config[soul_type][item]).length==0){delete soul_target_config[soul_type][item]}
            }else{
                let value=target.value>=0?target.value-0:target.value
                soul_target_config[soul_type][item][type]=value
            }
            New_setValue('soul_target_config',soul_target_config)
            console.log(soul_target_config)
        }
    }
}



async function showSoulExp(){
    //if(!href.match(/soul\/(index|okSellIndex|addSoulIndex)/)){return}
    var allsoul=document.documentElement.outerHTML.match(/<a href=['"][^>]*?\/soul\/bagSoulInfo[^>]*?['"][^<]*?1条属性\)</g)
    //replaceHTML(/\(1条属性\)(.*?)<br>/g,"$1 <span class=info></span><br>")
    replaceHTML(/(>.灵-.族)\(1条属性\)/g," class=info$1")
    if(allsoul){
        for(let i=0;i<allsoul.length;i++){
            let url=allsoul[i].match(/"(.*)"/)[1].replace(/&amp;/g,'&')
            await getHttpResponse(url).then(text=>{
                let attr='('+text.match(/属性1\.([^<]*)/)[1]+')'
                let soul=document.getElementsByClassName('info')[i]
                soul.innerHTML+=attr
                if(attr.match('传奇') && href.match('okSellIndex')){
                    let lock=document.createElement('a')
                    let id=soul.href.match(/&id=(\w+)/)[1]
                    lock.id='lock_'+id
                    lock.className='lock'
                    lock.innerHTML=' 锁定'
                    lock.href='javascript:;'
                    lock.style="color:red;"
                    soul.after(lock)
                }
            })
        }
        let positionId=href.match(/positionId=(\d)/)[1]
        for(let item of document.getElementsByClassName('lock')){
            document.getElementById(item.id).onclick=()=>{
                let id=item.id.split('_')[1]
                getHttpResponseAsync(newUrl('/soul/lockSoul.asp?sid=','&id='+id+'&positionId='+positionId+'&pageNo=1&flag=1'))
                location.reload()
            }
        }
    }
}

//魔魂界面
if(href.match('/devil')){
    replaceHTML([
        ['devil/index.asp?sid='+sid+'">查看','devil/sortDevil.asp?sid='+sid+'">查看'],
        [/(猎魂<\/a>)/,'$1&emsp;<a id=clear href=javascript:;>终止一键升级</a>',!going_task.魔魂]
    ])
    var petId=outerHTML.match(/petId=(\w+)/)
    if(petId){petId=petId[1]}
    if(href.match('devil/petDevilInfo')){
        showDevilExp()
        
        replaceHTML([
            [/(返回<\/a>)/,'$1 <a id=clear href=javascript:;>终止一键升级</a>',!going_task.魔魂],
            [/(魂力:\d+)/,'$1<span id=get_result></span>'],
            [/(;id=(\w+)[^<]+>摄魂<\/a>)/g,'$1 <a class=AutoAbsorbHunt id=$2  href="javascript:;">一键升级</a><span id=info_$2></span>'],
            [/<br><br>/,'<br><a id=add_all href=javascript:;>一键装备</a><br>']
        ])
        let AutoAbsorbHunt_class=document.getElementsByClassName('AutoAbsorbHunt')
        for(item of AutoAbsorbHunt_class){
            let id=item.id
            document.getElementById(id).onclick=()=>{
                AutoAbsorbHunt(id,petId)
            }
        }
        
        document.getElementById('add_all').onclick=()=>{
            let empty=outerHTML.match(/(?<=addDevil[^>]+;index=)\d+/g)
            if(!empty){return}
            let page_text=getHttpResponseAsync(newUrl('/devil/sortDevil.asp?sid='))
            console.log(page_text)
            let ids=page_text.match(/(?<=lockDevil[^>]+;id=)\w+/g)
            if(!ids){return}
            let petId=outerHTML.match(/petId=(\w+)/)[1]
            let id_index=0
            for(let index of empty){
                let text=getHttpResponseAsync(newUrl('/devil/addDevil.asp?sid=','&index='+index+'&petId='+petId+'&id='+ids[id_index++]))
            }
            //location.reload()
        }
    }
    
    if(href.match('/devil/huntIndex')){
        replaceHTML(/(一键猎魂 <\/a>)/,"$1 <a id=autohunt href='javascript:;'>真·一键猎魂</a> 模式:<a id=autohunt_mode href='javascript:;'></a>")
        auto_switch('autohunt_mode','autohunt_mode',1,1,0,'一键','单点')
        replaceHTML(/(铜钱:)/,'<span id=result></span>$1')
        let mode=0
        sleep(30).then(()=>{
            if(document.getElementById('autohunt_mode').innerText=='一键'){
                mode=1
            }
            clickRun('autohunt','autohunt('+mode+')')
        })
        
        
    }

    if(href.match('/devil/petAbsorbIndex')){
        replaceHTML([
            [/>(一键噬魂<\/a>)/,"id=Absorb>$1 <a id=autoAbsorb href='javascript:;'>真·一键噬魂</a><span id=info></span>"],
            [/(返回前页<\/a>)/,`$1 <a href="${newUrl('/devil/huntIndex.asp?sid=')}">前往猎魂</a>`]
        ])
        clickRun('autoAbsorb','autoAbsorb()')
    }
    let clear=document.getElementById('clear')
    clear && (clear.onclick=()=>{update_goingtask('del','魔魂');location.reload()})
}

async function showDevilExp(){
    if(!href.match('devil/petDevilInfo')){return}
    replaceHTML(/([^s]id=(\w+).*?lv\.\d+.*?)</g,"$1 <span id=exp_$2 class=exp></span><")
    var alldevil=outerHTML.match(/\d+\.<a href=".*?\/devil\/devilDetail.*?"/g)
    if(alldevil){
        for(let i=0;i<alldevil.length;i++){
            let url=alldevil[i].match(/"(.*)"/)[1].replace(/&amp;/g,'&')
            await getHttpResponse(url).then(text=>{
                document.getElementsByClassName('exp')[i].innerHTML='('+text.match(/(经验:[^<]+)/)[1]+')'
            })
        }
    }
}

async function autoAbsorb(id,force=false){
    if(!id){
        var url=document.getElementById('Absorb').href
        var nowExp=parseInt(outerHTML.match(/经验:(\d+)/)[1])
        var maxExp=parseInt(outerHTML.match(/经验:\d+\/(\d+)/)[1])
        var infoId='info'
    }else{
        var url=newUrl('/devil/petOkabsorbIndex.asp?sid=')+'&id='+id+'&petId='+petId
        
        var nowExp=Exp.match(/(\d+)\//)[1]-0
        var maxExp=Exp.match(/\/(\d+)/)[1]-0
        var infoId='info_'+id
    }
    
    //let needExp=maxExp-nowExp
    let nowMaxExp=maxExp
    let result=''
    while(nowExp<maxExp){
        let text=getHttpResponseAsync(url)
        if(text.match('没有合适魔魂可选择')){break}
        let highmatch=text.split('等级')[1].match(/(天魂|龙魂|仙魂)/)
        if(highmatch){result='被吞噬魔魂含有'+highmatch[1];break}
        if(text.match(/\)lv\.[1]?[05-9]/)){result='被吞噬魔魂含有lv5以上的';break}

        let getExp=text.match(/可获得经验:(\d+)/)
        if(!getExp){result='异常-无经验';break}
        getExp=getExp[1]-0
        if(nowExp+getExp-maxExp>0){
            if(text.match('等级:lv.9')){
                result='即将Lv10'
                break
            }else if(nowExp+getExp-maxExp>600){
                if(!force){result='经验即将溢出';break}
            }
        }
        if(!okurl){var okurl=fenqu+text.match(/(\/devil\/petOkabsorb.*?)'/)[1].replace(/&amp;/g,'&')}
        getHttpResponseAsync(okurl)
        if(!id){
            replaceHTML('经验:'+nowExp,'经验:'+(nowExp+=getExp))
        }else{
            nowExp+=getExp
            if(nowExp>=maxExp){nowMaxExp=2*maxExp}
            Exp='(经验:'+nowExp+'/'+nowMaxExp+')'
            setIdinnerHTML('exp_'+id,Exp)
            if(isWoker){new Task('魔魂','AutoAbsorbHunt',`"${id}","${petId}","${Exp}"`,'魔魂:'+Exp).add()}
            if(nowExp>=maxExp){result='完成';break}
        }
        await sleep(10)
    }
    if(!id){location.reload()}
    setIdinnerHTML(infoId,result)
    return result
}

async function autohunt(mode=0,no_replace=0){
    let type=href.match('type=1')?1:0
    let url=fenqu+'/devil/okhunt.asp?sid='+sid+'&type='+type
    let text=''
    let max_count=1000
    while(max_count-- > 0){
        if(mode==0){
            if(!text){text=getHttpResponseAsync(url)}
            try{
                let allid=text.match(/(?<=;id=)\d/g)
                url=fenqu+'/devil/hunt.asp?sid='+sid+'&id='+allid[allid.length-1]+'&type='+type
            }catch{
                console.log(text)
                url=fenqu+'/devil/okhunt.asp?sid='+sid+'&type='+type
                text=''
                continue
            }
        }
        text=getHttpResponseAsync(url)
        if(text.match('太快')){
            console.log('太快了')
            text=getHttpResponseAsync(url)
        }else if(mode==1 && text.match('开通VIP才能一键猎魂')){
            mode=0
            continue
        }else if(text.match('当前猎魂师未激活')){
            text=''
            continue
        }
        if(text.match('空间不足')){
            return
        }else if(text.match('物品不足')){
            addIdinnerHTML('result','猎魂结束!<br>',1)
            return '铜钱不足'
        }else{
            if(!no_replace){
                addIdinnerHTML('result',text.match(/((第1次猎魂,)?获得:.*?)<br\/><br\/>/)[1].replace(/(获得:[^\d]+\((天|龙|仙)魂\))/,'<label style="color:red;">$1</label>')+'<br>',1)
            }
            let get=text.match(/获得:([^<]+(天|龙|仙)魂\))/)
            if(get){console.log('猎到',get[1]);return get[1]}
            await sleep(25)
        }
    }
    return '超过上限'
}

async function AutoAbsorbHunt(id,petId,ExpText){
    if(notWoker){
        let force=false
        let info=document.getElementById('info_'+id)
        if(info && info.innerHTML=='经验即将溢出'){force=true}
        Exp=ExpText?ExpText:document.getElementById('exp_'+id).innerHTML
        newWorker({
            task: ['魔魂','AutoAbsorbHunt',`"${id}","${petId}","${Exp}"`,'魔魂:猎魂中'],
            fn: ['Task','getHttpResponseAsync','addIdinnerHTML','setIdinnerHTML','autoAbsorb','autohunt','AutoAbsorbHunt'],
            vars: [{id,petId,Exp,force}],
            text:`
            AutoAbsorbHunt(id,petId,Exp)
            `
        })
        return
    }
    let result=''
    let count=100
    let get=0
    while(!result && count>0){
        setIdinnerHTML('info_'+id,'开始噬魂')
        result=await autoAbsorb(id,force)
        force=false
        if(!result){console.log('开始猎魂'+Exp);setIdinnerHTML('info_'+id,'正在猎魂');get=await autohunt(1,1)}else{break}
        if(get){
            if(get=='铜钱不足'){
                result='铜钱不足'
                break
            }else if(get.match(/天|龙|仙/)){
                addIdinnerHTML('get_result',' '+get)
                let text=getHttpResponseAsync(newUrl('/devil/sortDevil.asp?sid='))
                for(let i=1;i<=20;i++){
                    if(i!=1){text=getHttpResponseAsync(newUrl('/devil/index.asp?sid=')+'&step=-1&pageNo='+i)}
                    let toLock=text.match(/(天|龙|仙)魂[^'"]+([^<]+)['"]>加锁/g)
                    if(toLock){
                        for(let devil of toLock){
                            let id=devil.match(/;id=([^'"]+)/)[1].replaceAll('&amp;','&')
                            getHttpResponseAsync(newUrl('/devil/lockDevil.asp?sid=','&id='+id))
                        }
                    }
                    if(text.match('\\(地魂\\)lv.1')){break}
                }
            }else{
                addIdinnerHTML('get_result',get)
                break
            }
        }
        count--
    }
    console.log(result)
    setIdinnerHTML('info_'+id,result)
    new Task('魔魂',0,0,'魔魂:'+result).del()
}

async function grabPet(want_pets,alltext){
    var thePet=alltext.match(/br[/]?>(.{3})&nbsp/)[1]
    var ball=want_pets[thePet]
    if(ball>0){
        let url=newUrl('/nmap/grabPet.asp?sid=','&ballId=2000')
        let text=getHttpResponseAsync(url+(ball+5))
        for(let i=0;i<2;i++){
            if(text.match("数量不足")){
                if(ball==1){await buyball(10,1)}else{ball=1}
                text=getHttpResponseAsync(url+6)                
            }else{break}
        }
        grabed=text.match(/成功捕捉到了(.{3})/)
        if(grabed){
            addIdinnerHTML('nmap_info','使用'+(ball==1?"普通球":"强力球")+"捕捉到了"+grabed[1]+'<br>',1)
        }
    }
}

async function Worker_autonmap(maptype=null,remain_mode=false){
    let fn_worker=['myInfo','userInfo','Task','addIdinnerHTML','setIdinnerHTML','replaceHTML','HuoLiCao','grabPet','Worker_autonmap']
    if(notWoker){    
        newWorker({
            fn: fn_worker,
            vars: ['href',{maptype}],
            text:`
            Worker_autonmap(maptype)
            `
        })
        return
    }
    let all_maps=[].concat.apply([],Object.values(city_map))
    let want_pets=New_getValue('BallToGrabPet',{})
    let open_all_box=New_getValue('nmap_open_allbox',0)
    let nmap_openbox_use=New_getValue('nmap_openbox_use','优先骰子')
    if(!maptype){
        maptype=href.match(/(\/nmap|\/copy)\/(node|copy)Index/)
        if(maptype){
            if(notWoker){var alltext=outerHTML}
            maptype=maptype[1]
        }else{var no_replace=1;maptype='/nmap'}
    }

    let index_url=fenqu+maptype+'/nodeIndex.asp?sid='+sid
    if(maptype=='/copy'){index_url=fenqu+'/copy/copyIndex.asp?sid='+sid}
    if(isWoker || !alltext){alltext=getHttpResponseAsync(index_url)}

    let url_array=[
        fenqu+maptype+'/step.asp?sid='+sid,
        fenqu+maptype+'/pk.asp?sid='+sid,
        fenqu+maptype+'/pkBoss.asp?sid='+sid,
        fenqu+'/nmap/event1.asp?sid='+sid+'&type=1'
    ]
    let maxtry=500
    while(maxtry--){
        if(typeof(nodeId)!='number' && typeof(nmap_name)!='string'){
            let nmap_name=alltext.match(/副本:([^(]+)\(/)[1]
            if(nmap_name){nodeId=all_maps.indexOf(nmap_name)+1}
        }
        let event=alltext.match(/(落败|骰子不足|>浸泡泉<|重置次数已达到最大值|当前不在副本|页面已不存在)/)
        if(event){
            console.log(alltext)
            event=event[1]
            let remain_dice=alltext.match(/骰子:\d+个/)
            if(remain_dice){remain_dice=remain_dice[0]}
            if(event.match('>浸泡泉<')){
                let HuoLiQuan_nodes=New_getValue(['record','HuoLiQuan_nodes'],{})
                HuoLiQuan_nodes['node'+nodeId]=remain_dice
                New_setValue(['record','HuoLiQuan_nodes'],HuoLiQuan_nodes)
            }
            return event+' '+remain_dice
        }

        var url=url_array[0]
        if(alltext.match('不是对应格子内容类型')){url=url_array[maxtry%url_array.length]}
        else if(alltext.match(maptype+'/pk.asp')){url=url_array[1]}
        else if(alltext.match('/nmap/grabPetIndex')){await grabPet(want_pets,alltext)}
        else if(alltext.match(/\/pkBoss.asp|>挑战boss</)){url=url_array[2]}
        else if(alltext.match('还有npc未通过')){url=url_array[1]}
        else if(alltext.match(/土著|猿人来袭/)){
            url=url_array[3]
        }
        alltext=getHttpResponseAsync(url)

        if(alltext.match(/骰子不足|骰子数量不足/)){
            let text=''
            if(maptype=='/nmap'){
                let autonmaplist=New_getValue('autonmaplist',{})
                if(autonmaplist['node'+nodeId] && autonmaplist['node'+nodeId].remain==0){return '剩余为0'}
                if(open_all_box){return}else{
                    text=getHttpResponseAsync(newUrl('/nmap/addDice2Node.asp?sid=')+'&nodeId='+nodeId)
                }
            }else{
                console.log('使用骰子包')
                let result=getHttpResponseAsync(newUrl('/nmap/addDice.asp?sid=')+'&pageType=1')
                console.log(result)
                if(!result.match('使用骰子包成功')){new Task('福利副本',0,0,'福利副本: 骰子已用完').del();return}
            }
            if(text.match('没有骰子可用')){
                if(remain_mode){
                    new Task('副本',0,0,'副本: 骰子已用完').del()
                    return '骰子盒为空'
                }
                return '没有骰子可用'
            }else{alltext=getHttpResponseAsync(url)}
        }
        var reach=alltext.match(/掷出\d点，来到了第\d+层|猜拳.*?被送到第\d+层/)
        if(reach && !no_replace){
            addIdinnerHTML('nmap_info',reach+"<br>",1)
        }
        let is_Boss=url.match('pkBoss') || alltext.match('本层:最后BOSS')
        if(alltext.match("/openBox") && (open_all_box != 0 || is_Boss || maptype=='/copy')){
            let boxurl=fenqu+maptype+'/openBox.asp?sid='+sid+'&type='
            if((nmap_openbox_use=='优先骰子' && is_Boss) || maptype=='/copy'){var opentype=1}else{var opentype=0}
            var opened_text=getHttpResponseAsync(boxurl+opentype)
            if(opened_text.match('不足')){
                if(!open_all_box || is_Boss){
                    //console.log(text)
                    await HuoLiCao(15-myInfo.Huoli())
                    opened_text=getHttpResponseAsync(boxurl+0)
                }else{opened_text='';return}
            }
            if(!no_replace && opened_text){
                try{
                    addIdinnerHTML('nmap_info',opened_text.match(/(消耗.*?)<br\/><br\/>/)[1].replace(/<br\/>/g,'，')+'<br>',1)
                }catch{console.log(opened_text)}
            }
        }
        if(maptype=='/nmap' && (url.match('pkBoss') || alltext.match(/resetNodeIndex|当前最后一格了/))){
            let reset_text=getHttpResponseAsync(fenqu+'/nmap/resetNodeIndex.asp?sid='+sid)
            let nodeId=reset_text.match(/nodeId=(\d+)/)[1]
            alltext=getHttpResponseAsync(fenqu+'/nmap/resetNode.asp?sid='+sid+'&nodeId='+nodeId)
            let autonmaplist=New_getValue('autonmaplist',{})
            if(typeof(autonmaplist['node'+nodeId])!='object'){autonmaplist['node'+nodeId]={}}
            if(alltext.match('重置次数已达到最大值')){
                autonmaplist['node'+nodeId].remain=0
            }else{
                if(autonmaplist['node'+nodeId].remain==undefined){
                    if(autonmaplist['node'+nodeId].count==undefined){autonmaplist['node'+nodeId].count=1}
                    autonmaplist['node'+nodeId].remain=autonmaplist['node'+nodeId].count-1
                }else{
                    autonmaplist['node'+nodeId].remain--
                }
            }
            New_setValue('autonmaplist',autonmaplist)
        }else if(maptype=='/copy' && alltext.match('当前最后一格了')){
            break
        }
        await sleep(30)
        if(maxtry<300){console.log(alltext)}
    }
    if(going_task.福利副本){new Task('福利副本',0,0,'结束').del()}
}

async function Worker_autonmap_all(nmap_seq=[],remain_mode=false){
    if(notWoker){
        newWorker({
            task: ['副本','Worker_autonmap_all',JSON.stringify(nmap_seq)+','+JSON.stringify(remain_mode),'副本:'],
            fn: ['Worker_autonmap','Worker_autonmap_all'],
            vars: ['href',{nmap_seq,remain_mode}],
            text:`
            Worker_autonmap_all(nmap_seq,remain_mode)
            `
        })
        return
    }

    if(nmap_seq.length==0){
        let moving_time=await get_moving_time()
        if(moving_time++){
            console.log(`副本: 移动城市中，等待${moving_time}秒`)
            await sleep(moving_time*1000)
        }
    }
    let all_maps=[].concat.apply([],Object.values(city_map))
    let autonmaplist=New_getValue('autonmaplist',{})
    let mylocation=myInfo.City()
    if(!nmap_seq || !nmap_seq.length){ 
        var nmap_seq=[];let before_seq=[];let after_seq=[]
        let mylv=myInfo.Lv()
        var maxcityId=parseInt(mylv/10)+1
        if(mylocation==1){nmap_seq.push(1)}
        nmap_seq.push(mylocation*2,mylocation*2+1)
        for(let i=mylocation-1;i>=1;i--){if(i==1){before_seq.push(1)};before_seq.push(i*2,i*2+1)}
        for(let i=parseInt(mylocation)+1;i<=maxcityId;i++){after_seq.push(i*2,i*2+1)}
        let to_lower_city_first=1
        let autonmap_to_city=New_getValue('autonmap_to_city',0)
        if(autonmap_to_city<0){
            if(maxcityId-mylocation<mylocation-2){to_lower_city_first=0}
        }else{
            if(mylocation<=maxcityId){to_lower_city_first=1}
        }
        if(to_lower_city_first){nmap_seq=[...nmap_seq,...before_seq,...after_seq]}else{nmap_seq=[...nmap_seq,...after_seq,...before_seq]}
        if(autonmap_to_city>0){
            nmap_seq.push(autonmap_to_city*2+1)
        }else if(autonmap_to_city==0){
            nmap_seq.push(maxcityId*2+1)
        }
        for(let i=0;i<nmap_seq.length;i++){
            let node='node'+nmap_seq[i]
            if(!autonmaplist[node] || autonmaplist[node].remain<=0 || !autonmaplist[node].state){nmap_seq.splice(i--,1)}
        }
    }

    while(nmap_seq.length > 0){
        nodeId=nmap_seq[0]
        var city=parseInt(nodeId/2)
        if(city==0){city=1}
        //let nmap_index=city==1?nodeId%2+1:nodeId%2
        var nmap_name=all_maps[nodeId-1]
        new Task('副本','Worker_autonmap_all',JSON.stringify(nmap_seq)+','+JSON.stringify(remain_mode),'副本:'+nmap_name).add()
        if(city==mylocation){
            console.log('开始挑战副本'+nodeId)
            url=fenqu+'/nmap/enterNode.asp?sid='+sid+'&nodeId='+nodeId
            let entry_text=getHttpResponseAsync(url)
            if(entry_text.match('正在移动城市')){await movetown(city)}
            let event=await Worker_autonmap('/nmap',remain_mode)
            console.log(event)
            if(event=='骰子盒为空'){
                console.log('骰子盒为空，停止剩余副本')
                break
            }else{
                let autonmaplist=New_getValue('autonmaplist',{})
                if(!autonmaplist['node'+nodeId]){autonmaplist['node'+nodeId]={}}
                autonmaplist['node'+nodeId].event=event
                if(event && event.match('>浸泡泉<')){
                    let HuoLiQuan_nodes=New_getValue(['record','HuoLiQuan_nodes'],{})
                    HuoLiQuan_nodes['node'+nodeId]=event.split(' ')[1]
                    New_setValue(['record','HuoLiQuan_nodes'],HuoLiQuan_nodes)
                }
                New_setValue('autonmaplist',autonmaplist)
            }
            nmap_seq.splice(0,1)
        }else{
            console.log('移动到下一个城市')
            //new Task('移动').del()
            await movetown(city)
            await sleep(1000)
            mylocation=city
        }
    }
    new Task('副本',0,0,'副本: 今日副本扫荡完毕').del()
    console.log('今日副本扫荡完毕')
}


//autonmap_all()
//地图、副本页面
if (href.match(/\/nmap|\/copy/)){
    replaceHTML(/(本层.*?)<br>/,"$1 <a id=automap href='javascript:;'>自动副本</a><br>")
    replaceHTML(/(本层\|[^<]+<br>)/,'$1 <span id=nmap_info></span>')
    //let nodeId=outerHTML.match(/nodeId=(\d+)/)[1]
    clickRun('automap',`Worker_autonmap('${href.match(/(\/nmap|\/copy)/)[1]}')`)
    if (href.match('/nmap/index')){
        replaceHTML([
            ['[临近城市]','[临近城市] <span id=move_dest></span>'],
            [/moveTownIndex/g,'moveTown'],
            [/>传送/g,' class=shifttown>传送']
        ])
        let mylv=myInfo.Lv()
        let match_count=parseInt(mylv/10)
        //let current=outerHTML.match(/(\d+)\)&nbsp;你在这里/)[1]
        let all_shifttown=document.getElementsByClassName('shifttown')
        for(let i=0;i<match_count;i++){
            let id=all_shifttown[i].href.match(/(\d+)$/)[1]
            let matchstart=(id-1)*10+9
            let regex=new RegExp('~'+matchstart+'\\)[^\\)]*?&nbsp;<')
            replaceHTML(regex,'~'+matchstart+')<a id=movetown'+id+' href="javascript:;">移动</a> <')
            clickRun('movetown'+id,`movetown(${id},1)`)
        }
    }
}


//闯塔页面
if (href.match('/pagoda/index')){
    let id=href.match(/&id=(\d)/)

    if(id){id=id[1]}
    if(!id || id ==1 ){
        replaceHTML('">镇妖','&pvpType=1">镇妖')
    }else{
        replaceHTML("返回游戏首页</a>","返回游戏首页</a><br><span id='result'></span>",0,1)
        replaceHTML(/(每次消耗:15活力)/,"$1 <a id=autopagoda"+id+" href='javascript:;'>自动闯塔</a>  <a id=autopagoda_all href='javascript:;'>自动闯所有塔</a>")
        clickRun('autopagoda'+id,'Worker_autopagoda_all('+id+')')
        clickRun('autopagoda_all','Worker_autopagoda_all()')
    }
}

async function Worker_autopagoda(id,consume_mode){
    await sleep((id-2)*30+10)
    var alltext=getHttpResponseAsync(fenqu+'/pagoda/index.asp?sid='+sid+'&id='+id)
    let pagoda_name=[,,'龙纹塔','战灵塔','天空塔']
    let name=pagoda_name[id]
    if(alltext.match('级开放<br')){
        New_setValue(['record',`${name}完成`],true)
        new Task(name,0,0,'未开放').del()
        return
    }

    let no_replace=1
    if(href.match('/pagoda/index.asp')){no_replace=0}
    
    let current_floor=alltext.match(/第(\d+)层<\/a>(未挑战)/)
    if(current_floor){current_floor=current_floor[1]}else{current_floor=1}
    let max_time=alltext.match(/今日闯塔:(\d)\/(\d)/)
    let remain=max_time[2] - max_time[1]

    var url=fenqu+'/pagoda/oncepk.asp?sid='+sid+'&id='+id
    let n=300
    let over=0
    while(n--){
        //await sleep(id*10)
        alltext=getHttpResponseAsync(url)
        //console.log(alltext)
        if(alltext.match(/恭喜你获得:(.*?)</)){
            let result=name+`-第${current_floor}层: `+alltext.match(/恭喜你获得:(.*?)</)[1]
            if(!no_replace){setIdinnerHTML('result',result)}
            console.log(result)
            current_floor++
        }else if(alltext.match('/pagoda/newbeginpk') || alltext.match('当前不是闯塔状态')){

            if(remain<=0){
                New_setValue(['record',`${name}完成`],true)
                break
            }
            let text=getHttpResponseAsync(fenqu+'/pagoda/newbeginpk.asp?sid='+sid+'&id='+id)
            if(text.match("今天挑战次数达到上限")){
                New_setValue(['record',`${name}完成`],true)
                break
            }else if(text.match('活力不足')){
                if(consume_mode){break}
                if(await HuoLiCao(15-myInfo.Huoli())){continue}else{console.log('活力草不足');break}
            }else{current_floor=1;remain--}
        }else if(alltext.match('背包')){
            console.log('闯塔：压缩背包')
            await auto_upgrade_equip()
            await compress_bag()
            if(over++ > 5){break}
        }else if(alltext.match('等级不足')){
            New_setValue(['record',`${name}完成`],true)
            new Task(name,0,0,'等级不足').del()
            return
        }
        await sleep(40)
    }
    new Task(name,0,0,'结束').del()
    if(id==2){await auto_upgrade_equip()}
}

async function Worker_autopagoda_all(id,consume_mode=false){
    let fn_worker=['myInfo','userInfo','Task','replaceHTML','HuoLiCao','compress_bag','auto_upgrade_equip','setIdinnerHTML','Worker_autopagoda']

    let pagoda=getHttpResponseAsync(newUrl('/pagoda/index.asp?sid=')).match(/今日闯塔:(\d)\/(\d)/)
    if(pagoda[1]!=pagoda[2]){
        let text=getHttpResponseAsync(newUrl('/pagoda/autopk.asp?sid=','&id=1'))
        if(text.match('不足') && !consume_mode){
            await HuoLiCao(50-myInfo.Huoli())
            getHttpResponseAsync(newUrl('/pagoda/autopk.asp?sid=','&id=1'))
        }
    }else{
        New_setValue(['record','通天塔完成'],true)
    }
    if(!id){var pagoda_ids=[2,3,4]}else{var pagoda_ids=[id]}
    let pagoda_name=[,,'龙纹塔','战灵塔','天空塔']
    
    let tz_array= New_getValue('tz_tosell',[])

    for(let id of pagoda_ids){
        let name=pagoda_name[id]
        newWorker({
            task: [name,'Worker_autopagoda_all',id,name],
            fn: fn_worker,
            vars: [{id,tz_array,consume_mode}],
            text:`
            Worker_autopagoda(id,consume_mode)
            `
        })
    }
    if(New_getValue(['record','通天塔完成']) && New_getValue(['record','龙纹塔完成']) && New_getValue(['record','战灵塔完成']) && New_getValue(['record','天空塔完成'])){
        set_dailyConsume('闯塔',{state: 1})
    }
}

async function autosport(count=0,target=0,consume_mode=false){
    let fn_worker=['userInfo','myInfo','Task','replaceHTML','transfer_time','compress_bag','HuoLiCao','set_dailyConsume','autosport']
    if(myInfo.Lv()<20){New_setValue('next_dailySport',getdatetime());new Task('竞技').del();return}
    if(notWoker){
        if((count<=0 && !target) || count==target){new Task('竞技').del();return}
        let wait_time=timeDelta(New_getValue('next_dailySport'))
        if(wait_time>3e5){new Task('竞技').del();return}else{
            let sec=Math.floor(wait_time/1e3)
            new Task('竞技',0,0,`竞技:${count}/${target}(等待${sec}秒)`).onlyShow()
            console.log('竞技: 等待'+sec+'秒');await sleep(wait_time)
        }
        newWorker({
            task: ['竞技','autosport',count+','+target+','+consume_mode,'竞技:'+target],
            fn: fn_worker,
            vars: [{count,target,consume_mode}],
            text:`
            autosport(count,target,consume_mode).then(()=>{new Task('竞技').del()})
            `
        })
        return
    }

    count-=0
    let myzhanli=myInfo.Zhanli()
    let myPetNum=myInfo.PetNum()
    let myPetzhanli=myzhanli/myPetNum

    let indexUrl=newUrl('/sport/index.asp?sid=')
    let alltext=''
    let first=true
    let max_try=target>0?2*target:1000
    let current_win=0
    
    while(max_try-- > 0){
        if(!alltext){await sleep(50);alltext=getHttpResponseAsync(indexUrl)}
        current_win=alltext.match(/>当前连胜:(\d+)&/)
        if(!current_win){alltext='';continue}
        current_win=current_win[1]-0

        if(first){
            var today_max_win=alltext.match(/>今日最高连胜:(\d+)/)[1]-0
            var origin_current=current_win
            if(consume_mode && today_max_win-current_win>20){break}
            if(target==0){target=current_win+count}else if(today_max_win-target>=0){return}
            first=false
        }else{setIdinnerHTML('当前',current_win)}

        if(current_win<origin_current){
            new Task('竞技',0,0,'挑战失败').del();New_setValue('record_sport_fail_userId',userId);console.log(userId,alltext);break
        }
        new Task('竞技','autosport',current_win+','+target+','+consume_mode,'竞技:'+current_win+'/'+target).add()
        
        if(current_win>today_max_win){setIdinnerHTML('今日最高',current_win)}
        if([5,15,25,50,150,250].indexOf(current_win)>-1){
            let takeAward=alltext.match(/(?<=count=)\d+(?=.>领取<)/g) || []
            for(let count of takeAward){
                let text=getHttpResponseAsync(fenqu+'/sport/takeWinCountAward.asp?sid='+sid+'&count='+count)
                if(text.match('不足')){await compress_bag()}
            }
        }
        if(current_win==target){break}
        
        let huoli=alltext.match(/当前活力:(\d+)\/(\d+)/)
        if(huoli[1]-15<0){
            if(consume_mode){return}
            if(!await HuoLiCao(huoli[2]-huoli[1])){console.log('竞技:活力草不足');return}
        }
        let pkId=alltext.match(/(?<=otherId=)\d+/g)
    for(let n=0;n<pkId.length;n++){
        let userId=pkId[n]
        let pkuser=new userInfo(userId).info()
        let pkzhanli=pkuser.match(/>战力:(\d+)/)[1]-0
        let pkPetNum=1
        if(pkzhanli!=0){
            pkPetNum=pkuser.match(/petInfo/g).length
            let pkLv=pkuser.match(/Lv.(\d+)/)[1]
            let pkPetLv=pkuser.match(/\d+(?=级\))/g).filter(lv=>lv<pkLv-5)
            if(pkPetLv.length){pkPetNum=1;console.log('pkPetLv',userId,pkLv,pkPetLv)}
        }
        let pkPetzhanli=pkzhanli/pkPetNum
        //console.log(myPetzhanli,pkPetzhanli)
        let factor=myPetNum>pkPetNum?1:myPetNum<pkPetNum?0.6:0.8
        if(myzhanli<1200){factor*=0.9}else if(myPetNum>4){factor*=1.09}
        if(myPetNum==5 && timenow>'18:00'){consume_mode=false}
        if(myPetzhanli*factor-pkPetzhanli>0){
            console.log((1+current_win)+'/'+target+': '+myzhanli+' vs '+pkzhanli)
            let pkurl=fenqu+'/sport/pk.asp?sid='+sid+'&otherId='+userId
            await sleep(40)
            alltext=getHttpResponseAsync(pkurl)

            if(alltext.match(/挑战过快|请求过快|请稍后访问/)){
                console.log('挑战过快')
                alltext=''
                break
                //await sleep(50)
                //alltext=getHttpResponseAsync(pkurl)
            }
            if(alltext.match('>活力不足<')){
                console.log('活力不足')
                alltext=''
                break
            }
            if(alltext.match('对方不在对手列表中')){
                console.log('对方不在对手列表中');alltext=''
                break
            }
            break
        }
        if(n==pkId.length-1 && alltext){
            let time_text=alltext.match(/自动刷新倒数:((\d分)?(\d+秒)?)/)
            let time=transfer_time(time_text[1])
            new Task('竞技',0,0,`竞技:${current_win}/${target}(等待${time}秒)`).onlyShow()
            console.log('竞技: 等待'+time+'秒')
            New_setValue('next_dailySport',getdatetime(0,0,time))
            await sleep(time*1000)
            alltext=''
        }
    }
    }
    if(Activity.神像祈福 && current_win==100){command('auto_statue(1)')}
    consume_mode && set_dailyConsume('竞技',{state:1})
    new Task('竞技',0,0,'挑战结束').del()
}

//竞技页面
if (href.match('/sport/index')){
    showUserInfo('战力',[0])
    let target_win=`<input id="autosport_target" type="text" style="width:80px" list="typelist" placeholder="目标连胜">
    <datalist id="typelist">
    　　<option>100</option>
    　　<option>150</option>
        <option>188</option>
    </datalist>
    <button id=target_win>开始</button> <button id=end_win>终止</button>`
    let maxcount=parseInt(outerHTML.match(/当前活力:(\d+)\//)[1]/15)
    replaceHTML([
        [/(当前|今日最高)连胜:(\d+)/g,'$1连胜:<span id=$1>$2</span>'],
        [/(排名:(\d+|无))/,'$1 '+target_win],
        [/((\d+)连胜[^<]*?未满足\))<br>/g,"$1 <a class=autosport_class id=$2_win href='javascript:;'>挑战$2连胜</a><br>"],
        [/(当前活力:(\d+)\/\d+)/,"$1 <a id=maxwin href='javascript:;'>挑战"+maxcount+"次</a>"]
    ])
    let current=document.getElementById('当前').innerText
    let all_class=document.getElementsByClassName('autosport_class')
    for(let i=0;i<all_class.length;i++){
        let num=all_class[i].id.split('_')[0]
        clickRun(num+'_win','New_setValue("next_dailySport","0");autosport('+(num-current)+')')
    }
    
    clickRun('maxwin','New_setValue("next_dailySport","0");autosport('+maxcount+')')
    clickRun('target_win','New_setValue("next_dailySport","0");autosport(0,document.getElementById("autosport_target").value)')
    clickRun('end_win',"new Task('竞技').del();location.reload()")
}

async function autostage(normal_count=0,gold_count=null){
    if(notWoker){
        newWorker({
            task: ['擂台','autostage',normal_count+','+gold_count,'擂台:'+normal_count+','+gold_count],
            fn: ['userInfo','myInfo','Task','getHttpResponseAsync','postHttpResponseAsync','buyball','autostage'],
            vars: [{normal_count,gold_count}],
            text:`
            autostage(normal_count,gold_count)
            `
        })
        return
    }
    function getStagelevel(){
        let level=parseInt(myInfo.Lv()/10)-1
        if(level<=0){level=1}else if(level>7){level=7}
        New_setValue('record_stage_level',level)
        return level
    }
    let next_stage=New_getValue('next_stage')
    var level=New_getValue('record_stage_level')
    if(!level){level=getStagelevel()}

    if(gold_count==null){
        var alltext=getHttpResponseAsync(fenqu+'/stage/gotomine.asp?sid='+sid)
        var normal_count_all=parseInt(alltext.match(/今日还可以挑战(\d+)次/)[1])
        gold_count=normal_count>normal_count_all?normal_count-normal_count_all:0
        normal_count=normal_count>normal_count_all?normal_count_all:normal_count
    }
    var counts=[normal_count,gold_count]
    new Task('擂台','autostage',counts.join(','),'擂台: 普通-'+counts[0]+',黄金-'+counts[1]).add()
    if(datetime<next_stage){
        let waitsec=next_stage.split(':')[2]-datetime.split(':')[2]+1
        if(waitsec<0){waitsec+=60}else if(waitsec>10){waitsec=10}
        console.log('擂台等待'+waitsec+'秒')
        await sleep(waitsec*1000)
    }
    let stage_type=[]
    if(counts[0]>0){stage_type.push(1)}
    if(counts[1]>0){stage_type.push(2)}
    while(Math.max(...counts)>0){
        let grabed=0
        for(type of stage_type){
            //console.log(type+' '+counts[type-1])
            if(counts[type-1]<=0){stage_type.splice(type-1,1);continue}
            let state=''
            let url=fenqu+'/stage/pk.asp?sid='+sid+'&type='+type+'&subtype=1&level='+level
            let text=getHttpResponseAsync(url)
            if(text.match("需要物品不足")){
                if(type==1){
                    state='购买普通球'
                    buyball(normal_count,1)
                    text=getHttpResponseAsync(url)
                }else{counts[type-1]=0}
            }else if(text.match('等级不足')){
                level=getStagelevel()
            }else if(text.match('当前擂台位置没人')){
                let url_grab=fenqu+'/stage/grab.asp?sid='+sid+'&type='+type+'&subType=1&level='+level
                state='占领擂台'
                getHttpResponseAsync(url_grab)
                counts[type-1]--
            }else if(text.match('间隔时间不能少于10秒')){
                state='擂台挑战冷却时间中'
            }else if(text.match(/挑战[^<]*?(成功|失败)/)){
                counts[type-1]--
                if(stage_type.length==1 && counts[type-1]==0){console.log('擂台挑战结束');new Task('擂台').del();return}
                new Task('擂台','autostage',counts.join(','),'擂台: 普通-'+counts[0]+',黄金-'+counts[1]).add()
                console.log('普通:'+counts[0]+',黄金:'+counts[1])
                New_setValue('next_stage',getdatetime(0,0,10))
            }else if(text.match('当前已在守擂')){
                state='正占领擂台'
                grabed++
            }else if(text.match('不在开放时间')){
                console.log('不在开放时间')
                new Task('擂台').del()
                return
            }else{
                console.log('异常\n',text)
                counts[type-1]=0
                new Task('擂台','autostage',counts.join(','),'擂台: 普通-'+counts[0]+',黄金-'+counts[1]).add()
            }
            if(state){console.log(type==1?'普通擂台:':'黄金擂台:',state)}
        }

        if(stage_type.length==grabed){console.log('擂台：等待100秒');await sleep(100000)}
        else{console.log('擂台：等待10秒');await sleep(10000)}
    }
    console.log('擂台挑战结束')
    new Task('擂台').del()
}

if (href.match('/stage/index')){
    replaceHTML(/(挑战擂主<\/a>)/,"$1 <a id=stage5 href='javascript:;'>挑战5次</a>")
    clickRun('stage5','autostage(5)')
}

async function getContestId(){
    var mylv=myInfo.Lv()
    var myzhanli=myInfo.Zhanli()
    let count=0
    for(let num=1;num<10;num++){
        var fripage=getHttpResponseAsync(fenqu+'/fri/index.asp?sid='+sid+'&pageNo='+num)
        var friInfo=fripage.match(/userInfo.*?userId=\d+.*?\(\d+级/g)
        if(!friInfo){break}
        var lastId=friInfo[friInfo.length-1].match(/userId=(\d+)/)[1]
        for(let i=friInfo.length-1;i>=0;i--){
            let friLv=friInfo[i].match(/\((\d+)级/)[1]
            var friId=friInfo[i].match(/userId=(\d+)/)[1]
            if(mylv-friLv+10<=0){break}//比自己高十级，直接下一页

            let friZhanli=getuserzhanli(friId)
            console.log(friId+' '+friLv+' '+friZhanli)
            if(myzhanli-friZhanli-500>0){
                if(mylv-friLv-6<0){
                    console.log(myzhanli+"vs"+friZhanli)
                    for(let retry=1;retry<=1;retry++){
                        let text=getHttpResponseAsync(fenqu+'/user/contest.asp?sid='+sid+'&otherId='+friId)

                        if(text.match("切磋胜利")){
                            count++
                            console.log("切磋胜利")
                            New_setValue("contestID",friId)
                            return [friId,count]
                        }else if(text.match('活力不足')){
                            await HuoLiCao(10-myInfo.Huoli())
                            retry--
                        }
                        else{count++;console.log('切磋失败')}
                    }
                }
            }
        }
    }
    console.log('没有打得赢的好友，返回最后一个ID: '+lastId)
    return [lastId,count]
}

async function get_activity(code){
    let Activity_Name={
        monstre: '杀人蜂',
        dayconsume: '每日消费',
        nov: '限时点券',
        transport: '押镖',
        pointsrace: '积分赛',
        christmas: '任务活动',
        raffle: '许愿池',
        statue: '神像祈福',
        dlogin: '登录领奖'
    }
    let name=Activity_Name[code]
    let activityId=Activity[name]
    let text=getHttpResponseAsync(newUrl(`/${code}/index.asp?sid=`,'&activityId='+activityId))
    return [activityId,text]
}

async function autocontest(count=0,target=0,consume_mode=false){
    if(notWoker){
        if((count<=0 && !target) || count==target){new Task('竞技').del();return}
        newWorker({
            task: ['切磋','autocontest',count+','+target+','+consume_mode,'切磋:'+count],
            fn: ['userInfo','myInfo','Task','getHttpResponseAsync','HuoLiCao','getuserzhanli','movetown','getContestId','get_activity','set_dailyConsume','autocontest'],
            vars: [{count,target,consume_mode,Activity}],
            text:`
            autocontest(count,target,consume_mode)
            `
        })
        return
    }
    let current=New_getValue('record_today_contest',0)
    if(target){
        if(Activity.任务活动){
            let [activityId,page]=await get_activity('christmas')
            let real_current=page.match(/切磋\d+次&nbsp;\((\d+)/)
            if(real_current){current=real_current[1]-0}
        }
        if(!current || current<5){
            let text=getHttpResponseAsync(newUrl('/task/taskInfo.asp?sid=','&type=1&id=1005'))
            let matched=text.match(/当前值:(\d)/)
            current=matched?matched[1]-0:5
            New_setValue('record_today_contest',current)
        }
    }

    if(count==0){count=target-current}

    let id=New_getValue("contestID")
    let id_alreadyget=0
    let sub_count=0
    if(!id){[id,sub_count]=await getContestId();id_alreadyget=1;current+=sub_count}
    if(!id){return}
    for(let i=count-sub_count;i>0;i--){
        let text=getHttpResponseAsync(fenqu+'/user/contest.asp?sid='+sid+'&otherId='+id)

        if(text.match("活力不足")){
            if(consume_mode){New_setValue('record_today_contest',current);new Task('切磋').del();return}
            console.log('活力不足');await HuoLiCao(i*10)
            i++
        }else if(text.match(/(胜利|失败)/)){
            current++
            console.log("倒数第"+i+"次和"+id+"切磋-"+text.match(/(胜利|失败)/)[1])
            new Task('切磋','autocontest',i-1+','+target+','+consume_mode,'切磋:'+count).add()
            New_setValue('record_today_contest',current)
        }else if(!id_alreadyget){
            console.log('切磋失败，重新寻找ID')
            [id,sub_count]=await getContestId()
            i+=sub_count
            current+=sub_count
            id_alreadyget=1
        }
    }
    consume_mode && set_dailyConsume('切磋',{state:1})
    new Task('切磋').del()
    //New_setValue('going_task',delete going_task.autocontest)
    console.log("切磋结束")
}

if (href.match('/fri/')){
    replaceHTML(/(社交排行(<\/a>)?)/,'$1 <a id=guanshui href="javascript:;">一键灌注</a>')
    clickRun('guanshui','guanshui()')
    if(href.match('/index.asp')){
        let maxcount=parseInt(myInfo.Huoli()/10)
        replaceHTML(/(开启|关闭)/,"$1 <a id=contest5 href='javascript:;'>切磋5次</a> <a id=contest_max href='javascript:;'>切磋"+maxcount+"次</a>")
        clickRun('contest5','autocontest(5)')
        clickRun('contest_max','autocontest('+maxcount+')')
    }
}

async function auto_pcompete(){
    if(weekday!=1 && weekday!=4 || datetime<New_getValue('next_pcompete')){return}
    let level=parseInt(myInfo.Lv()/10)*10+9
    if(level<29){return}else if(level>79){level=80}

    let sign_url=fenqu+'/pcompete/apply.asp?sid='+sid+'&pcid='+level
    let text=getHttpResponseAsync(sign_url)
    if(text.match('报名成功')){
        let Award_url=fenqu+'/pcompete/takeApplyAward.asp?sid='+sid
        getHttpResponseAsync(Award_url)

        let edit_text=getHttpResponseAsync(newUrl('/pcompete/selectPetPage.asp?sid='))
        let all_pets=edit_text.match(/\/pcompete\/teamEdit.*?幻兽战力:\d+/g)
        if(all_pets){
            all_pets.sort((a,b)=>{
                return b.match(/\d+$/)[0] - a.match(/\d+$/)[0]
            })
            let added=0
            for(let i=0;i<all_pets.length;i++){
                let petId=all_pets[i].match(/(?<=petId=)\w+/)[0]
                let result=getHttpResponseAsync(newUrl('/pcompete/teamEdit.asp?sid=')+'&petId='+petId)
                if(result.match('已加入队伍')){if(++added==4){break}}
            }
        }
    }
    var add_days=weekday<4?4-weekday:8-weekday

    New_setValue('next_pcompete',getdate(add_days)+' 10:00:00')

    let page_text=getHttpResponseAsync(newUrl('/pcompete/index.asp?sid='))
    let award_url=page_text.match(/\/pcompete\/takeAward[^'">]+/g)
    if(award_url){
        for(let url of award_url){
            getHttpResponseAsync(fenqu+url.replaceAll('&amp;','&'))
        }
    }
}



async function openbox(id,num){
    if(num<=0){return}
    let retry=300
    while(num>0 && retry-->0){
        if(num>=10){var count=10;num=num-10}else{var count=num;num=0}
        if(id==1117){
            var url=fenqu+'/pack/openMoneySymbol.asp?sid='+sid+'&id='+id+'&count='+count
        }else{
            var url=fenqu+'/pack/openBox.asp?sid='+sid+'&id='+id+'&count='+count
        }
        let text=getHttpResponseAsync(url)
        //console.log(text)
        let getresult=''
        if(text.match('背包容量不足') && count != 1){
            num+=count-1
            text=getHttpResponseAsync(url.replace(/\d+$/,1))
        }
        if(text.match('>((打开|使用).*?)<br/>')){
            getresult=text.match('>((打开|使用).*?)<br/>')[1].replace(/(神·逆鳞|点券)(×|\+)/,'<label style="color:red;">$1</label>$2')
            addIdinnerHTML('result','<br>'+getresult,1)
            setIdinnerHTML(id,'')
        }else{
            let no_enough=text.match(/战灵室空间不足|背包容量不足/)
            if(no_enough){addIdinnerHTML('result','<br>'+no_enough[0],1);return no_enough[0]}
        }
        await sleep(1)
    }
}


async function open_allitems(mode='open'){
    let fn_worker=['openbox','exchange']
    if(mode=='open'){
        var regex=new RegExp('×(\\d+)[^>]+;(id=[\\w]+)?[^>]+>打开','g')
        var bagType=0
    }else{
        let splist=['1061','jnssp','1051sp','1052sp','bssp001','bssp002','bssp003','bssp004','bssp005','bssp006','20009sp','ckcl001','ckcl002','ckcl003','ckcl004']
        var regex=new RegExp(';id=('+splist.join('|')+').*?×\\d+','g')
        var bagType=1
    }
    let page_text=isWoker?getHttpResponseAsync(newUrl('/pack/index.asp?sid=','&bagType='+bagType)):outerHTML
    let page_num=page_text.match(/(\d+)\/(\d+)页/)
    
    let page_maxnum=page_num?page_num[2]:1
    let matched=[]
    let result=''
    let no_openId=[]
    let no_open_item={
        bag_auto_open_taijin: 'ygtjbx',
        bag_auto_open_zhaocai: 1117
    }
    for(let id in no_open_item){
        if(!New_getValue(id)){no_openId.push(no_open_item[id])}
    }
    for(let i=page_maxnum;i>0;i--){
        let url=newUrl('/pack/index.asp?sid=','&bagType='+bagType+'&pageNo='+i)
        matched=getHttpResponseAsync(url).match(regex)
        //console.log(url,regex,matched)
        if(!matched){continue}
        let opened=0
        for(each of matched){
            let id=each.match(/;id=(\w+)/)
            id=id?id[1]:1117
            if(no_openId.indexOf(id)>-1){continue}
            if(mode=='open'){
                result=await openbox(id,each.match(/×(\d+)/)[1])
            }else{
                result=await exchange(id,each.match(/×(\d+)/)[1],mode='all')
            }
            await sleep(1)
            opened=1
        }
        if(mode=='open' && opened && i==1){if(result && result.match('不足')){return};i++}
    }
    if(notWoker && document.getElementById('result') && document.getElementById('result').innerHTML==''){setIdinnerHTML('result','<br>没有可打开/兑换的物品')}
}

if (href.match('/pack/index.asp')){
    replaceHTML('整理背包</a>','整理背包</a>&emsp;配置背包:<a id=bag_config_switch href=javascript:;></a>&emsp;<a id=compress_bag href=javascript:;>压缩背包</a><span id=bag_config></span><span id=result></span>')

    if(!href.match(/bagType=[1-5]/)){
        replaceHTML([
            [/(<a[^>]+;id=(\w+)[^×]+?×)(\d+)([^>]+>打开<\/a>)<br>/g,"<span id=$2>$1<span id=count_$2>$3</span>$4 <a class=openall id=openall_$2_$3 href='javascript:;'>一键打开</a><br></span>"],
            ['整理背包</a>','整理背包</a>&emsp;<a id=open_allitems href="javascript:;">打开所有</a>']
        ])
        clickRun('open_allitems','open_allitems()')
        for(let item of document.getElementsByClassName('openall')){
            let [_,id,num]=item.id.split('_')
            clickRun(item.id,'openbox("'+id+'",'+num+')')
        }
    }

    if(href.match('bagType=1')){
        let splist=['1061','jnssp','1051sp','1052sp','bssp001','bssp002','bssp003','bssp004','bssp005','bssp006','20009sp','ckcl001','ckcl002','ckcl003','ckcl004']
        let sp_regex=new RegExp('(<a[^>]+;id=('+splist.join('|')+').*?×)(\\d+)(.*?)<br>','g')
        replaceHTML([
            [sp_regex,"<span id=$2>$1<span id=count_$2>$3</span>$4 <a class=exchange_all id=exchange_$2_$3 href='javascript:;'>一键兑换</a><br></span>"],
            [/(整理背包<\/a>)/,'$1&emsp;<a id=exchange_all href=javascript:;>兑换所有</a>']
        ])
        clickRun('exchange_all',"open_allitems(mode='exchange')")
        for(let item of document.getElementsByClassName('exchange_all')){
            let [_,id,num]=item.id.split('_')
            clickRun(item.id,'exchange("'+id+'",'+num+')')
        }
        
    }

    if(href.match('bagType=2')){
        replaceHTML([
            ['<br><br>','<br><a href="'+newUrl('/pet/index.asp?sid=')+'">幻兽栏</a> 提交时自动重生: <span id=today_rebirth>0</span>/<span id=max_rebirth>5</span>\
            (<a id=add_rebirth href="javascript:;">增</a> <a id=sub_rebirth href="javascript:;">减</a> <a id=rebirth_5 href="javascript:;">5次</a> <a id=rebirth_15 href="javascript:;">15次</a>)<br>'],
            [/(id=(eg(010|014|020|022|029|032|037)).>使用<\/a>)/g,'$1 <a class=auto_totem id=totem_$2 href="javascript:;">一键提交</a>'],
            [/(id=(eg\d+).>使用<\/a>)/g,'$1 <a class=open_egg id=open_$2 href="javascript:;">一键使用</a>']
        ])
        today_rebirth()

        let auto_totem=document.getElementsByClassName('auto_totem')
        for(let egg of auto_totem){
            let eggid=egg.id.split('_')[1]
            document.getElementById(egg.id).onclick=()=>{
                open_egg(eggid,totem_mode=1)
            }
        }

        let all_open_egg=document.getElementsByClassName('open_egg')
        for(let egg of all_open_egg){
            let eggid=egg.id.split('_')[1]
            clickRun(egg.id,'open_egg("'+eggid+'")')
        }
    }

    if(href.match('bagType=3')){

    }

    if(href.match('bagType=4')){

    }

    if(href.match('bagType=5')){
        replaceHTML(/(技能书&nbsp;)/,'$1 <a id=sell_rd href=javascript:;>回收弱点技能书</a> <span id=result></span>')
        document.getElementById('sell_rd').onclick=()=>{sell_book()}
    }
    clickRun('compress_bag','compress_bag()')
    bag_config()
}

function sell_swictch(checkbox,GM_var){
    let list=New_getValue(GM_var,[])
    let index=list.indexOf(checkbox)
    if(index>-1){
        list=list.filter(name=>name!=checkbox)
    }else{
        list.push(checkbox)
    }
    New_setValue(GM_var,list)
}

function get_bag_item_count(id){
    let text=getHttpResponseAsync('/pack/thingInfo.asp?sid=','&id='+id)
    if(text.match('物品不存在')){return 0}
    let count=text.match(/×(\d+)\]/)[1]
    return count
}

async function sell_book(){
    let page=href.match('bagType=5')?outerHTML:getHttpResponseAsync(newUrl('/pack/index.asp?sid=','&bagType=5&pageNo=1'))
    let page_max=page.match(/第(\d+)\/(\d+)页/)
    let current_page=page_max?page_max[1]:1
    page_max=page_max?page_max[2]:1
    let page_text=''
    for(let i=page_max;i>0;i--){
        if(i==current_page){page_text=page}else{page_text=getHttpResponseAsync(newUrl('/pack/index.asp?sid=','&bagType=5&pageNo='+i))}
        let rd_books=page_text.match(/;id=5rd[^×]+×\d+/g)
        if(!rd_books){continue}
        for(let book of rd_books){
            let id=book.match(/id=(\w+)/)[1]
            let count=book.split('×')[1]
            let text=postHttpResponseAsync(newUrl('/pack/sell.asp?sid='),`count=${count}&id=${id}&bagType=5`)
            addIdinnerHTML('result',book.match(/>(.*?)</)[1])
        }
    }
}

async function sell_jinhuashi(){
    let fn_worker=['get_bag_item_count']
    let sell_jinhuashi=New_getValue('sell_jinhuashi')
    let levels=['黄阶','玄阶','地阶','天阶','飞马','天龙','北斗']
    if(!sell_jinhuashi){
        let mylv=myInfo.Lv()
        let max_level=Math.floor(mylv/10-2)
        sell_jinhuashi=levels.slice(0,mylv>69?max_level-1:max_level)
        New_getValue('sell_jinhuashi',sell_jinhuashi)
    }
    for(let jhs of sell_jinhuashi){
        let id='jhs00'+levels.indexOf(jhs)
        let count=get_bag_item_count(id)
        if(!count){continue}
        let text=postHttpResponseAsync(newUrl('/pack/sell.asp?sid='),`count=${count}&id=${id}`)
        let selled=text.match(/(成功出售[^<]+)/)
        if(!selled){console.log(text)}
        addIdinnerHTML('result',selled?selled[1]:'回收'+id+'异常',1,1)
        await sleep(1)
    }
}

function get_array(start,end){
    return Array.from(Array(end+1).keys()).slice(start)
}

async function sell_item(item){
    let fn_worker=['get_array']
    let keep_items={
        捕捉球: {id: 20006, num: 500},
        强力球: {id: 20007, num: 500},
        强化石: {id: 1021, num: 80000},
        结晶石: {id: get_array(1031,1037), num: 5000}
    }
    let sell_keep_num=New_getValue('sell_keep_num',{})

    let items=item=='all'?Object.keys(keep_items):[item]
    for(let name of items){
        let keep_num=sell_keep_num[name] || keep_items[name].num
        let ids=keep_items[name].id
        if(typeof(ids)!='object'){ids=[ids]}

        for(let id of ids){
            let page=getHttpResponseAsync(newUrl('/pack/thingInfo.asp?sid=','&id='+id))
            let num=page.match(/×(\d+)\]/)
            if(!num){addIdinnerHTML('result','背包里没有'+name,1,1);continue}
            let count=num[1]-keep_num
            await sleep(1)
            if(count<1){addIdinnerHTML('result',name+'数量未超过'+keep_num,1,1);continue}
            let text=postHttpResponseAsync(newUrl('/pack/sell.asp?sid='),`count=${count}&id=${id}`)
            let result=text.match(/(成功[^<]+)/)
            addIdinnerHTML('result',result?result[1]:'出售'+name+'异常',1,1)
            if(!result){console.log(text)}
        }
    }
}

function bag_config(){
    let bag_config=document.getElementById('bag_config')
    if(!bag_config){return}
    let show_bag_config=New_getValue('bag_config_switch',1)
    bag_config.hidden=!show_bag_config
    setIdinnerHTML('bag_config_switch',show_bag_config?'收起':'展开')
    clickRun('bag_config_switch',"New_setValue('bag_config_switch',document.getElementById('bag_config').hidden?1:0);bag_config()")
    if(!show_bag_config || bag_config.innerHTML){return}

    let mylv=myInfo.Lv()
    let levels=['黄阶','玄阶','地阶','天阶','飞马','天龙','北斗']
    let jinhuashi_text=''
    
    let max_level=Math.floor(mylv/10-2)
    for(let i=0;i<=max_level;i++){
        let level=levels[i]
        jinhuashi_text+=`<label for=${level}</label>${level}<input type="checkbox" class=sell_jinhuashi id=${level}> `
    }
    jinhuashi_text+='<a id=jinhuashi_selectAll href="javascript:;">全选</a> <a id=jinhuashi_unselectAll href="javascript:;">全不选</a>'

    let tz_type=''
    let tz_type_all=['碎空','猎魔','龙炎','奔雷','凌霄','麒麟','武神','弑天','毁灭','圣魂']
    let idlist=['tzsk','tzlm','tzly','tzbl','tzlx','tzql','tzws','tzst','tzhm','tzsh']
    for(let n=0;n<tz_type_all.length;n++){
        tz_type+='<label for="sell_'+idlist[n]+'">'+tz_type_all[n]+'</label><input type="checkbox" class=tz_checkbox id="sell_'+idlist[n]+'"> '
        if(n==4){tz_type+='<a id=tz_selectAll href="javascript:;">全选</a><br><a href="javascript:;" style="opacity: 0;">出售图纸&emsp;: </a>'}
    }
    tz_type+='<a id=tz_unselectAll href="javascript:;">全不选</a>'

    let keep_items={
        捕捉球: {id: 20006, num: 500},
        强力球: {id: 20007, num: 500},
        强化石: {id: 1021, num: 80000},
        结晶石: {id: get_array(1031,1037), num: 5000}
    }
    let keep_items_text=''
    let keep_index=1
    for(let name in keep_items){
        keep_items_text+=`<a id=sell_${name} href=javascript:;>回收${name}至</a>: <input id=sell_${name}_keepnum type=number style="width:60px" placeholder=${keep_items[name].num}>`
        keep_items_text+=keep_index++%2==0?'<br>':' '
    }

    let config_text=`<br><br>
    ${keep_items_text}
    自动打开&emsp;: <label for=bag_auto_open_zhaocai>招财神符</label><input type=checkbox id=bag_auto_open_zhaocai> \
    <label for=bag_auto_open_taijin>钛金宝箱</label><input type=checkbox id=bag_auto_open_taijin><br>
    <a id=sell_jinhuashi href=javascript:;>回收进化石</a>: ${jinhuashi_text}<br>
    <a id=sell_equip href=javascript:;>回收战骨&emsp;</a>: <label for=原始>原始</label><input type=checkbox id=原始> <label for=全部>全部</label><input type=checkbox id=全部><br>
    <a id=selltz href="javascript:;">回收图纸&emsp;</a>: ${tz_type}<br>`
    setIdinnerHTML('bag_config',config_text)
    checkboxRun('bag_auto_open_zhaocai')
    checkboxRun('bag_auto_open_taijin')


    let tz_tosell=New_getValue('tz_tosell',[])
    for(let tz of tz_tosell){
        document.getElementById('sell_'+tz).checked=true
    }
    for(let n=0;n<tz_type_all.length;n++){
        clickRun('sell_'+idlist[n],'tz_sell_swictch("'+idlist[n]+'")')
    }
    clickRun('selltz','selltz()')
    document.getElementById('tz_selectAll').onclick=()=>{
        New_setValue('tz_tosell',idlist)
        for(let tz of idlist){
            document.getElementById('sell_'+tz).checked=true
        }
    }
    document.getElementById('tz_unselectAll').onclick=()=>{
        New_setValue('tz_tosell',[])
        for(let tz of idlist){
            document.getElementById('sell_'+tz).checked=false
        }
    }

    let sell_equip=New_getValue('sell_equip_types','原始')
    yuanshi=document.getElementById('原始')
    quanbu=document.getElementById('全部')
    if(yuanshi){
        if(sell_equip=='原始'){yuanshi.checked=true;quanbu.checked=false}else{yuanshi.checked=false;quanbu.checked=true}
        yuanshi.onclick=()=>{
            quanbu.checked=yuanshi.checked?false:true
            New_setValue('sell_equip_types',yuanshi.checked?'原始':'全部')
        }
        quanbu.onclick=()=>{
            yuanshi.checked=quanbu.checked?false:true
            New_setValue('sell_equip_types',yuanshi.checked?'原始':'全部')
        }
        document.getElementById('sell_equip').onclick=async()=>{
            let type=yuanshi.checked?'原始':''
            let page=href.match('bagType=3')?outerHTML:getHttpResponseAsync(newUrl('/pack/index.asp?sid=','&bagType=3&pageNo=1'))
            let page_max=page.match(/第(\d+)\/(\d+)页/)
            let current_page=page_max?page_max[1]:1
            page_max=page_max?page_max[2]:1
            let page_text=''
            for(let i=page_max;i>0;i--){
                if(i==current_page){page_text=page}else{page_text=getHttpResponseAsync(newUrl('/pack/index.asp?sid=','&bagType=3&pageNo='+i))}
                let equips=page_text.match(eval(`/;id=\\w+.>${type}/g`))
                if(!equips){continue}
                for(let equip of equips){
                    let id=equip.match(/id=(\w+)/)[1]
                    let text=getHttpResponseAsync(newUrl('/equip/sellEquip.asp?sid=','&id='+id))
                    let result=text.match(/(成功[^<]+)/)
                    addIdinnerHTML('result',result?result[1]:'出售'+id+'异常',1,1)
                    if(!result){console.log(text)}
                    await sleep(1)
                }
            }
        }
    }

    clickRun('sell_jinhuashi','sell_jinhuashi()')
    let sell_jinhuashi=New_getValue('sell_jinhuashi',levels.slice(0,mylv>69?max_level-1:max_level))
    for(let level of sell_jinhuashi){
        document.getElementById(level).checked=true
    }
    for(let i=0;i<=max_level;i++){
        document.getElementById(levels[i]).onclick=()=>{sell_swictch(levels[i],'sell_jinhuashi')}
    }
    document.getElementById('jinhuashi_selectAll').onclick=()=>{
        New_setValue('sell_jinhuashi',levels.slice(0,max_level+1))
        for(let level of levels){
            document.getElementById(level).checked=true
        }
    }
    document.getElementById('jinhuashi_unselectAll').onclick=()=>{
        New_setValue('sell_jinhuashi',[])
        for(let level of levels){
            document.getElementById(level).checked=false
        }
    }

    sell_keep_num=New_getValue('sell_keep_num',{})
    for(let name in keep_items){
        let id='sell_'+name
        document.getElementById(id).onclick=()=>{sell_item(name)}
        id+='_keepnum'
        let value=sell_keep_num[name]
        let inputbox=document.getElementById(id)
        if(value){inputbox.value=value}
        inputbox.oninput=()=>{sell_keep_num[name]=inputbox.value;New_setValue('sell_keep_num',sell_keep_num)}
    }
}

if(href.match(/\/pack\/thingInfo.*id=eg\d+&bagType=2/)){
    replaceHTML(/(\[(.*?)精灵球×(\d+).*?使用<\/a>)/,'$1&emsp;&emsp;<a id=sellAll title=$2_$3 href=javascript:;>一键回收全部</a>')
    let sellAll=document.getElementById('sellAll')
    sellAll.onclick=()=>{
        let [name,count]=sellAll.title.split('_')
        postHttpResponseAsync(newUrl('/pack/sell.asp?sid='),`count=${count}&id=${href.match(/&id=(eg\d+)/)[1]}&bagType=2`)
        location.replace(document.referrer)
    }
}

async function open_egg(id,totem_mode=0){
    let url=newUrl('/pack/openPetBall.asp?sid=')+'&id='+id
    let count=0
    let totem=[0,0,0]
    let result=''
    while(count < 10){
        let text=getHttpResponseAsync(url)
        if(text.match('精灵球成功,获得')){
            count++
            if(totem_mode){
                if(text.match(/成长率:\d+0\(★★★★★\)/)){console.log('开出成长率五星');totem[2]++;continue}
                result=await auto_totem(text,1)
                if(result=='提交'){totem[0]++}else if(result=='放生'){totem[1]++}else if([false,'all_completed','重生足够'].indexOf(result)>=0){break}
            }
        }else if(text.match('幻兽栏空间不足')){
            if(count>0){break}
            setIdinnerHTML((totem_mode?'totem_':'open_')+id,'幻兽栏空间不足')
            return
        }else{console.log(text);break}
    }
    if(totem_mode){
        setIdinnerHTML('totem_'+id,`提交:${totem[0]},放生:${totem[1]},保留:${totem[2]}`)
        if(result=='all_completed'){addIdinnerHTML('totem_'+id,',图鉴已完成')}
    }else{
        setIdinnerHTML('open_'+id,'打开'+count+'个')
    }
}

function tz_sell_swictch(tz){
    
    let tz_tosell=New_getValue('tz_tosell',[])

    let index=tz_tosell.indexOf(tz)
    if(index>-1){
        tz_tosell=tz_tosell.filter(name=>name!=tz)
    }else{
        tz_tosell.push(tz)
    }
    New_setValue('tz_tosell',tz_tosell)
}


async function selltz(all=false){
    let tz_array=New_getValue('tz_tosell',[])
    if(tz_array.length==0){return}
    let allget=0

    if(tz_array.length==10 || all){
        allget=getHttpResponseAsync(newUrl('/pack/sellAll.asp?sid=','&bagType=4')).match(/(?<=获得：)\d+/)
    }else{

    let url=fenqu+'/pack/index.asp?sid='+sid+'&bagType=4'
    if(href.match('bagType=4')){var text_page=outerHTML}else{var text_page=getHttpResponseAsync(url)}
    let page_num=text_page.match(/(\d+)\/(\d+)页/)
    if(page_num){page_num=page_num[0]}else{page_num='1/1页'}
    let cur_page=page_num.match(/(\d+)\/(\d+)页/)[1]
    let page_maxnum=page_num.match(/(\d+)\/(\d+)页/)[2]

    
    let text=''
    for(let i=page_maxnum;i>0;i--){
        if(cur_page==i){text=text_page}else{text=getHttpResponseAsync(url+'&pageNo='+i)}
        let unlocked_tz=text.match(/(?<=×)\d+[^>]+lockFlag=1/g)
        if(!unlocked_tz){continue}
        for(let n=0;n<unlocked_tz.length;n++){
            let count=unlocked_tz[n].match(/\d+/)[0]
            let id=unlocked_tz[n].match(/(?<=;id=)\w+/)[0]
            let tz=id.replace(/\d+$/,'')
            if(tz_array.indexOf(tz)<0){continue}
            let result=postHttpResponseAsync(fenqu+'/pack/sell.asp?sid='+sid,'count='+count+'&id='+id+'&bagType=4')
            //console.log(result)
            let getmoney=result.match(/(\d+)铜钱/)
            if(getmoney){
                allget+=parseInt(getmoney[1])
            }
        }
    }
    }

    if(allget){
        console.log('获得铜钱:'+allget)
        addIdinnerHTML('result','出售战骨获得铜钱:'+allget,1,1)
    }else{
        console.log('无此类战骨')
        addIdinnerHTML('result','无可出售战骨',1,1)
        return
    }
    //clickRun('selltz','selltz()')
}

async function exchange(id,num,mode=''){
    let splist={'id_jnssp':[2,60],'id_1061':[3,100],'id_1051sp':[201,8],'id_1052sp':[202,3],'id_bssp001':['bsdh01',3],'id_bssp002':['bsdh02',3],
    'id_bssp003':['bsdh03',3],'id_bssp004':['bsdh04',3],'id_bssp005':['bsdh05',3],'id_bssp006':['bsdh06',3],id_20009sp:['lgqdh01',500]}
    if(id.match(/ckcl\d+/)){
        let text=postHttpResponseAsync(newUrl('/pack/sell.asp?sid='),`count=${num}&id=${id}&bagType=1`)
        addIdinnerHTML('result','<br>'+text.match(/出售.*铜钱/)[0]);setIdinnerHTML(id,'')
        return
    }
    let sp=splist["id_"+id]
    if(!sp){console.log('没有定义兑换');return}
    let count=parseInt(num/sp[1])
    if(count<=0){mode==''&&addIdinnerHTML('result','<br>数量不足以兑换',1);return}
    let left=parseInt(num%sp[1])
    let text=postHttpResponseAsync(newUrl('/exch/exchange.asp?sid=','&type=1'),'count='+count+'&id='+sp[0])
    if(left>0){setIdinnerHTML('count_'+id,left)}else{setIdinnerHTML(id,'')}
    let getresult=text.match(/(成功兑换.*?)</)
    getresult=getresult?getresult[1]:'数量不足以兑换'
    addIdinnerHTML('result','<br>'+getresult,1)
}

async function removeAll_clanwar(){
    for(let i in [1,2]){
        let page_text=getHttpResponseAsync(newUrl('/clanwar/teamInfo.asp?sid=','&fiedType='+i))
        let userIds=page_text.match(/(?<=userId=)\d+/g)
        for(let userId of userIds){
            getHttpResponseAsync(newUrl('/clanwar/removeId4Team.asp?sid=','&fiedType='+i+'&otherId='+userId))
        }
    }
    location.reload()
}

if(href.match('/clanwar/team') && !href.match('fiedType=2')){
    replaceHTML([
        [/(\[管理名单\])/,'$1 <a id=removeAll href=javascript:;>全部移出</a>'],
        ['签到状态','签到状态 <a id=rejoin href="javascript:;">自动移到伏虎</a>']
    ])
    clickRun('removeAll','removeAll_clanwar()')
    sleep(20).then(()=>{
        document.getElementById('rejoin').onclick=()=>{
        let otherIds=outerHTML.match(/(?<=\/(2\d|3\d|40)\/已签到[^>]+otherId=)\d+/g)
        if(!otherIds){return}
        for(let otherId of otherIds){
            getHttpResponseAsync(newUrl('/clanwar/removeId4Team.asp?sid=','&fiedType=1&otherId='+otherId))
            getHttpResponseAsync(newUrl('/clanwar/addId2Team.asp?sid=','&fiedType=2&otherId='+otherId))
        }
        location.reload()
        }
    })
}

async function auto_signwar(){
    let next_signwar=New_getValue('next_signwar','0')
    if(New_getValue('auto_signwar') && datetime>=next_signwar){
        let applywar=New_getValue('clanwar_apply')
        if(applywar && !next_signwar.match(' ')){
            for(let i of [1,2]){
                let team=[,'飞龙军','伏虎军'][i]
                let action=applywar[team]
                if(action==0){
                    let text=getHttpResponseAsync(newUrl('/clanwar/applyWarIndex.asp?sid=')+'&fiedType='+i)
                    let place1=text.match(/1号\.(\d+)/)[1]
                    let place2=text.match(/2号\.(\d+)/)[1]
                    action=place2>place1?2:1
                }
                if(action>0){
                    action=(i-1)*10+parseInt(action)
                    console.log(newUrl('/clanwar/applyWar.asp?sid=')+'&fiedType='+i+'&fiedId='+action)
                    let text=getHttpResponseAsync(newUrl('/clanwar/applyWar.asp?sid=')+'&fiedType='+i+'&fiedId='+action)
                    console.log(text)
                }
            }
        }
    if(timenow>New_getValue('signwar_starttime','0')){
        let clanwar_fiedType=New_getValue('clanwar_fiedType')
        clanwar_fiedType=myInfo.Lv()>40?1:2
        New_setValue('clanwar_fiedType',clanwar_fiedType)
        if([1,2].indexOf(clanwar_fiedType)<0){
            clanwar_fiedType=myInfo.Lv()>40?1:2
            New_setValue('clanwar_fiedType',clanwar_fiedType)
        }

        let text=getHttpResponseAsync(newUrl('/clanwar/sign.asp?sid=')+'&fiedType='+clanwar_fiedType)

        if(text.match('没有报名')){
            New_setValue('next_signwar',getdatetime(1))
        }else if(text.match('还没进入联盟')){
            New_setValue('next_signwar',getdatetime(1))
        }else if(text.match('等级')){
            clanwar_fiedType=1?myInfo.Lv()>40:2
            New_setValue('clanwar_fiedType',clanwar_fiedType)
        }else if(text.match('不是盟战签到时间')){
            New_setValue('next_signwar',getdate(1))
        }else if(text.match(/成功|已经签到|不能重复报名|验证码：/)){
            console.log('签到盟战')
            let add_day=weekday<4?4-weekday:8-weekday
            let next_signwar=getdate(add_day)
            New_setValue('next_signwar',next_signwar)
        }else{console.log(text)}
    }else{New_setValue('next_signwar',getdatetime(1))}
    }

    if(datetime>=New_getValue('next_clanrace','')){
        let text=getHttpResponseAsync(newUrl('/clanrace/sign.asp?sid='))
        if(text.match(/成功|已经完成签到|签到时间已过/)){
            console.log('签到争霸赛')
            let add_day=weekday==6?6:7
            New_setValue('next_clanrace',getdate(add_day)+' 18:00')
        }else{
            console.log(text)
            New_setValue('next_clanrace',getdatetime(1))
        }
    }
}

async function auto_clanPractice(force_join=0){
    let next_clanPracticeAward=New_getValue('next_clanPracticeAward')
    if(datetime>=next_clanPracticeAward){
        let award=getHttpResponseAsync(newUrl('/clan/takePracticeAward.asp?sid='))
        if(award.match('修行完毕')){
            New_setValue('next_clanPracticeAward',getdate(1)+' 09:00')
            New_setValue('record_clanPracticeAward',award.match(/(焚火晶.*?\+\d+)/)[1])
        }else{
            New_setValue('next_clanPracticeAward',getdatetime(1))
        }
    }
    let next_clanPractice=New_getValue('next_clanPractice')

    if(datetime<next_clanPractice){return}
    let clanPractice_startTime=New_getValue('clanPractice_startTime')
    if(timenow<clanPractice_startTime){return}
    console.log('准备修炼')

    let create_room=New_getValue('create_clanPractice')
    let text=getHttpResponseAsync(newUrl('/clan/practiceIndex.asp?sid='))
    let allTeam=text.match(/\([1-4]\/5\)<a href=[^>]*?>/g) || []

    if(!create_room || timenow > '12:00' || allTeam.length>2){
        let mostTeam=''
        for(i=0;i<allTeam.length;i++){
            if(allTeam[i][1]==1){mostTeam=allTeam[i];break}
            if(i==0){mostTeam=allTeam[i];continue}
            if(allTeam[i][1]>mostTeam[1]){mostTeam=allTeam[i]}
        }
        if(mostTeam && (!create_room || allTeam.length>1 || timenow > '18:00')){
            getHttpResponseAsync(fenqu+'/clan/note.asp?sid='+sid)
            let url=mostTeam.match(/href=['"](.*?)['"]>/)[1].replace('&amp;','&')
            let jointext=getHttpResponseAsync(url)
            //console.log(jointext)
            if(jointext.match('加入')){
                console.log('加入修行房间，当前人数：'+(parseInt(mostTeam[1])+1))
                New_setValue('next_clanPracticeAward',getdatetime(2))
            }else if(jointext.match('当前已在房间')){
                console.log('联盟修行已在房间')
                New_setValue('next_clanPracticeAward',getdatetime(1))
            }else if(jointext.match('今天已经火能修行')){
                console.log('今天已经火能修行')
            }else if(jointext.match('不够3天,不能火修')){
                console.log('不够3天,不能火修')
                New_setValue('next_clanPractice',getdatetime(1))
                return
            }else{
                console.log(jointext)
                New_setValue('next_clanPractice',getdatetime(1))
                return
            }
            New_setValue('next_clanPractice',getdate(1)+' 07:00')
            return
        }
    }
    if(timenow>'23:00'){New_setValue('next_clanPractice',getdatetime(0,10));return}
    getHttpResponseAsync(fenqu+'/clan/note.asp?sid='+sid)
    text=getHttpResponseAsync(fenqu+'/clan/createTeam.asp?sid='+sid)
    if(text.match('成功')){
        console.log('创建修行房间')
        New_setValue('next_clanPracticeAward',getdatetime(2))
    }else if(text.match('今天已经完成修行')){
        console.log('今天已经火能修行')
    }
    New_setValue('next_clanPractice',getdate(1)+' 07:00')
    return
}

if(href.match('/pet/index.asp')){
    let refine_mode=New_getValue('record_refine_mode')
    let replace_array=[
        [/(羽族(<\/a>)?)/,'$1 | <a href="javascript:;" id=switch_refine_mode></a>'],
        [/(petId=(\w+)[^>]+>([^<]+).*?)(\d+级)(.*?)<.*?幻兽战力/g,'$1<span id=level_$2>$4</span>$5&nbsp;<span class=action title=$3_$4 id=$2></span><br>幻兽战力'],
        //[/(petId=(\w+).*?)(\d+级)(.*?)<br>幻兽战力/g,'$1<span id=level_$2>$3</span>$4&emsp;<a id=upgrade_1_$2 href="javascript:;" class=upgrade_class>升级</a><br>幻兽战力'],
        //[/href=[^>]+petId=(\w+)[^>]+>置顶/g,'href="javascript:;" id=$1 class=top_class>置顶'],
        [/(幻兽放生恢复<\/a>)/,'$1&emsp;<a href="'+newUrl('/pack/index.asp?sid=')+'&bagType=2'+'">精灵球背包</a>']
    ]
    if(refine_mode){replace_array.push([/(<br>幻兽栏)/,'<span id=refine_item></span>$1'])}
    replaceHTML(replace_array)
    
    auto_switch('switch_refine_mode','record_refine_mode',0,1,0,'关闭炼妖模式','开启炼妖模式',1)
  
    
    for(let item of document.getElementsByClassName('action')){
        let petId=item.id
        let value=`<a href="javascript:;" id=top_${petId} class=top_class>置顶</a>&emsp;<a id=upgrade_1_${petId} href="javascript:;" class=upgrade_class>升级</a>`
        if(refine_mode){
            let [pet_name,level]=item.title.split('_')
            level=level.replace('级','')-0
            let text=''
            if(level>=30){text='选为主宠'}
            [main_pet_name,main_pet]=New_getValue('record_refine_main_pet')
            if(petId==main_pet){text='【取消主宠】'}else if(level<=10){text='炼妖'}
            value+=`&emsp;<a id=refine_${petId} href="javascript:;" title=${pet_name} class=refine_pet>${text}</a> <span id=result_${petId}></span>`
        }
        setIdinnerHTML(petId,value)
    }
  if(refine_mode){
    let all_item=['气血','速度','物攻','物防','法防','法攻']
    refine_items=New_getValue('record_refine_items',all_item)
    let refine_item_text='炼妖资质：'
    for(let item of all_item){
        refine_item_text+=`<label for=refine_${item}>${item}</label><input type=checkbox id=refine_${item}`
        if(refine_items.indexOf(item)>=0){refine_item_text+=' checked=checked'}
        refine_item_text+='> '
        if(item=='物攻'){refine_item_text+='<a id=selectAll href="javascript:;">全选</a><br>&emsp;&emsp;&emsp;&emsp;&emsp;'}
    }
    refine_item_text+='<a id=unselectAll href="javascript:;">全不选</a>'
    setIdinnerHTML('refine_item',refine_item_text)

    main_pet_value={}
    for(let item of document.getElementsByClassName('refine_pet')){
        let id=item.id
        let btn=document.getElementById(id)
        btn.onclick=()=>{
            let action=btn.innerHTML
            let petId=id.replace('refine_','')
            let resultId=id.replace('refine_','result_')
            setIdinnerHTML(resultId,'')
            if(action=='选为主宠'){
                if(main_pet){setIdinnerHTML('refine_'+main_pet,'选为主宠')}
                main_pet_value={}
                main_pet_name=item.title
                main_pet=petId;console.log('主宠:',main_pet);New_setValue('record_refine_main_pet',[main_pet_name,main_pet]);btn.innerHTML='【取消主宠】'
            }else if(action=='【取消主宠】'){
                main_pet='';New_setValue('record_refine_main_pet','');btn.innerHTML='选为主宠'
            }else if(action=='炼妖'){
                if(!main_pet){setIdinnerHTML(resultId,'请先选主宠');return}
                enhancePet(main_pet,petId)
            }
        }
    }
    for(let item of all_item){
        let box=document.getElementById('refine_'+item)
        box.onclick=()=>{if(box.checked){refine_items.push(item)}else{refine_items=refine_items.filter(name=>name!=item)};New_setValue('record_refine_items',refine_items)}
    }
    document.getElementById('selectAll').onclick=()=>{for(let item of all_item){document.getElementById('refine_'+item).checked=true};refine_items=all_item;New_setValue('record_refine_items',refine_items)}
    document.getElementById('unselectAll').onclick=()=>{for(let item of all_item){document.getElementById('refine_'+item).checked=false};refine_items=[];New_setValue('record_refine_items',[])}
  }
    let n=1
    for(let pet of document.getElementsByClassName('top_class')){
        let petId=pet.id.replace('top_','')
        let count=n++

        document.getElementById(pet.id).onclick=()=>{
            for(let i=0;i<count;i++){
                getHttpResponseAsync(newUrl('/pet/topSite.asp?sid=')+'&petId='+petId+'&type=0')
            }
            location.reload()
        }
    }
    upgrade_pet()
}

if(href.match('/pet/') && (href.match('/petInfo') || href.match('/rebirth1Res.asp')) || href.match('pack/openPetBallRes')){
    let all_pets=`,
        血螳螂,小黑鼠,大黄蜂,毒毛虫,追风狼,獠牙猪,羽精灵,怒冠鸟,黑灵鸟,
        采矿猴,弑魂蚁,吞岩兽,大嘴蛇,厚甲龟,巨齿鳄,水草兽,蓝灵鱼,
        苍山鹫,血蝙蝠,雷翼雕,荒原豹,紫雾虫,巨甲虫,沼泽蛙,水蜥蜴,
        日落豚,双吻鱼,大钳蟹,海龙鱼,飞泪蝶,风雷蛛,落魂兽,幻灵狐,
        巡游使,半龙羽,蚀骨狼,龙翼兽,龙魂龟,雪人怪,冰晶猿,噬天虎,
        双头雕,龙吼鸟,黑灵虎,巨盾兽,金甲虫,幽冥蚁,半人鱼,圣晶怪,
        软泥虫,逐浪鲨,啸海螺,浴火龟,幻光兔,飞翼蛇,九霄鹰,圣灵蚁`.replaceAll('\n','').replaceAll(' ','').split(',')
    let pet_name=outerHTML.match(/br>([^-]+).*?\(.族/)[1]
    let other_pets={
        妖灵猴: 160,
        神·火灵猴: 161,
        神·火神龙: 69,
        神·罗刹: 81,
        神·白虎: 82,
        神·不死鸟: 80,
        神·绝影: 84,
        神·朱雀: 85,
        神·玄武: 86,
        神·青龙: 87
    }
    var confirm_ok=0
    let bookId=(other_pets[pet_name] || all_pets.indexOf(pet_name)).toString().padStart(3,0)
    petId=href.match(/petId=(\w+)/)
    petId=petId?petId[1]:petId=outerHTML.match(/petId=(\w{10,})/)[1]
    let rebirth15_auto_text=New_getValue('rebirth15_auto_petId')==[petId]?'取消选中':'选为自动重生'
    let replace_array=[
        ['重生</a>','重生</a></span>'],
        [/>([^>]+)(\(.族)/,`><a href=${newUrl('/handbook/showDetail.asp?sid=','&petId=zh'+bookId)}>$1</a>$2`],
        ['族\)','族) 今日重生次数: <span id=today_rebirth>0</span>/<span id=max_rebirth>5</span>\
        (<a id=add_rebirth href="javascript:;">增</a> <a id=sub_rebirth href="javascript:;">减</a> <a id=rebirth_5 href="javascript:;">5次</a> <a id=rebirth_15 href="javascript:;">15次</a>) <a id=confirm_ok style="color:red;" href="javascript:;"></a>'],
        [/<br>等级:1级/,` <a id=rebirth href="javascript:;">普通重生</a> <a id=rebirth5 href="javascript:;">重生5次</a> <a id=rebirth15 href="javascript:;">重生15次</a> <a id=rebirth15_auto href=javascript:;>${rebirth15_auto_text}</a><span id=petInfo><br>等级:1级`],
        [/等级:(\d+级)/,`等级:<span id=level>$1</span> <a id=upgrade_1 href="javascript:;" class=upgrade_class>升级</a> <a id=upgrade_5 href="javascript:;" class=upgrade_class>升5级</a> <a id=upgrade_101 href="javascript:;" class=upgrade_class>一键升级</a>`],
        [/(成长率[^)]+\))/,'$1 <span id=addResult style="color:red;"></span>']
    ]
    let level=outerHTML.match(/等级:(\d+)级/)[1]
    if(level>=30){replace_array.push([/((..)资质:(\d+).*?\))/g,"<span id=value_$2>$1</span> <a class=addLevel id=$2 title=$3 href='javascript:;'>提升$2</a>"])}
    if(level<=10){replace_array.push([/((..)资质:(\d+).*?\))/g,"$1 <a class=refine id=$2 title=$3 href='javascript:;'>$2炼妖</a>"])}
    let refine_mode=New_getValue('record_refine_mode')
    if(refine_mode && level<=10){
        var [main_pet_name,main_pet]=New_getValue('record_refine_main_pet')
        let text='未选择主宠'
        if(main_pet){text=`炼妖主宠:<a href=${newUrl('/pet/petInfo.asp?sid=','&petId='+main_pet+'&type=0')}>${main_pet_name}</a>`}
        replace_array.push([/(综合战力:\d+)/,`$1 <span id=main_pet>${text}</span> <a id=switch_refine_mode href=javascript:;></a>`])
    }
    replaceHTML(replace_array)
    

    auto_totem(outerHTML)
    if(outerHTML.match('重生')){
        if(document.getElementById('rebirth')){
            document.getElementById('rebirth').onclick=()=>{rebirth(1)}
            document.getElementById('rebirth5').onclick=()=>{rebirth(5)}
            document.getElementById('rebirth15').onclick=()=>{rebirth(15)}
            let rebirth15_auto=document.getElementById('rebirth15_auto')
            rebirth15_auto.onclick=()=>{
                if(rebirth15_auto.innerText=='取消选中'){New_setValue('rebirth15_auto_petId','');rebirth15_auto.innerHTML='选为自动重生'}
                else{New_setValue('rebirth15_auto_petId',petId);rebirth15_auto.innerHTML='取消选中'}
            }
        }
    }
    document.getElementById('confirm_ok').onclick=()=>{setIdinnerHTML('confirm_ok','');confirm_ok=1}
    nouse_petId=[]
    main_pet_value={}
    eggInfo={}
    pets_name=[]
  if(level>=30){
    let alladd=document.getElementsByClassName('addLevel')
    
    for(let i=0;i<alladd.length;i++){
        let item=alladd[i].id
        let CurrentValue=alladd[i].title
        clickRun(alladd[i].id,'enhancePet("'+petId+'","'+item+'",'+CurrentValue+')')
    }
  }
    if(refine_mode && level<=10){
    
    auto_switch('switch_refine_mode','record_refine_mode',0,1,0,'关闭炼妖模式','开启炼妖模式',1)
    for(let item of document.getElementsByClassName('refine')){
        let btn=document.getElementById(item.id)
        btn.onclick=()=>{
            if(document.documentElement.outerHTML.match(/成长率:\d+0\(★★★★★\)/)){
                if(confirm_ok==0){
                    setIdinnerHTML('confirm_ok','确定炼妖')
                    return
                }else{confirm_ok=0}
            }
            console.log(confirm_ok)
            if(!main_pet){addIdinnerHTML('addResult','请先选主宠');return}
            enhancePet(main_pet,[petId,item.id,item.title,get_needExp(outerHTML,level)])
        }
    }
    }
    today_rebirth()
    upgrade_pet()
    
}

function today_rebirth(){
    rebirth_count=New_getValue('record_rebirth_count',[0,5])
    setIdinnerHTML('today_rebirth',rebirth_count[0])
    setIdinnerHTML('max_rebirth',rebirth_count[1])
    document.getElementById('add_rebirth').onclick=()=>{rebirth_count[1]++;setIdinnerHTML("max_rebirth",rebirth_count[1]);New_setValue("record_rebirth_count",rebirth_count)}
    document.getElementById('sub_rebirth').onclick=()=>{rebirth_count[1]--;setIdinnerHTML("max_rebirth",rebirth_count[1]);New_setValue("record_rebirth_count",rebirth_count)}
    document.getElementById('rebirth_5').onclick=()=>{rebirth_count[1]=5;setIdinnerHTML("max_rebirth",rebirth_count[1]);New_setValue("record_rebirth_count",rebirth_count)}
    document.getElementById('rebirth_15').onclick=()=>{rebirth_count[1]=15;setIdinnerHTML("max_rebirth",rebirth_count[1]);New_setValue("record_rebirth_count",rebirth_count)}
}

async function upgrade_pet(){
    for(let pet of document.getElementsByClassName('upgrade_class')){
        document.getElementById(pet.id).onclick=async ()=>{
            let level_id='level'
            let add_level=pet.id.split('_')[1]
            if(pet.id.length>15){petId=pet.id.split('_')[2];level_id+='_'+petId}
            let result=0
            for(let i=0;i<add_level;i++){
                if(add_level==101){
                    let max_exp=getHttpResponseAsync(newUrl('/exppool/index.asp?sid=')).match(/\d+\/(\d+)/)[1]
                    for(let n of [2,3,4,5]){
                        result=await addPetExp(petId,Math.ceil(max_exp/n),pet.id,force=true)
                        if(result){break}
                    }
                    add_level=100
                }else{
                    let addExp=pet.id.split('_')[3]
                    if(!addExp){
                        let page_text=getHttpResponseAsync(newUrl('/pet/petInfo.asp?sid=','&petId='+petId+'&type=0'))
                        let exp=page_text.match(/经验:(\d+)\/(\d+)/)
                        addExp=exp[2]-exp[1]
                    }
                    result=await addPetExp(petId,addExp,pet.id)
                }
                if(result){
                    setIdinnerHTML(level_id,result.match(/当前等级:(\d+级)/)[1])
                    await sleep(1)
                    let nextExp=result.match(/\((\d+)\/(\d+)\)/)
                    nextExp=nextExp[2]-nextExp[1]
                    document.getElementById(pet.id).id=`upgrade_${add_level}_${petId}_${nextExp}`
                }else if(result===0 && add_level!=100){setIdinnerHTML(pet.id,'超过用户等级的限制值');break}
                else{break}
            }
        }
    }   
}

async function auto_totem(page_text,auto_mode=0){
    let pet_matched=page_text.split('经验')[0].match(/(采矿猴|厚甲龟|雷翼雕|紫雾虫|海龙鱼|落魂兽|龙翼兽).*?等级:(\d|10)级/)
    if(!pet_matched){return}
    petId=page_text.match(/petId=(\w{10,})/)[1]
    let tujian={
        采矿猴:{物攻:1107,物防:821,法防:645,气血:739,速度:923},
        厚甲龟:{法攻:739,物防:1107,法防:555,气血:1017,速度:923},
        雷翼雕:{法攻:1017,物防:967,法防:1017,气血:814,速度:1170},
        紫雾虫:{物攻:814,物防:612,法防:1218,气血:1120,速度:1017},
        海龙鱼:{法攻:895,物防:553,法防:1454,气血:1231,速度:1108},
        落魂兽:{物攻:895,物防:1454,法防:553,气血:1231,速度:1108},
        龙翼兽:{物攻:1469,物防:1100,法防:856,气血:981,速度:1225}
    }

    auto_mode || replaceHTML(/(综合战力:\d+)/,'$1 <span id=totem_result></span>')
  for(let count=0;count<1;count++){
    let all_level=page_text.match(/..资质:\d+/g)
    let petName=pet_matched[1]
    var totem_completed=New_getValue('record_totem_completed',{})
    if(auto_mode && totem_completed[petName] && totem_completed[petName].length==5){
        console.log('**放生**\n',page_text)
        getHttpResponseAsync(newUrl('/pet/sell.asp?sid=','&petId='+petId))
        return 'all_completed'
    }
    for(each_level of all_level){
        let item=each_level.split('资质')[0]
        let value=each_level.split('资质:')[1]
        if(value >= tujian[petName][item] && (totem_completed[petName]==undefined || totem_completed[petName].indexOf(item)<0)){
            let id=Object.keys(tujian).indexOf(petName)*5 + Object.keys(tujian[petName]).indexOf(item) + 1
            if(id<10){id='0'+id}
            if(auto_mode){
                let result=await totem('0'+id,petId,petName,item)
                if(result==true){console.log(`提交图鉴-${petName}-${item}`);return '提交'}else if(result=='complete'){console.log(`图鉴已满-${petName}-${item}`);continue}else{return false}
            }else{
                let regex=new RegExp('('+item+':\\d+)')
                replaceHTML(regex,'$1.<a id=totem_id0'+id+' href="javascript:;">图鉴提交</a>')
                sleep(30).then(()=>{
                    document.getElementById('totem_id0'+id).onclick=()=>{
                        if(document.documentElement.outerHTML.match(/成长率:\d+0\(★★★★★\)/)){
                            if(confirm_ok==0){
                                setIdinnerHTML('confirm_ok','确定提交')
                                return
                            }else{confirm_ok=0}
                        }
                        console.log(confirm_ok)
                        totem('0'+id,petId,petName,item)
                    }
                })
            }
        }
    }
    if(auto_mode && rebirth_count[0]<rebirth_count[1]){
        continue_after_rebirth_over=0
        page_text=await rebirth()
        if(!page_text){return false}
        if(rebirth_count[0]==rebirth_count[1]){return '重生足够'}
        count--
    }
  }
    if(auto_mode){
        console.log('**放生**\n',page_text)
        getHttpResponseAsync(newUrl('/pet/sell.asp?sid=','&petId='+petId))
        return '放生'
    }
}

async function rebirth(count=1,task_mode=false){
    if(task_mode){
        petId=New_getValue('rebirth15_auto_petId')
        rebirth_count=New_getValue('record_rebirth_count',[0,5])
    }

    let post_text='&petId='+petId+'&xtime='+(new Date).getTime()
    let url=newUrl('/pet/rebirth1.asp?sid=')+post_text
    let page_text=task_mode?getHttpResponseAsync(newUrl('/pet/petInfo.asp?sid=','&petId='+petId)):document.documentElement.outerHTML

    if(page_text.match(/成长率:\d+0\(★★★★★\)/)){
        if(task_mode || confirm_ok==0){
            setIdinnerHTML('confirm_ok','确认重生')
            return
        }else{confirm_ok=0}
    }
    for(let i=1;i<=count;i++){
        var text=getHttpResponseAsync(url,0,1)
        if(text.match('需要物品不足')){
            setIdinnerHTML('rebirth','重生丹不足');break
        }else if(text.match('重生失败')){
            setIdinnerHTML('rebirth','重生失败');console.log(text);break
        }
        let newinfo=text.match(/等级.*?重生<\/a>/)
        if(!newinfo){continue}
        newinfo=newinfo[0]
        rebirth_count[0]++
        New_setValue('record_rebirth_count',rebirth_count)
        setIdinnerHTML('today_rebirth',rebirth_count[0])
        setIdinnerHTML('petInfo','<br>'+newinfo)
        if(newinfo.match(/成长率:\d+0\(★★★★★\)/)){break}
        await sleep(100)
    }
    if(task_mode){return}
    if(href.match('/pet/petInfo|pet/rebirth1Res')){auto_totem(document.querySelector('.gaps.normal').innerHTML)}
    if(document.getElementById('rebirth')){
        document.getElementById('rebirth').onclick=()=>{rebirth(1)}
        document.getElementById('rebirth5').onclick=()=>{rebirth(5)}
        document.getElementById('rebirth15').onclick=()=>{rebirth(15)}
        document.getElementById('confirm_ok').onclick=()=>{setIdinnerHTML('confirm_ok','');confirm_ok=1}
    }
    return text
}

async function totem(id,petId,petName,item){
    let url=fenqu+'/totem/submit.asp?sid='+sid+'&id='+id+'&petId='+petId
    var totem_completed=New_getValue('record_totem_completed',{})
    let text=getHttpResponseAsync(url)
    if(text.match('成功提交')){
        setIdinnerHTML('totem_result','成功提交')
        return true
    }else if(text.match('提交次数已达到最大')){
        if(!totem_completed[petName]){totem_completed[petName]=[]}
        totem_completed[petName].push(item)
        New_setValue('record_totem_completed',totem_completed)
        setIdinnerHTML('totem_result','该图鉴已满')
        console.log(`${petName}-${item}-图鉴已满`)
        return 'complete'
    }else if(text.match('背包容量不足')){
        setIdinnerHTML('totem_result','背包容量不足');return false
    }else if(text.match('争霸赛')){
        getHttpResponseAsync(newUrl('/pcompete/teamRemove.asp?sid=')+'&petId='+petId)
        return await totem(id,petId,petName,item)
    }else{setIdinnerHTML('totem_result','发生错误');console.log(text);return false}
}

async function enhancePet(PetId,item,CurrentValue){
    let all_item=[,'气血','速度','物攻','法攻','物防','法防']
    let resultId='addResult'
    let best=100
    if(!CurrentValue){
        if(Object.keys(main_pet_value).length==0){[main_pet_value,nothing,all_star]=await ouputPetInfo(PetId)}
        let best_item=null
        if(typeof(item)=='object'){
            
            var [second_pet,item,item_value,needExp]=item
            var second_pet_value={[item]: item_value}
            let index=all_item.indexOf(item);if(index>3){index--}
            let star=all_star[index]
            console.log(all_star,index,star,item_value,main_pet_value[item])
            best=0
            if(star>3){best=50}else if(star>=4){best>200}
            if(item_value-main_pet_value[item]>best){best_item=item}
        }else{
            var second_pet=item
            var [second_pet_value,needExp]=await ouputPetInfo(second_pet)
            console.log(main_pet_value,second_pet_value)
            
            for(let item in main_pet_value){
                if(refine_items.indexOf(item)<0 || !second_pet_value[item]){console.log('跳过'+item);continue}
                let diff=second_pet_value[item]-main_pet_value[item]
                if(diff>best){best=diff;best_item=item}
            }
        }
        if(item.length>10){resultId='result_'+item}
        if(best_item==null){setIdinnerHTML(resultId,'资质差距未超过'+best);return}
        if(needExp){if(!await addPetExp(second_pet,needExp,resultId)){return}}
        console.log(best_item+'炼妖',main_pet_value[best_item],second_pet_value[best_item])
        getHttpResponseAsync(newUrl('/refine/selectRefineType.asp?sid=','&type='+all_item.indexOf(best_item)))
        getHttpResponseAsync(newUrl('/refine/selectRefinePet.asp?sid=','&petId='+PetId+'&petType=0'))
        let text=getHttpResponseAsync(newUrl('/refine/selectRefinePet.asp?sid=','&petId='+second_pet+'&petType=1'))
        if(text.match('幻兽身上还有战灵')){setIdinnerHTML(resultId,'幻兽身上还有战灵');return}
        text=getHttpResponseAsync(newUrl('/refine/refine.asp?sid='))
        console.log(text)
        let result=text.match(/>([^>]+资质[+-]\d+)/)[1]
        setIdinnerHTML(resultId,result)
        let value=result.match(/\d+/)[0]-0
        if(result.match('-')){main_pet_value[best_item]-=value}else{main_pet_value[best_item]+=value}
        return
    }
    var canUsePetInfo=[]
    let itemid='value_'+item
    let star=get_pet_star(document.getElementById(itemid).innerText)[0]

    let url_type=fenqu+'/refine/selectRefineType.asp?sid='+sid+'&type='+all_item.indexOf(item)
    canUsePetInfo=await getCanUsePetInfo()

    if(typeof(canUsePetInfo)=='number'){
        if(canUsePetInfo>0){canUsePetInfo=await openPetBall(canUsePetInfo,item,CurrentValue,star<4?1:50)}
        else{console.log('幻兽栏空间不足');setIdinnerHTML(resultId,'幻兽栏空间不足');return}
    }
    canUsePetInfo.sort((a,b)=>a[item]-b[item])
    console.log(canUsePetInfo)
    
    
    for(let usePet of canUsePetInfo){
        if(usePet.useto.indexOf(item)>=0){
            if(star==5){addIdinnerHTML(resultId,' 五星资质，不建议一键炼妖');return}
            let diff=star<4?1:50
            if(usePet[item]-CurrentValue<diff){
                nouse_petId.push(usePet.petId)
                console.log('资质差距小于'+diff)
                continue
            }
            else{
                if(usePet.needExp>0){
                    if(!await addPetExp(usePet.petId,usePet.needExp)){return}
                }
            }
            getHttpResponseAsync(url_type)
            getHttpResponseAsync(fenqu+'/refine/selectRefinePet.asp?sid='+sid+'&petId='+PetId+'&petType=0')
            getHttpResponseAsync(fenqu+'/refine/selectRefinePet.asp?sid='+sid+'&petId='+usePet.petId+'&petType=1')
            let text=getHttpResponseAsync(fenqu+'/refine/refine.asp?sid='+sid)
            let new_value=text.match(eval(`/${item}资质:[^<]+/`))[0]
            setIdinnerHTML(itemid,new_value)
            star=get_pet_star(new_value)
            //console.log(text)
            if(document.getElementById(resultId).innerHTML){
                addIdinnerHTML(resultId,' '+text.match(/..资质([+-]\d+)/)[1])
            }else{
                setIdinnerHTML(resultId,text.match(/..资质[+-]\d+/))
            }
        }else{
            nouse_petId.push(usePet.petId)
            for(let i=0;i<usePet.useto.length;i++){setIdinnerHTML(usePet.useto[i],'建议提升'+usePet.useto[i])}
        }
        await sleep(1)
    }
}

async function getCanUsePetInfo(){
    let url_allPet=fenqu+'/pet/index.asp?sid='+sid+'&type=0'
    var canUsePetInfo=[]
    var canUse_petId=[]
    var freeSpace=0
    let text=getHttpResponseAsync(url_allPet)
    let canUsePet=text.match(/href=[^>]+>[^神·\-(绝版)(采矿)(螳螂)<]+<\/a>\((\d|10)级\)/g)
    if(canUsePet){
        for(let url of canUsePet){
            let petId=url.match(/petId=(\w+)/)[1]
            if(nouse_petId.indexOf(petId)==-1){canUse_petId.push(petId)}
        }
    }
    let petSpace=text.match(/幻兽栏空间:(\d+)\/(\d+)/)
    freeSpace=petSpace[2]-petSpace[1]

    for(let petId of canUse_petId){
        let text=getHttpResponseAsync('/pet/petInfo.asp?sid=','&petId='+petId)
        let petInfo=await ouputPetInfo(text,petId)
        if(petInfo){canUsePetInfo.push(petInfo)}
    }
    if(canUsePetInfo.length){return canUsePetInfo}else{console.log('没有可用的副宠,可用空间:'+freeSpace);return freeSpace}
}

function get_needExp(text,petLevel){
    let expList=[,0,10,25,45,71,103,142,187,238,293]
    if(!petLevel){petLevel=text.match(/等级:(\d+)/)[1]}
    if(petLevel-10<0){
        let expValue=text.match(/经验:(\d+)/)[1]
        var needExp=293-expList[petLevel]-expValue
    }else{var needExp=0}
    return needExp
}

function get_pet_star(text){
    let all_star=text.match(/([★☆]+)/g)
    let all_grade=[]
    for(let star of all_star){
        let grade=star.replaceAll('★','1+').replace('☆','0.5')
        if(grade.endsWith('+')){grade=grade.slice(0,-1)}
        all_grade.push(eval(grade))
    }
    return all_grade
}

async function ouputPetInfo(text,petId){
    let onetime_mode=false
    if(!petId){onetime_mode=true;petId=text;text=getHttpResponseAsync(newUrl('/pet/petInfo.asp?sid=','&petId='+petId+'&type=0'))}
    
    let all_level=text.match(/.{2}资质:\d+/g)
    let petName=text.match(/>([^(<>]+)\(.族/)[1]
    let needExp=get_needExp(text)
    let PetInfo={}
    //let maxLevel=[];let maxValue=0
    for(let i=0;i<all_level.length;i++){
        let item=all_level[i].split('资质:')[0]
        let value=all_level[i].split('资质:')[1]
        PetInfo[item]=value
        //if(value-maxValue>0){maxValue=value;maxLevel=[item]}else if(value-maxValue==0){maxLevel.push(item)}
    }
    
    if(onetime_mode){
        let all_star=get_pet_star(text)
        return [PetInfo,needExp,all_star]
    }

    if(text.match(/成长率:\d+0\(★★★★★\)/)){return}
    let all_level_value=Object.values(PetInfo).sort().reverse()
    let maxLevel=all_level_value[0]
    let useto=[]
    for(let i in PetInfo){
        if(maxLevel-PetInfo[i]<100 || PetInfo[i]==all_level_value[1]){useto.push(i)}
    }
    PetInfo.useto=useto
    PetInfo.petId=petId
    PetInfo.Name=petName
    PetInfo.needExp=needExp
    //PetInfo.maxLevel=maxLevel
    return PetInfo
}

async function get_all_pet_value(){
    function get_pet_value(petId){
        let petInfo=getHttpResponseAsync('/handbook/showDetail.asp?sid=','&petId='+petId)
        if(petInfo.match('尚未解锁')){return [0,0]}
        let pet={
            气血: petInfo.match(/气血资质:(\d+)/)[1],
            物攻: petInfo.match(/物攻资质:\d+/)?petInfo.match(/物攻资质:(\d+)/)[1]:0,
            法攻: petInfo.match(/法攻资质:\d+/)?petInfo.match(/法攻资质:(\d+)/)[1]:0,
            物防: petInfo.match(/物防资质:(\d+)/)[1],
            法防: petInfo.match(/法防资质:(\d+)/)[1],
            速度: petInfo.match(/速度资质:(\d+)/)[1]
        }
        if(pet.物攻==0){delete pet.物攻}else{delete pet.法攻}
        return [petInfo.match(/>([^<]+)\(.族/)[1],pet]
    }
    let all_pet={}
    //for(let i=1;i<58;i++){
    for(let i of [17,41]){
        let petId='zh'+i.toString().padStart(3,0)
        let [name,value]=get_pet_value(petId)
        if(name){
            all_pet[name]=value
        }else{
            all_pet[petId]='未解锁'
        }
    }
    console.log(JSON.stringify(all_pet))
    //console.log(all_pet)
}

async function addPetExp(petId,num,resultId,force=false){
    console.log('增加经验'+num)
    let url=fenqu+'/exppool/addExp.asp?sid='+sid+'&petId='+petId
    let text=postHttpResponseAsync(url,'exp='+num+'&randNUm=1670168060057')
    if(text.match('分配成功')){return text}
    else if(text.match('化仙池经验不足')){
        let result=await auto_exppool()
        if(!result && resultId){
            if(force){
                let text=getHttpResponseAsync(newUrl('/exppool/usePill.asp?sid='))
                if(text.match('使用成功')){
                    setIdinnerHTML(resultId,text.match(/(经验池增加\d+点经验值)/)[1])
                    text=postHttpResponseAsync(url,'exp='+num+'&randNUm=1670168060057')
                    if(text.match('分配成功')){return text}
                }else{setIdinnerHTML(resultId,'使用失败')}
            }else{
                setIdinnerHTML(resultId,'化仙池经验不足 <a id=usePill href="javascript:;">使用化仙丹</a>')
                sleep(50).then(()=>{
                    document.getElementById('usePill').onclick=()=>{
                        let text=getHttpResponseAsync(newUrl('/exppool/usePill.asp?sid='))
                        if(text.match('使用成功')){setIdinnerHTML(resultId,text.match(/(经验池增加\d+点经验值)/)[1])}else{setIdinnerHTML(resultId,'使用失败')}
                    }
                })
            }
        }
        return false
    }
    else if(text.match('超过用户等级的限制值')){return 0}
    else{console.log(text);return false}
}

async function openPetBall(num=0,IdorItem,CurrentValue,diff){
    if(typeof(IdorItem)=='number'){var id=IdorItem}else{var item=IdorItem}
    var canUsePetInfo=[]
    
    if(Object.keys(eggInfo).length==0){
      all_pet={
        "血螳螂":{"气血":"692","物攻":"1026","物防":"768","法防":"598","速度":"864"},
        "小黑鼠":{"气血":"672","物攻":"842","物防":"842","法防":"801","速度":"970"},
        "大黄蜂":{"气血":"915","物攻":"672","物防":"498","法防":"1011","速度":"842"},
        "毒毛虫":{"气血":"672","物攻":"1011","物防":"760","法防":"590","速度":"842"},
        "追风狼":{"气血":"692","物攻":"864","物防":"864","法防":"822","速度":"994"},
        "獠牙猪":{"气血":"915","物攻":"672","物防":"1094","法防":"421","速度":"842"},
        "羽精灵":{"气血":"952","法攻":"692","物防":"432","法防":"1124","速度":"864"},
        "怒冠鸟":{"气血":"672","法攻":"1011","物防":"598","法防":"760","速度":"842"},
        "黑灵鸟":{"气血":"915","法攻":"672","物防":"1011","法防":"498","速度":"842"},
        "采矿猴":{"气血":"771","物攻":"1154","物防":"856","法防":"673","速度":"963"},
        "弑魂蚁":{"气血":"1033","物攻":"752","物防":"557","法防":"1130","速度":"941"},
        "吞岩兽":{"气血":"1033","物攻":"752","物防":"1223","法防":"470","速度":"941"},
        "大嘴蛇":{"气血":"752","物攻":"941","物防":"941","法防":"893","速度":"1082"},
        "厚甲龟":{"气血":"1061","法攻":"771","物防":"1154","法防":"579","速度":"963"},
        "巨齿鳄":{"气血":"752","法攻":"941","物防":"893","法防":"941","速度":"1082"},
        "水草兽":{"气血":"1033","法攻":"752","物防":"557","法防":"1130","速度":"941"},
        "蓝灵鱼":{"气血":"692","法攻":"1026","物防":"598","法防":"768","速度":"864"},
        "苍山鹫":{"气血":"1140","法攻":"829","物防":"1247","法防":"621","速度":"1038"},
        "血蝙蝠":{"气血":"829","法攻":"1247","物防":"728","法防":"937","速度":"1038"},
        "雷翼雕":{"气血":"849","法攻":"1060","物防":"1009","法防":"1060","速度":"1220"},
        "荒原豹":{"气血":"829","物攻":"1038","物防":"1038","法防":"987","速度":"1196"},
        "紫雾虫":{"气血":"1168","物攻":"849","物防":"638","法防":"1270","速度":"1060"},
        "巨甲虫":{"气血":"1140","物攻":"829","物防":"1349","法防":"519","速度":"1038"},
        "沼泽蛙":{"气血":"1140","法攻":"829","物防":"519","法防":"1349","速度":"1038"},
        "水蜥蜴":{"气血":"1140","法攻":"829","物防":"1247","法防":"621","速度":"1038"},
        "落日豚":{"气血":"906","法攻":"1144","物防":"1076","法防":"1144","速度":"1316"},
        "双吻鱼":{"气血":"906","法攻":"1374","物防":"802","法防":"1032","速度":"1144"},
        "大钳蟹":{"气血":"1245","法攻":"906","物防":"1374","法防":"678","速度":"1144"},
        "海龙鱼":{"气血":"1284","法攻":"933","物防":"577","法防":"1516","速度":"1155"},
        "飞泪蝶":{"气血":"906","物攻":"1144","物防":"1144","法防":"1076","速度":"1316"},
        "风雷蛛":{"气血":"906","物攻":"1374","物防":"1032","法防":"802","速度":"1144"},
        "落魂兽":{"气血":"1284","物攻":"933","物防":"1516","法防":"577","速度":"1155"},
        "幻灵狐":{"气血":"1245","物攻":"906","物防":"678","法防":"1374","速度":"1144"},
        "巡游使":{"气血":"990","法攻":"1239","物防":"1178","法防":"1239","速度":"1426"},
        "半龙羽":{"气血":"990","法攻":"1487","物防":"868","法防":"1117","速度":"1239"},
        "蚀骨狼":{"气血":"990","物攻":"1239","物防":"1239","法防":"1178","速度":"1426"},
        "龙翼兽":{"气血":"1009","物攻":"1510","物防":"1131","法防":"880","速度":"1260"},
        "龙魂龟":{"气血":"1388","法攻":"1009","物防":"1510","法防":"758","速度":"1260"},
        "雪人怪":{"气血":"1360","法攻":"990","物防":"619","法防":"1609","速度":"1239"},
        "冰晶猿":{"气血":"1360","物攻":"990","物防":"1609","法防":"619","速度":"1239"},
        "噬天虎":{"气血":"1360","物攻":"990","物防":"741","法防":"1487","速度":"1239"},
        "双头雕":{"气血":"1074","法攻":"1344","物防":"1275","法防":"1344","速度":"1545"},
        "龙吼鸟":{"气血":"1476","法攻":"1074","物防":"1613","法防":"796","速度":"1344"},
        "黑灵虎":{"气血":"1476","物攻":"1074","物防":"796","法防":"1613","速度":"1344"},
        "巨盾兽":{"气血":"1476","物攻":"1074","物防":"1746","法防":"672","速度":"1344"},
        "金甲虫":{"气血":"1074","物攻":"1613","物防":"1211","法防":"941","速度":"1344"},
        "幽冥蚁":{"气血":"1074","物攻":"1344","物防":"1344","法防":"1275","速度":"1545"},
        "半人鱼":{"气血":"1476","法攻":"1074","物防":"672","法防":"1746","速度":"1344"},
        "圣晶怪":{"气血":"1074","法攻":"1613","物防":"941","法防":"1211","速度":"1344"},
        "软泥虫":{"气血":"1591","物攻":"1158","物防":"1882","法防":"724","速度":"1449"},
        "逐浪鲨":{"气血":"1158","物攻":"1449","物防":"1449","法防":"1377","速度":"1668"},
        "啸海螺":{"气血":"1591","法攻":"1158","物防":"1739","法防":"867","速度":"1501"},
        "浴火龟":{"气血":"1619","物攻":"1177","物防":"884","法防":"1762","速度":"1470"},
        "幻光兔":{"气血":"1591","法攻":"1158","物防":"724","法防":"1864","速度":"1449"},
        "飞翼蛇":{"气血":"1158","物攻":"1739","物防":"1306","法防":"1015","速度":"1449"},
        "九霄鹰":{"气血":"1158","法攻":"1449","物防":"1377","法防":"1449","速度":"1668"},
        "圣灵蚁":{"气血":"1177","法攻":"1762","物防":"1027","法防":"1320","速度":"1470"}
      }
        var allBall=[]
        for(let pagenum of [1,2,3,4]){
            let url=fenqu+'/pack/index.asp?sid='+sid+'&bagType=2&pageNo='+pagenum
            let text=getHttpResponseAsync(url)
            let Balls=text.match(/id=eg\d+[^<]+精灵球<\/a>×\d+/g)
            if(Balls){
                allBall=[...allBall,...Balls]
            }else{break}
        }
        let maxnum=0
        let maxnum_id=[]
        for(let i=0;i<allBall.length;i++){
            let eggid=allBall[i].match(/id=(eg\d+)/)[1]
            let eggname=allBall[i].match(/>(.*?)精灵球/)[1]
            let eggnum=parseInt(allBall[i].match(/×(\d+)/)[1])
            if(eggInfo[eggname]){
                eggnum+=eggInfo[eggname].num
            }
            eggInfo[eggname]={id:eggid,num:eggnum}
            if(eggnum-maxnum>0){maxnum_id=[eggid];maxnum=eggnum}else if(eggnum-maxnum==0){maxnum_id.push(eggid)}
        }
        console.log(eggInfo)
    }

    var openid={}
    if(id){
        openid[id]=num
    }else if(item){
        if(pets_name.length==0){pets_name=Object.keys(eggInfo).sort((a,b)=>(all_pet[b][item] || 0)-(all_pet[a][item] || 0))}
        console.log(pets_name)
        for(let name of pets_name){
            let petinfo=eggInfo[name]
            if(all_pet[name][item]-CurrentValue>diff){
                if(num-petinfo.num<=0){
                    openid[petinfo.id]=num
                    break
                }else{
                    openid[petinfo.id]=petinfo.num
                    num=num-petinfo.num
                }
            }
        }
    }else{openid[maxnum_id[0]]=num}
    
    for(let id of Object.keys(openid)){
        num=openid[id]
        console.log('准备打开'+id)
        for(let i=0;i<num;i++){
            let url_open=fenqu+'/pack/openPetBall.asp?sid='+sid+'&id='+id
            let text=getHttpResponseAsync(url_open)
            
            if(text.match('空间不足')){
                i=num;console.log('没有足够空间')
            }else if(text.match('打开数量不符合')){
                let name=Object.keys(eggInfo).filter(name=>eggInfo[name].id==id)
                delete eggInfo[name]
                pets_name=pets_name.filter(pet=>pet!=name)
            }else{
                let petId=text.match(/petId=(\w+)/)[1]
                let newPetInfo=await ouputPetInfo(text,petId)
                if(newPetInfo){canUsePetInfo.push(newPetInfo)}
                
            }
        }
    }
    return canUsePetInfo
}

async function auto_bground(){
    if(datetime<New_getValue('next_bground') || timenow < '09:00'){return}
    let bgid=New_getValue('record_bground_bgid')
    if(!bgid){
        bgid=myInfo.Lv()>39?2:1
        New_setValue('record_bground_bgid',bgid)
    }
    let armyId=New_getValue('bground_armyId',1)
    var url=fenqu+'/bground/apply.asp?sid='+sid+'&bgid='+bgid+'&armyId='+armyId
    var text=getHttpResponseAsync(url)

    while(!text.match('报名成功')){
        if(text.match('只能报名人数少的一队')){
            url=fenqu+'/bground/apply.asp?sid='+sid+'&bgid='+bgid+'&armyId='+(armyId=armyId==1?0:1)
        }else if(text.match('你的等级不足')){
            bgid=myInfo.Lv()>39?2:1
            New_setValue('record_bground_bgid',bgid)
            url=fenqu+'/bground/apply.asp?sid='+sid+'&bgid='+bgid+'&armyId='+armyId
        }else if(text.match('手机号码')){
            New_setValue('next_bground',getdatetime(1))
            return
        }else{
            break
        }
        text=getHttpResponseAsync(url)
    }
    if(text.match(/报名成功|今天你已报名战场/)){
        console.log('战场报名成功')
        New_setValue('next_bground',getdate(1)+' 09:00')
    }else if(text.match('不是报名时间')){
        New_setValue('next_bground',getdate(1)+' 09:00')
    }
    let page_url=fenqu+'/bground/index.asp?sid='+sid+'&bgid='+bgid
    let page_text=getHttpResponseAsync(page_url)
    let hasAward=page_text.match(/(?<=href=.)[^'"]+(?=.>领取奖励)/g)
    if(hasAward){
        for(eachAward of hasAward){
            let award_url=eachAward.replaceAll('&amp;','&')
            let award_text=getHttpResponseAsync(award_url)
        }
    }
}

function transfer_time(text,part=3){
    if(typeof(text)=='string'){
        let time=text.match(/(^|\D)+((\d+)时)?((\d+)分)?((\d+)秒)?/)
        let sec=0
        sec+=time[2]?time[3]*3600:0
        sec+=time[4]?time[5]*60:0
        sec+=time[6]?time[7]-0:0
        return sec
    }else{
        let [hour,min,sec]=gettime(0,0,text,0).split(/:|\./)
        let time=''
        time+=hour-0?hour-0+'时':''
        if(time && part==1){return time}
        time+=min-0?min-0+'分':''
        if(time && part<=2){return time}
        time+=sec-0?sec-0+'秒':''
        return time
    }
}

async function auto_transport(){
    if(timenow<'07:00' || running_task.押镖){return}
    replaceHTML('押镖活动</a>','押镖活动</a> <span id=transport_state></span>')
    let retry=30
  while(retry-->0){
   try{
    if(timenow<'07:00'){break}
    running_task.押镖=true
    let wait_time=timeDelta(New_getValue('next_transport'))
    if(wait_time>72e5){break}
    if(wait_time){
        setIdinnerHTML('transport_state','(等待'+transfer_time(wait_time/1000)+')')
        if(New_getValue('auto_refresh_switch') && wait_time/1000>New_getValue('auto_refresh_time',20)*60){console.log('押镖: 等待时间大于刷新时间，不等待');break}
        console.log('押镖: 等待'+wait_time/1000+'秒')
        await sleep(wait_time)
    }

    let trans_text=getHttpResponseAsync(newUrl('/transport/index.asp?sid='))

    if(trans_text.match(/领取完成押镖奖励<\/a><img/)){
        let url=fenqu+'/transport/takeSendAwards.asp?sid='+sid
        getHttpResponseAsync(url)
    }
    if(trans_text.match(/领取押镖奖励<\/a><img/)){
        let url=fenqu+'/transport/awardIndex.asp?sid='+sid
        let award_text=getHttpResponseAsync(url)
        let award_text1=award_text.split('成功劫镖3次')[0]
        let award_text2=award_text.split('成功劫镖3次')[1]
        let values1=award_text1.match(/(?<=;value=)\d+/g)
        let values2=award_text2.match(/(?<=;value=)\d+/g)
        if(values1){
            for(let value of values1){
                let url=fenqu+'/transport/takeDaySendAward.asp?sid='+sid+'&value='+value
                getHttpResponseAsync(url)
            }
        }
        if(values2){
            for(let value of values2){
                let url=newUrl('/transport/takeDayRobAward.asp?sid=')+'&value='+value
                getHttpResponseAsync(url)
            }
        }
    }

    let left_time_text=trans_text.match(/押送中(\(剩.*?\))/)
    if(left_time_text){
        let left_time=left_time_text[1]
        setIdinnerHTML('transport_state',left_time)
        let wait_time=transfer_time(left_time)
        New_setValue('next_transport',getdatetime(0,0,wait_time))
        if(New_getValue('auto_refresh_switch') && wait_time/1000>New_getValue('auto_refresh_time',20)*60){console.log('押镖: 等待时间大于刷新时间，不等待');break}
        console.log('押镖:等待'+wait_time+'秒')
        await sleep(wait_time*1000)
        retry++
        continue
    }

    let remain_rob=trans_text.match(/今日劫镖次数:(\d+)\/(\d+)/)
    let no_rob=remain_rob[1]==remain_rob[2]
    let wait_rob=300
    if(!no_rob){
        let rob=trans_text.match(/采矿猴.((\d+分)?(\d+秒)?).*?;id=(\w+).>劫镖</)
        if(rob){
            wait_rob=transfer_time(rob[1])
            console.log('劫镖: 下次劫镖在',getdatetime(0,0,wait_rob))
            getHttpResponseAsync(newUrl('/transport/rob.asp?sid=')+'&id='+rob[4])
        }
    }

    let sender=New_getValue('auto_transport','["已关闭"]')
    if(sender[0] != '已关闭'){
        let send_text=getHttpResponseAsync(newUrl('/transport/sendIndex.asp?sid='))
        let left_count=send_text.match(/今日押镖次数:(\d+)\/(\d+)/)
        if(left_count[2] == left_count[1]){
            setIdinnerHTML('transport_state','押镖次数达到上限'+left_count[2]+'次')
            let next_transport=no_rob?getdate(1)+' 07:00':getdatetime(0,0,wait_rob)
            New_setValue('next_transport',next_transport)
            break
        }
        let current=send_text.match(/当前镖师:([^(]+)/)
        if(!current){console.log(send_text);break}
        current=current[1]
        console.log(current)
        let max_use=New_getValue('auto_transport_max_use_dianquan',0)
        let used=0
        while(sender.indexOf(current) < 0 && max_use > 0){
            max_use-=50
            used+=50
            await sleep(100)
            send_text=getHttpResponseAsync(newUrl('/transport/resetSend.asp?sid='),'',no_retry=1)
            console.log(send_text)
            if(send_text.match('点券不足')){
                setIdinnerHTML('transport_state','点券不足')
                New_setValue('next_transport',getdatetime(0,10))
                break
            }
            current=send_text.match(/当前镖师:([^(]+)/)[1]
        }
        if(sender.indexOf(current) < 0){
            if(used > 0){
                setIdinnerHTML('transport_state','使用'+used+'点券未刷出'+sender)
            }else{
                setIdinnerHTML('transport_state','点券使用为0, 请更改设置')
            }
        }else{
            let id=send_text.match(/;id=(\d+).>开始押送/)
            if(id){
                let result_text=getHttpResponseAsync(newUrl('/transport/send.asp?sid=')+'&id='+id[1])
                setIdinnerHTML('transport_state',current+'-开始押送(消耗'+used+'点券)')
                let time_list={'采矿猴': 20, '神火龙': 40, '暗螳螂': 60, '蜂将军': 3}
                console.log(result_text)
                New_setValue('next_transport',getdatetime(0,time_list[current]))
                await sleep(60000)
                continue
            }else{
                setIdinnerHTML('transport_state','未开始押送')
                break
            }
        }
    }else{
        setIdinnerHTML('transport_state','(未押镖)')
        break
    }
    
    New_setValue('next_transport',getdatetime(0,10))
   }catch{continue}
  }
    running_task.押镖=false
    
}

if(href.match('/dayconsume/index')){
    async function shownum(){
        await getHttpResponse(newUrl('/mall/index.asp?sid=')).then(text=>{
            setIdinnerHTML('remain',text.match(/点券:(\d+)/)[1])
            if(text.match('限时点券')){setIdinnerHTML('xianshi_remain','限时点券:'+text.match(/限时点券:(\d+)/)[1])}
        })
        
        for(let id of [1023,1112,1215,'kszb02']){
            await getHttpResponse(newUrl('/pack/thingInfo.asp?sid=','&id='+id)).then(text=>{
            setIdinnerHTML(id,text.match('×')?text.match(/×(\d+)/)[1]:0)
            })
        }
    }
    shownum()
    let consumed=outerHTML.match(/已消费(\d+)点券/)[1]-0
    let remain=1000-consumed
    let info={
        10: {price:100, id:1023, name:'战灵钥匙'},
        4: {price:60, id:1112, name:'镇妖符'},
        gz1001: {price:30, id:1215, name:'镐子'},
        kszb02: {price:380, name:'除妖令牌'}
    }
    let zhenyao=remain>info[4].price?Math.ceil(remain/(info[4].price+info['gz1001'].price)):0
    let chuyao=remain>info['kszb02'].price?Math.floor(remain/(info['kszb02'].price+info['gz1001'].price)):0
    let all_plan={
        plan1: {10: Math.ceil(remain/info[10].price)},
        plan2: {4: zhenyao, gz1001: Math.ceil((remain-zhenyao*info[4].price)/info['gz1001'].price)},
        plan3: {4: Math.ceil(remain/info[4].price)},
        plan4: {gz1001: Math.ceil(remain/info['gz1001'].price)},
        plan5: {kszb02: chuyao, gz1001: Math.ceil((remain-chuyao*info['kszb02'].price)/info['gz1001'].price)}
    }
    let plan_text=''
    for(let plan in all_plan){
        let plan_info=all_plan[plan]
        let items=[]
        let all_price=0
        for(let item in plan_info){
            let count=plan_info[item]
            items.push(`${info[item].name}x${count}`)
            all_price+=info[item].price*count
        }
        plan_text+=`${items.join(', ')} (${all_price}点券) <a class=buy1000 id=${plan} href="javascript:;">购买</a><br>`
    }

    plan_text+=`----------------------------------<br>
    剩余点券:<span id=remain></span> <span id=xianshi_remain></span><br>
    战灵钥匙:<span id=1023> </span>个 镇妖符:<span id=1112> </span>个 镐子:<span id=1215> </span>个 除妖令牌:<span id=kszb02> </span>个<br>`
    replaceHTML(/已消费(\d+)点券<br>/,'<span id=result>已消费$1点券</span><br>'+plan_text)

    for(let item of document.getElementsByClassName('buy1000')){
        let id=item.id
        document.getElementById(id).onclick=()=>{
            let result=''
            for(let itemId in all_plan[id]){
                let count=all_plan[id][itemId]
                console.log(newUrl('/mall/buy.asp?sid=','&type=0'),`count=${count}&id=${itemId}`)
                result+=postHttpResponseAsync(newUrl('/mall/buy.asp?sid=','&type=0'),`count=${count}&id=${itemId}`)
                consumed+=info[itemId].price*count
                let countId=info[itemId].id||itemId
                setIdinnerHTML(countId,document.getElementById(countId).innerHTML-0+count)
            }
            console.log(result)
            setIdinnerHTML('result',`已消费${consumed}点券 <label style="color:red;">已购买`+result.match(/(\[.*?\]×\d+)/g).join(' ')+'</label>')
            auto_get_dayconsume_award(force=1)
            replaceHTML(/(今日消费1000点券[^<]+)未达到/,'$1已领取')
        }
    }
}

async function auto_get_dayconsume_award(force=0){
    if(!force && datetime<New_getValue('next_get_dayconsume_award')){return}
    let [activityId,page_text]=await get_activity('dayconsume')
    let ids=page_text.match(/awardId=\w+(?=.>领取<)/g)
    if(ids){
    for(let awardId of ids){
        let text=getHttpResponseAsync(newUrl('/dayconsume/award.asp?sid=')+'&activityId='+activityId+'&'+awardId)
        if(text.match('领取成功')){
            //let award=text.match(/已领取以下奖励:<br>/)
            replaceHTML(/(每日消费活动（\d+天）<\/a>)/,'$1 奖励已领取',!isHome)
        }
    }}
    New_setValue('next_get_dayconsume_award',getdatetime(0,10))
}

async function Smart_Contest(userId){
    function get_pet_value(petInfo){
        return {
            气血: petInfo.match(/(?<=气血:)\d+/)[0],
            物攻: petInfo.match(/(?<=物攻:)\d+/)?petInfo.match(/(?<=物攻:)\d+/)[0]:0,
            法攻: petInfo.match(/(?<=法攻:)\d+/)?petInfo.match(/(?<=法攻:)\d+/)[0]:0,
            物防: petInfo.match(/(?<=物防:)\d+/)[0],
            法防: petInfo.match(/(?<=法防:)\d+/)[0],
            速度: petInfo.match(/(?<=速度:)\d+/)[0]
        }
    }
    let user_info=getHttpResponseAsync(newUrl('/user/userInfo.asp?sid=')+'&userId='+userId)
    let petIds=user_info.match(/(?<=petId=)\w+/g)
    if(!petIds){console.log('对方无对战宠物');return true}
    let pets_value=[]
    for(let petId of petIds){
        let petInfo=getHttpResponseAsync(newUrl('/other/petInfo.asp?sid=')+'&petId='+petId+'&userId='+userId)
        let pet_value=get_pet_value(petInfo)
        pets_value.push(pet_value)
    }

    let my_petIds=getHttpResponseAsync(newUrl('/pet/battleTeam.asp?sid=')).match(/(?<=petId=)\w+/g)
    if(!my_petIds){console.log('我方未设置对战宠物');return false}
    my_petIds=Array.from(new Set(my_petIds))
    let my_pets_value=[]
    let index=0
    for(let petId of my_petIds){
        let petInfo=getHttpResponseAsync(newUrl('/pet/petInfo.asp?sid=')+'&petId='+petId)
        let pet_value=get_pet_value(petInfo)
        pet_value.index=index++
        pet_value.petId=petId
        my_pets_value.push(pet_value)
    }

    let pet_sequence=[]
    let best_index=0
    for(let pet_value of pets_value){
        let best=0
        for(let my_pet_value of my_pets_value){
            if(pet_sequence.indexOf(my_pet_value.index)>=0){continue}

            let my_attack=0
            if(my_pet_value.物攻){
                my_attack=my_pet_value.物攻/pet_value.物防
            }else{
                my_attack=my_pet_value.法攻/pet_value.法防
            }

            let my_defence=0
            if(pet_value.物攻){
                my_defence=pet_value.物攻/my_pet_value.物防
            }else{
                my_defence=pet_value.法攻/my_pet_value.法防
            }

            if(my_attack/my_defence > best){

                best=my_attack/my_defence
                pet_sequence[best_index]=my_pet_value.index
            }
        }
        best_index++
        
    }
    //console.log(pet_sequence)
    let target_index=0
    while(pet_sequence.length>0){
        let pet_index=pet_sequence[0]
        for(let i=pet_index;i>target_index;i--){
            getHttpResponseAsync(newUrl('/pet/topBattleSite.asp?sid=')+'&petId='+my_pets_value[pet_index].petId)
            console.log(`原${pet_index+1}号位宠物移动到${target_index+1}号位`)
            await sleep(10)
        }
        pet_sequence.shift()
        
        for(let i=0;i < pet_sequence.length;i++){
            if(pet_sequence[i]<pet_index){pet_sequence[i]++}
        }
        target_index++
    }
    return true
}

if(href.match('/pet/')){
  if(href.match('upBattleIndex.asp')){

  }
  if(href.match('battleTeam')){
    replaceHTML('<br><br>','<div id=team></div>')
    let team_num=outerHTML.match(/\d+号位/g).length
    let team_member=New_getValue('Second_Team',[])
    let team_text='备用战斗队伍: <a href="javascript:;" id=switch_team>交换队伍</a><br>'
    for(let i=1;i<=team_num;i++){
        let petInfo=''
        let pet=team_member[i-1]
        if(pet){
            petInfo+=`<a href="${newUrl('/pet/petInfo.asp?sid=')+'&petId='+pet.petId}">${pet.name}</a>(${pet.level}) <a href="javascript:;" id=upBattle_${i}>更换</a> <a href="javascript:;" id=downBattle_${i}>下阵</a>`
            
        }else{
            petInfo+=` <a href="javascript:;" id=upBattle_${i}>上阵</a>`
        }
        team_text+=`${i}号位:${petInfo}<br>`
    }
    setIdinnerHTML('team',team_text)
    for(let i=1;i<=team_num;i++){
        document.getElementById('upBattle_'+i).onclick=()=>{
            let text=getHttpResponseAsync(newUrl('/pet/index.asp?sid=')+'&type=0').split('羽族</a>')[1].split('幻兽栏空间')[0]
            text=`【选择备用${i}号位】`+text.replace(/(>([^<]+)<\/a>\((\d+级)\)[^<]+)<a href=[^>]+petId=(\w+)[^>]+>置顶/g,'$1<a href="javascript:;" title=$2_$3 id=$4 class=select>选择')
            document.querySelector('body').innerHTML=text
            let all_select=document.getElementsByClassName('select')

            for(let n=0;n<all_select.length;n++){
                all_select[n].onclick=()=>{
                    let name=all_select[n].title.split('_')[0]
                    let level=all_select[n].title.split('_')[1]
                    let petId=all_select[n].id
                    team_member[i-1]={name,level,petId}
                    New_setValue('Second_Team',team_member)
                    console.log(i+'号位设置为',{name,level,petId})
                }
            }
        }
    }
    clickRun('switch_team','switch_battleTeam()')
  }
}

async function switch_battleTeam(){
    let origin_battleTeam=New_getValue('origin_battleTeam',[])
    let battleTeam=getHttpResponseAsync(newUrl('/pet/battleTeam.asp?sid=')).match(/(?<=petId=)\w+/g)
    if(origin_battleTeam.length==0){
        origin_battleTeam=battleTeam
        New_setValue('origin_battleTeam',origin_battleTeam)
    }
    let isOrigin=true
    for(let i=0;i<battleTeam.length;i++){
        if(origin_battleTeam.indexOf(battleTeam[i])<0){
            isOrigin=false
            break
        }
    }
    let newTeam=[]
    if(isOrigin){
        let team_member=New_getValue('Second_Team',[])
        if(team_member){
            team_member.forEach(pet=>{newTeam.push(pet.petId)})
        }
        New_setValue('Current_Team','当前:副队伍')
        setIdinnerHTML('switch_team','交换队伍(当前:副队伍)')
    }else{
        newTeam=origin_battleTeam
        New_setValue('Current_Team','当前:主队伍')
        setIdinnerHTML('switch_team','交换队伍(当前:主队伍)')
    }
    for(let i=0;i<newTeam.length;i++){
        getHttpResponseAsync(newUrl('/pet/upBattle.asp?sid=')+'&petId='+newTeam[i]+'&index='+i)
    }
}

if(href.match('/dare/index.asp')){
    replaceHTML('排名挑战:',`排名挑战: <a href="javascript:;" id=switch_team>交换队伍(${New_getValue('Current_Team','未使用')})</a>`)
    clickRun('switch_team','switch_battleTeam()')
}

async function auto_copy_map(){
    if(timenow<'14:00' || datetime < New_getValue('next_check_copy_map','0')){new Task('福利副本',0,0,'超时').del();return}
    let id=outerHTML.match(/\/copy\/index.asp[^>]+;id=(\d+)/)
    if(!id){New_setValue('next_check_copy_map',getdate(1)+' 14:00');return}

    let maps=['铜钱','灵石','灵力','综合']
    let run_maps=New_getValue('run_copy_map',{})
    let index=parseInt((timenow.split(':')[0]-14)/2)

    if(index>3){new Task('福利副本',0,0,'超时').del();return}
    let map=maps[index]
    if(run_maps[map]==1){
        getHttpResponseAsync(newUrl('/copy/enterCopy.asp?sid=')+'&id='+(parseInt(id[1])+index))
        new Task('福利副本','auto_copy_map',"",'福利副本-'+map).add()
        await Worker_autonmap('/copy')
    }
    let hour=index==3?14:16+index*2
    let add_day=hour==14?1:0
    New_setValue('next_check_copy_map',getdate(add_day)+` ${hour}:00`)
}

async function auto_get_dianquan(){
    if(datetime<New_getValue('next_auto_get_dianquan')){return}
    let url=newUrl('/nov/index.asp?sid=')
    let text=getHttpResponseAsync(url)

    let ids=text.match(/id=\w+(?=["']>领取<)/g)
    if(ids){
    for(let id of ids){
        getHttpResponseAsync(newUrl('/nov/takeAward.asp?sid=')+'&'+id)
    }}
    New_setValue('next_auto_get_dianquan',getdatetime(0,10))
}

async function SwitchTopPet(){
    let text=getHttpResponseAsync(newUrl('/pet/battleTeam.asp?sid='))
    let petId=text.match(/topBattleSite[^<]+petId=(\w+)/)
    if(petId){
        getHttpResponseAsync(newUrl('/pet/topBattleSite.asp?sid=')+'&petId='+petId[1])
    }
}

async function auto_raffle(){
    if(New_getValue('next_raffle')>datetime){return}
    let text=getHttpResponseAsync(newUrl('/raffle/taskIndex.asp?sid='))
    let enhanceCount=text.match(/强化\D+(\d+)/)[1]
    if(enhanceCount<5){await auto_enhanceTask(5-enhanceCount)}
    let rebirth15_auto_petId=New_getValue('rebirth15_auto_petId')
    if(rebirth15_auto_petId){
        let rebirthCount=text.match(/重生\D+(\d+)/)[1]
        if(rebirthCount<15){await rebirth(15-rebirthCount,rebirth15_auto_petId,task_mode=true)}
    }
    get_raffle_award()
    New_setValue('next_raffle',getdatetime(4))
}

function get_raffle_award(text){
    if(!text){text=getHttpResponseAsync(newUrl('/raffle/taskIndex.asp?sid='))}
    let ids=text.match(/;id=\d+/g)
    if(ids){
        console.log('领取许愿任务')
        for(let id of ids){
            id=id.split('=')[1]
            getHttpResponseAsync(newUrl('/raffle/takeFreeCount.asp?sid=')+'&id='+id)
        }
    }
    text=getHttpResponseAsync(newUrl('/raffle/taskIndex.asp?sid='))
    setIdinnerHTML('raffle_task',text.replace(/.*(强化.*?)<br[^(]+br.*/,'$1<br><br>'))
}
if(href.match('/raffle/')){
    if(href.match('index.asp')){
        replaceHTML(/活动详情如下：.*?许愿任务<\/a><br>/,'<br><span id=raffle_task></span>')
        let text=getHttpResponseAsync(newUrl('/raffle/taskIndex.asp?sid='))
        get_raffle_award(text)
    }
    else if(href.match('takeFreeCountRes.asp')){
        replaceHTML('/taskIndex.asp','/index.asp')
    }
}

if(href.match('/clan')){
    replaceHTML(/<a[^<]+(解散|退出)联盟<\/a>/,'')

if(href.match('/clan/devoteIndex')){
    replaceHTML([
        [/(返回<\/a><br>)/,'$1<span id=result></span>'],
        [/((金袋|焚火晶).*?×(\d+).*?)<\/p>/g,'$1&emsp;<input type=button id=$2 title=$3 value="全部捐赠"></p>']
    ])

    let jindai=document.getElementById('金袋')
    jindai.onclick=()=>{
        let text=postHttpResponseAsync(newUrl('/clan/devote.asp?sid='),'count='+jindai.title+'&id=1116')
        addIdinnerHTML('result',text.match(/(感谢.*?)</)[1]+'<br>')
    }
    let fenhuojing=document.getElementById('焚火晶')
    fenhuojing.onclick=()=>{
        let text=postHttpResponseAsync(newUrl('/clan/devote.asp?sid='),'count='+fenhuojing.title+'&id=1120')
        addIdinnerHTML('result',text.match(/(感谢.*?)</)[1]+'<br>')
    }
}



if(href.match('/clanrace/teamList.asp')){
    replaceHTML([
        [/(>\.(\d+)\.(\d+)\.)(待命|已加入)&nbsp;[^>]+userId=(\d+)[^>]+/g,'$1<span id=state_$5>$4</span>&nbsp;<a class=join_clanrace id=$5_$2_$3 href="javascript:;"'],
        ['成员.等级.战力','成员.等级.战力 <a id=join_all href="javascript:;">一键加入</a>']
    ])
    for(let user of document.getElementsByClassName('join_clanrace')){
        
        let userId=user.id.split('_')[0]
        let teamId=user.id.split('_')[1][0]+'001'
        document.getElementById(user.id).onclick=()=>{
            let action=user.innerHTML
            if(action=='加入'){
                let text=getHttpResponseAsync(newUrl('/clanrace/teamAdd.asp?sid=')+'&teamId='+teamId+'&userId='+userId)
                if(text.match('已加入')){
                    setIdinnerHTML('state_'+userId,'已加入')
                    user.innerHTML='撤离'
                }else if(text.match('战队队员已满')){
                    setIdinnerHTML('state_'+userId,'战队队员已满')
                }
            }else{
                let text=getHttpResponseAsync(newUrl('/clanrace/teamRemove.asp?sid=')+'&userId='+userId+'&teamId='+teamId)
                if(text.match('成员已从')){
                    setIdinnerHTML('state_'+userId,'待命')
                    user.innerHTML='加入'
                }
            }
        }
    }
    sleep(50).then(()=>{
        document.getElementById('join_all').onclick=()=>{
            auto_teamList()
        }
    })
    if(href.match('teamId=')){
        replaceHTML(/(userId=(\d+)[^<]+teamId=(\d+)['"]>.<\/a>)<br>/g,'$1.<a class=team_remove id=remove_$2_$3 href="javascript:;">撤</a><br>')
        for(let user of document.getElementsByClassName('team_remove')){
            let userId=user.id.split('_')[1]
            let teamId=user.id.split('_')[2]
            document.getElementById(user.id).onclick=()=>{
                let text=getHttpResponseAsync(newUrl('/clanrace/teamRemove.asp?sid=')+'&userId='+userId+'&teamId='+teamId)
                location.reload()
            }
        }
    }
}
}

async function auto_statue(force=0){
    if(!force && (timenow < '07:00' || datetime<New_getValue('next_check_statue'))){return}
    let task_list=New_getValue(['record','statue_task_list'],{})
    if(task_list.length==0){return}

    let statue_end=getHttpResponseAsync(newUrl('/statue/pray.asp?sid=')).match('活动已结束')
    if(statue_end){
        getHttpResponseAsync(newUrl('/statue/takeRankAward.asp?sid='))
        New_setValue('next_check_statue',getdate(1))
        return
    }

    let page_statue=getHttpResponseAsync(newUrl('/statue/taskList.asp?sid='))

    for(let name in task_list){
        if(task_list[name]){continue}
        let regex=new RegExp(name+'[^(]+\\((\\d+)\\/(\\d+)')
        let left_count=page_statue.match(regex)
        left_count=left_count[2]-left_count[1]
        if(left_count==0){task_list[name]=1;continue}
        console.log(name)
        if(name=='捕捉球'){// || name=='小喇叭'
            let taskId=page_statue.match(/taskId=(\d+).>提交/)
            if(!taskId){continue}
            if(name=='捕捉球'){taskId=taskId[1].replace(/\d$/,'1')}else{taskId=taskId[1].replace(/\d$/,'6')}
            let post=postHttpResponseAsync(newUrl('/statue/handed.asp?sid=')+'&taskId='+taskId,'count='+left_count).match('提交成功')
            getHttpResponseAsync(newUrl('/statue/takeTaskAward.asp?sid=')+'&taskId='+taskId).match('奖励成功')

        }else if(name=='切磋'){
            await autocontest(left_count)

        }
        task_list[name]=1
    }

    page_statue=getHttpResponseAsync(newUrl('/statue/taskList.asp?sid='))

    let tasks=page_statue.match(/taskId=(\d+).>领取/g)

    if(tasks){
        for(let task of tasks){
            let taskId=task.match(/taskId=(\d+)/)[1]
            getHttpResponseAsync(newUrl('/statue/takeTaskAward.asp?sid=')+'&taskId='+taskId)
        }
    }
    
    for(let i=0;i<20;i++){
        let text=getHttpResponseAsync(newUrl('/statue/pray.asp?sid='))
        if(text.match('【随机盟】')){
            let familyId=text.match(/familyId=(\d+)/)[1]
            text=getHttpResponseAsync(newUrl('/statue/selectRivalFamily.asp?sid=')+'&familyId='+familyId)
            while(text.match('/statue/attack.asp')){
                text=getHttpResponseAsync(newUrl('/statue/attack.asp?sid='))
            }
            if(text.match('/statue/rob')){
                text=getHttpResponseAsync(newUrl('/statue/rob.asp?sid=')+'&type=1')
            }
        }
        if(text.match(/祈求次数不足|不是空闲状态|不能参与这次活动/)){break}
    }
    New_setValue(['record','statue_task_list'],task_list)
    New_setValue('next_check_statue',getdatetime(1))
}

if(href.match('/statue/index.asp')){
    replaceHTML(/(1.玩家需要完成.*?确定好所在盟<br><br>)/,'活动详情: <a id=view href="javascript:;">展开</a><br><span id=info hidden=true>$1</span> ')
    clickRun('view','document.getElementById("info").hidden=false')
    
}

async function use_HuoLiQuan(force=0){
    let fn_worker=['Worker_autonmap']
    if(running_task.活力泉){
        while(running_task.活力泉){await sleep(5000)}
        return
    }
    running_task.活力泉=true
    
    let HuoLiQuan_nodes=New_getValue(['record','HuoLiQuan_nodes'],{})
    if(HuoLiQuan_nodes=={}){console.log('无可用活力泉');running_task.活力泉=false;return false}

    if(!force && myInfo.Huoli() > 10){console.log('剩余活力大于10');running_task.活力泉=false;return false}

    let current=myInfo.City()
    let nearest=10
    let near_node=0
    for(let node in HuoLiQuan_nodes){
        if(HuoLiQuan_nodes[node].match('骰子:0个')){continue}
        let nodeId=node.split('node')[1]
        let distance=Math.abs(parseInt(nodeId/2)-current)
        if(distance<nearest){near_node=nodeId;nearest=distance}
    }
    if(near_node==0){console.log('无可用活力泉-骰子为0');running_task.活力泉=false;return false}
    let dest=parseInt(near_node/2)
    if(dest==0){dest=1}
    let all_maps=[].concat.apply([],Object.values(city_map))
    console.log(`前往-${Object.keys(city_map)[dest-1]}-${all_maps[near_node-1]}-浸泡活力`)
    let result=await movetown(dest)
    if(result=='level_over'){console.log('等级不足');delete HuoLiQuan_nodes['node'+near_node];New_setValue(['record','HuoLiQuan_nodes'],HuoLiQuan_nodes);running_task.活力泉=false;return false}
    getHttpResponseAsync(newUrl('/nmap/enterNode.asp?sid=')+'&nodeId='+near_node)
    let retry=15
    let text=''
    while(retry-- > 0){
        text=getHttpResponseAsync(newUrl('/nmap/event2.asp?sid='))
        let result=text.match(/成功|不足|当前不是泡温泉事件/)
        if(result){
            console.log(text)
            delete HuoLiQuan_nodes['node'+near_node]
            New_setValue(['record','HuoLiQuan_nodes'],HuoLiQuan_nodes)
            if(result[0]=='成功'){console.log('浸泡成功');Worker_autonmap('/nmap');return true}
            else if(result[0]=='不足'){console.log('浸泡失败, 骰子不足');running_task.活力泉=false;return false}
            else{console.log('当前不是泡温泉事件');running_task.活力泉=false;return false}
        }
    }
    console.log('浸泡异常\n',text)
    running_task.活力泉=false
    return false
}

async function auto_christmas(){
    if(datetime< New_getValue('next_christmas')){return}
    let [activityId,text]=await get_activity('christmas')
    
    let awards=text.match(/(?<=index=)\d(?=['"]>领取)/g)
    if(awards){
        for(let index of awards){
            console.log(getHttpResponseAsync(newUrl('/christmas/takeAward.asp?sid=')+'&activityId='+activityId+'&index='+index))
        }
    }
    New_setValue('next_christmas',getdatetime(0,30))
}

async function buy_compensation_award(){
    let text=getHttpResponseAsync('/mall/index.asp?sid=','&type=3')
    let max_page=text.match(/第\d+\/(\d+)页/)
    max_page=max_page?max_page[1]:1
    for(let i=1;i<=max_page;i++){
        if(i>1){text=getHttpResponseAsync('/mall/index.asp?sid=','&type=3&pageNo='+i)}
        let onecoin=text.match(/1铜钱[^>]+;id=(\w+)/)
        if(onecoin){
            console.log(postHttpResponseAsync(newUrl('/mall/buy.asp?sid=')+'&type=0','count=1&id='+onecoin[1]))
        }
    }
}

if(href.match('/honor/index.asp')){
    if(outerHTML.match('w.gif')){
        replaceHTML('【成就详情】','【成就详情】 <a id=take_all href="javascript:;">一键领取</a> <span id=result></span>')
        document.getElementById('take_all').onclick=async()=>{
            let types=outerHTML.match(/(?<=w.gif['"]>[^>]+type=)\d+/g)
            console.log(types)
            for(let type of types){
                let page=getHttpResponseAsync(newUrl('/honor/typeInfo.asp?sid=','&type='+type))

                let ids=page.match(/(?<=;id=)\d+(?=[^>]+>领取奖励)/g)

                for(let id of ids){
                    let text=getHttpResponseAsync(newUrl('/honor/takeAward.asp?sid=','&id='+id+'&type='+type))
                    console.log(text)
                    if(text.match('容量不足')){
                        addIdinnerHTML('result','背包容量不足<br>',1)
                        return
                    }else{
                        addIdinnerHTML('result','<br>'+text.match(/(领取成就.*?)(<[br/]{2,3}>){2}/)[1]+'<br>')
                        await sleep(1)
                    }
                }
            }
            replaceHTML(/<img src="\/zhzw\/pic\/home\/w.gif">/g,'')
        }
    }
}

async function auto_pointsrace(){
    if(running_task.积分赛){return}
    running_task.积分赛=true
    if(timenow < '13:00' || (timenow>'14:00' && timenow<'21:00') || timenow>'22:00'){new Task('积分赛').del();return}
    if(timenow<'13:15'){let wait_time=timeDelta(getdatetime(13,15,0,null,0));console.log('积分赛: 等待'+wait_time/1000+'秒');await sleep(wait_time)}
    if(timenow>'21:00' && timenow<'21:15'){let wait_time=timeDelta(getdatetime(21,15,0,null,0));console.log('积分赛: 等待'+wait_time/1000+'秒');await sleep(wait_time)}
    

    await sleep(timeDelta(New_getValue('next_pointsrace')))
    if(!going_task.积分赛){new Task('积分赛','auto_pointsrace','','积分赛').add()}

    if(New_getValue('last_pointsrace_award')!=today){getHttpResponseAsync(newUrl('/pointsrace/takeRankAward.asp?sid='));New_setValue('last_pointsrace_award',today)}

    let raceId=0
    for(let n=0;n<50;n++){
        let page_text=getHttpResponseAsync(newUrl('/pointsrace/index.asp?sid='))

        if(!raceId){raceId=page_text.match(/(?<=raceId=)\d+/)[0]}
        let current=page_text.match(/剩(\d分)?(\d+秒)?\).*?当前位置/)
        if(!current){
            let index=page_text.match(/(?<=index=)\d+(?=['"]>占领)/)
            if(index){
                let text=getHttpResponseAsync(newUrl('/pointsrace/grabSite.asp?sid=','&raceId='+raceId+'&index='+index))
                if(text.match('挑战次数已用完')){break}
                else if(text.match('已经占有位置')){await sleep(3000);continue}
                else if(text.match('活动已结束')){New_setValue('next_pointsrace',getdate(1));new Task('积分赛').del();return}
                else if(text.match('还没到开放时间呢')){break}
                console.log('积分赛: 等待60秒')
                New_setValue('next_pointsrace',getdatetime(0,1))
                await sleep(60000)
            }
        }else{
            let waitsec=transfer_time(current[0])
            wait=waitsec>=70?60:waitsec+1
            console.log(`积分赛: 等待${wait}秒(占领剩余${waitsec}秒)`)
            New_setValue('next_pointsrace',getdatetime(0,0,wait))
            await sleep(wait*1000)
        }
    }
    new Task('积分赛').del()
    let next_pointsrace=timenow>'20:00'?getdate(1)+' 12:00':today+' 20:00'
    New_setValue('next_pointsrace',next_pointsrace)
}

function get_dloginAward(){
    if(New_getValue('last_dloginAward')==today){return}
    let page_text=getHttpResponseAsync(newUrl('/dlogin/index.asp?sid='))
    let id=page_text.match(/(?<=id=)\d+(?=['"]>领取奖励)/)
    if(id){
        let text=getHttpResponseAsync(newUrl('/dlogin/takeAward.asp?sid=','&id='+id))
        if(!text.match('领取成功')){return}
    }
    New_setValue('last_dloginAward',today)
}

function set_dailyConsume(name,value){
    let tasks=New_getValue('dailyConsumeTask',[])
    let task=tasks.find(task=>task.name==name)
    let index=tasks.length
    let startTime=undefined
    let fn=undefined
    let state=0
    if(!task){task={name}}else{index=tasks.indexOf(task)}
    if(name=='竞技'){fn='autosport',startTime='07:00'}
    else if(name=='切磋'){fn='autocontest'}
    else if(name=='化仙池'){fn='auto_exppool'}
    else if(name=='闯塔'){fn='Worker_autopagoda_all'}
    Object.assign(task,{fn,state,startTime},value)
    console.log(task)
    tasks[index]=task
    New_setValue('dailyConsumeTask',tasks)
}
//New_setValue('next_dailyConsumeTask','0')
async function dailyConsumeTask(consume_mode=true,force=false){

    if(force){ 
        if(timenow > '23:00'){consume_mode=false}
    }else{
        let next_dailyConsumeTask=New_getValue('next_dailyConsumeTask')
        if(timenow > '23:00' && next_dailyConsumeTask.split(' ')[0]==today){consume_mode=false}
        if(consume_mode && (datetime<next_dailyConsumeTask || outerHTML.match('活力:\d/'))){return}
    }

    let tasks=New_getValue('dailyConsumeTask',[])

    if(tasks.length==0){
        tasks=[
            {name: '闯塔', fn: 'Worker_autopagoda_all', state: 0, enabled: true},
            {name: '切磋', value: '5', sendValue: true, fn: 'autocontest', state: 0, startTime: undefined},
            {name: '竞技', value: '50', sendValue: true, state: 0, startTime: '07:00', fn: 'autosport'},
            {name: '化仙池', fn: 'auto_exppool', enabled: true}
        ]
        New_setValue('dailyConsumeTask',tasks)
    }

    for(let task of tasks){
        if(task.state==1 || going_task[task.name] || timenow<task.startTime){continue}
        if(task.value==='0' || task.value===''){continue}
        if(task.name=='竞技' && task.value>100){
            if(timenow>'23:30'){task.value=50}
        }
        if(task.sendValue){
            eval(`${task.fn}(0,${task.value},consume_mode=${consume_mode})`)
        }else{
            eval(`${task.fn}(null,consume_mode=${consume_mode})`)
        }
        if(consume_mode){
            for(let i=0;i<30;i++){
                await sleep(1000)
                if(!going_task[task.name]){break}
            }
            if(myInfo.Huoli()<10){
                let get_power=await use_HuoLiQuan(force=1)
                if(!get_power){break}
            }
        }
    }
    New_setValue('next_dailyConsumeTask',getdatetime(1))
}

//dailyConsumeTask()

async function auto_exppool(){
    let page=getHttpResponseAsync(newUrl('/exppool/index.asp?sid='))
    let text=''
    let result=0
    if(page.match('>收获<')){
        let exppool=page.match(/(\d+)\/(\d+)/)
        if(exppool[1]/exppool[2]>0.67){New_setValue('next_exppool',getdatetime(4));return}
        text=getHttpResponseAsync(newUrl('/exppool/compute.asp?sid='))
        result=1
    }else if(page.match('>终止<')){
        New_setValue('next_exppool',getdatetime(4));return
    }
    text=getHttpResponseAsync(newUrl('/exppool/start.asp?sid='))
    if(text.match('开始')){console.log('开始化仙池')}
    New_setValue('next_exppool',getdatetime(4))
    return result
}

async function auto_upgrade_equip(){
    let battleTeam=getHttpResponseAsync(newUrl('/pet/battleTeam.asp?sid='))
    battleTeam=battleTeam.match(/(?<=petId=)\w+/g)
    let Second_Team=New_getValue('Second_Team')
    if(Second_Team.length){
        for(let pet of Second_Team){battleTeam.push(pet.petId)}
    }
    if(battleTeam.length==0){return}
    Array.from(new Set(battleTeam))
    let limit=myInfo.Lv()<90?'[^弑>]':'[^>]'
    for(let petId of battleTeam){
        console.log('检查战骨',petId)
        let page=getHttpResponseAsync(newUrl('/equip/index.asp?sid=','&petId='+petId))
        let upgrade=page.match(eval(`/(?<=:<${limit}+>[^>]+;id=)\\w+(?=[^>]+>炼制)/g`))
        if(!upgrade){continue}
        for(let id of upgrade){
            console.log('炼制战骨',id)
            let text=getHttpResponseAsync(newUrl('/equip/upgrade2pet.asp?sid=','&id='+id+'&petId='+petId))
            console.log(text)
        }
    }
}

if(href.match('/ring/')){
    replaceHTML([
        [/((..)加成.*?)<a/g,'<span id=$2>$1</span><a'],
        [/(\/wash(Patk|Matk|Dex)[^>]+>(普通)?加工[^<]*?<\/a>)/g,'$1 <a class=wash id=$2 href=javascript:;>连续加工</a>']
    ])
    for(let item of document.getElementsByClassName('wash')){
        let id=item.id
        document.getElementById(id).onclick=async()=>{
            let url=newUrl(`/ring/wash${id}.asp?sid=`,'&type=0')
            let infoId=id=='Patk'?'物攻':(id=='Matk'?'法攻':'速度')
            for(let i=0;i<100;i++){
                let text=getHttpResponseAsync(url)
                let value=text.match(/\+(\d+\/\d+)\)/)[1]
                if(eval(value)==1){setIdinnerHTML(id,'加成已满');return}
                else if(text.match('加工道具不足')){setIdinnerHTML(id,'加工道具不足');return}
                setIdinnerHTML(infoId,text.match(/((..)加成.*?)<a/)[1])
                await sleep(1)
            }
        }
    }
}

function sort_pets_zhanli(){
    let pets_page=getHttpResponseAsync(newUrl('/pet/index.asp?sid='))
    let pets=pets_page.match(/petId=.*?战力:\d+/g)
    let pets_info=[]
    for(let pet of pets){
        pets_info.push({petId: pet.match(/petId=(\w+)/)[1], zhanli: pet.match(/(\d+)$/)[1]})
    }
    pets_info.sort((a,b)=>b.zhanli - a.zhanli)
    return pets_info
}

async function auto_celebrity(){
    let pets_info=sort_pets_zhanli()
    let seq=[2,3,1]
    for(let i=0;i<pets_info.length;i++){
        let petId=pets_info[i].petId
        let no=seq[0]
        let text=getHttpResponseAsync(newUrl('/celebrity/teamEdit.asp?sid=','&petId='+petId+'&no='+no))
        if(text.match('队伍幻兽已达上限')){seq.shift();if(seq.length==0){break}}
    }
}

if(href.match('/mount/index.asp')){
    replaceHTML(/((Lv.\d+)(.*?))?([\d.]+)%(.*?;id=(\d).>升级<\/a>)/g,'<span id=level_$6>$2</span>$3<span id=value_$6>$4</span>%$5 \
    <a class=upgrade id=upgrade_$6 href=javascript:;>一键升级</a> <a id=exchange_$6 href=javascript:; style="display:none">镇妖符兑换奇石</a>')
    for(let item of document.getElementsByClassName('upgrade')){
        document.getElementById(item.id).onclick=()=>{
            let id=item.id.split('_')[1]-0
            let text=getHttpResponseAsync(newUrl('/mount/upgradePage.asp?sid=','&id='+id))
            if(text.match('不满足')){
                let exchange=document.getElementById('exchange_'+id)
                exchange.style=null
                exchange.onclick=()=>{
                    let text=postHttpResponseAsync(newUrl('/exch/exchange.asp?sid=','&type=1'),'count=10&id='+(id+4))
                    console.log(text)
                    if(text.match('成功兑换')){setIdinnerHTML('exchange_'+id,'兑换成功')}else{setIdinnerHTML('exchange_'+id,'兑换失败')}
                    console.log(getHttpResponseAsync(newUrl('/pack/openBox.asp?sid=','&id=zqbx0'+id+'&count='+10)))
                    
                }
                return
            }
            let new_level='Lv.'+text.match(/→Lv.(\d+)/)[1]
            let new_value=text.match(/([\d.]+)%</)[1]
            text=getHttpResponseAsync(newUrl('/mount/upgrade.asp?sid=','&id='+id))
            if(text.match('坐骑升级成功')){
                if(document.getElementById('level_'+id).innerHTML){setIdinnerHTML('level_'+id,new_level)}
                setIdinnerHTML('value_'+id,new_value)
            }else{
                console.log(text)
            }
        }
        
    }
}

if(href.match('/evilsoul/mapIndex.asp')){
    let evils=New_getValue('evil_soul_types',['灭灵'])

    replaceHTML([
        [/(战神排行榜<\/a>)/,'$1&emsp;<a id= href=javascript:;>一键挑战全部</a>: <input type=checkbox id=灭妖><label for=灭妖>灭妖</label><input type=checkbox id=灭灵><label for=灭灵>灭灵</label>'],
        [eval(`/(;no=(\\d+).>挑战[^;]+;\\(${(evils.join('|'))}符×1\\))/g`),'$1 <a class=evil_no id=no_$2 href=javascript:;>一键挑战</a>'],
        ['(<br><br><br>)','<span id=result></span>$1']
    ])
    mieyao=document.getElementById('灭妖')
    mieling=document.getElementById('灭灵')
    if(evils.indexOf('灭妖')>=0){mieyao.checked=true}
    if(evils.indexOf('灭灵')>=0){mieling.checked=true}
    mieyao.onclick=()=>{
        if(mieyao.checked){evils.push('灭妖')}else{evils=evils.filter(type=>type!='灭妖')}
        New_setValue('evil_soul_types',evils)
        location.reload()
    }
    mieling.onclick=()=>{
        if(mieling.checked){evils.push('灭灵')}else{evils=evils.filter(type=>type!='灭灵')}
        New_setValue('evil_soul_types',evils)
        location.reload()
    }
    for(let item of document.getElementsByClassName('evil_no')){
        let id=item.id
        document.getElementById(id).onclick=()=>{
            let no=id.split('_')[1]
            let text=getHttpResponseAsync(newUrl('/evilsoul/selectSoul.asp?sid=','&no='+no))
            if(text.match('挑战所需物品不足')){setIdinnerHTML(id,'挑战所需物品不足');return}
            else if(text.match('幻兽队伍不能有空缺')){
                let pets_info=sort_pets_zhanli()
                for(let pet of pets_info){
                    let text=getHttpResponseAsync(newUrl('/evilsoul/teamEdit.asp?sid=','&petId='+pet.petId))
                    if(text.match('已达上限')){break}
                }
                text=getHttpResponseAsync(newUrl('/evilsoul/pkIndex.asp?sid='))
            }
            let petIds=text.match(/;petId=(\w+)/g)
            for(let petId of petIds){
                let text=getHttpResponseAsync(newUrl('/evilsoul/pk.asp?sid=','&petId='+petId))
                if(!text.match('成功')){console.log(text);break}
            }
            addIdinnerHTML('result',text.match(/获得了[^<]+/),1)
        }
    }
}

if(href.match('/clantalent/index')){
    replaceHTML(/(\d+)\/(.*?type=(\d).>学习<\/a>)/g,'<span id=level_$3>$1</span>/$2 <a class=study id=$3 href=javascript:;>一键学习</a>')
    for(let item of document.getElementsByClassName('study')){
        let id=item.id
        document.getElementById(id).onclick=()=>{
            let text=getHttpResponseAsync(newUrl('/clantalent/studyTalent.asp?sid=','&type='+id))
            if(text.match('成功学习')){
                document.getElementById('level_'+id).innerHTML++
            }else if(text.match('贡献度不足')){
                setIdinnerHTML(id,'贡献度不足')
            }else if(text.match('已达联盟天赋上限')){
                setIdinnerHTML(id,'已达联盟天赋上限')
            }else{console.log(text)}
        }
    }
}

if(href.match('/talent/index.asp')){
    replaceHTML(/(洗点<\/a>)/,'$1&emsp;<a id=add_all href=javascript:;>一键分配(39级以上时)</a><span id=result></span>')
    document.getElementById('add_all').onclick=()=>{
        if(myInfo.Lv()<39){addIdinnerHTML('result','未满39级，不建议一键分配');return}
        for(let i=1;i<11;i++){
            let success=1
            while(success){
                success=getHttpResponseAsync(newUrl('/talent/addTalent.asp?sid=','&id='+i)).match('分配天赋点成功')
            }
        }
        location.reload()
    }
}

async function compress_bag(){
    let fn_worker=['open_allitems','selltz','sell_book','sell_item','sell_jinhuashi','setIdinnerHTML','addIdinnerHTML']
    await sell_item('all')
    await selltz()
    await sell_book()
    await sell_jinhuashi()

    await open_allitems(mode='exchange')
    await open_allitems()
    
}