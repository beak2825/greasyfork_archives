// ==UserScript==
// @name         天宫测试环境增强
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       xiaoql
// @match        http://10.172.49.2/service/zb-newcs-yw/ui/*
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @require https://code.jquery.com/jquery-3.4.0.min.js
// @resource jqueryConfirmCSS https://cdnjs.cloudflare.com/ajax/libs/jquery-confirm/3.3.2/jquery-confirm.min.css
// @require https://cdnjs.cloudflare.com/ajax/libs/jquery-confirm/3.3.2/jquery-confirm.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.24.0/moment.min.js
// @downloadURL https://update.greasyfork.org/scripts/382208/%E5%A4%A9%E5%AE%AB%E6%B5%8B%E8%AF%95%E7%8E%AF%E5%A2%83%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/382208/%E5%A4%A9%E5%AE%AB%E6%B5%8B%E8%AF%95%E7%8E%AF%E5%A2%83%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

const g={
    TG_API:'http://10.172.49.2/service/zb-newcs-yw/v2/apps?force=true',
    SW_BACKEND_SERVICES:'10.172.32.131:11800',
    SW_AGENT_JAR:"http://10.172.32.145:9003/skywalking/skywalking.tgz",
    DOCKER_PREFIX:'harbor.dcos.xixian.unicom.local/zongbu_newcs01_test/',
    TTY:'http://10.172.49.2/welkin/ttys/taskId?servicename=/zb-newcs-yw&containertype=docker'
}


var newCSS = GM_getResourceText ("jqueryConfirmCSS");
GM_addStyle (newCSS)

const $=jQuery
let apps=[]
let appsVersion=[]

function mdf(e){
    console.log(e)
    var title = $(e.target).parent().next().attr('title')
    let current = apps.filter(app => app.id===title);
    if(current.length===1){
        console.log(current)
        let app=current[0];
        let s = JSON.stringify(app, null, 4);
        $.confirm({
            type: 'red',
            title:()=>{
                return app.id
            },
            titleClass:'text-muted',
            boxWidth: '90%',
            useBootstrap: false,
            content: '<textarea wrap="off" cols="20000" style="color:#000;width:100%;height:750px;overflow:scroll;padding:5px;">'+s+'</textarea>',
            onOpenBefore:()=>{
                $('div.jconfirm-content').css('overflow','hidden')
            },
            buttons: {
                ok: {
                    text: 'OK',
                    btnClass: 'btn-red',
                    action: function(){
                        let appText=$('div.jconfirm-content textarea').val()
                        fetch(g.TG_API,{
                            "headers": {
                                "content-type": "application/json"
                            },"body":"["+appText+"]","method":"PUT"})
                            .then((response) => response.text())
                            .then(text => {
                            $.alert({content:'<span style="color:#000">'+text+"</span>"})
                        });
                    }
                },
                cancel: function () {

                }
            }
        });

    }
    return false
}

function show(){
    var $btn=$('<button class="btn btn-default">改</button>')
    $btn.click(mdf)
    $('tr.app>td.icon-cell').html($btn)

    var labels=$('tr.app>td.name-cell>div.labels');
    labels.css('display','none')
    var nameCell=$('tr.app>td.name-cell');
    nameCell.each((index,elem)=>{
        const title = $(elem).attr("title")
        const app= appsVersion.filter(app=>app.id===title)[0];
        $(elem).append('<span style="padding-left:15px;color:#00CED1">[latest='+moment(app.version).fromNow()+"]</span>")
        $(elem).append('<span style="padding-left:15px;color:#00FA9A">[profile='+app.profile+"]</span>")
        $(elem).append('<span style="padding-left:15px;color:#87CEEB">[health='+app.health+"]</span>")
        $(elem).append('<span style="padding-left:15px;color:#EE82EE">[weight='+app.weight+"]</span>")
        $(elem).append('<span style="padding-left:15px;color:"#FAF0E6">[docker='+app.docker+"]</span>")
        let $tasksUl=$("<span><span>")
        app.tasks.forEach((task)=>{
            let $task=$("<span><span>")
            let $tty=$('<button class="btn btn-default">tty</button>');
            $tty.click(()=>{
                tty(task.id)
                return false
            })
            $task.append($tty);
            $tasksUl.append($task);
        })

        $(elem).append($tasksUl);
    })

}

(function() {
    'use strict';



    setInterval(()=>{
        if($('#hollyshow').length>0)return;
        fetch(g.TG_API+'&embed=app.tasks',
              {"body":null,"method":"GET"})
            .then((response) => response.json())
            .then(json => {
            apps = json.apps.filter(app => app.id.startsWith("/cs/")).map(app => togsConfig(app))
            appsVersion=json.apps.filter(app => app.id.startsWith("/cs/")).map(app => togsVersion(app))
        });
        var $loadBtn=$('<li><button id="hollyshow" class="btn btn-default">我要改配置了</button></li>')
        $('ul.list-unstyled').append($loadBtn)
        $loadBtn.click(()=>{
            show()
        })

    },1000)

})();


function togsConfig(raw) {
    let app = {};
    app.id = raw.id;
    app.labels = raw.labels;
    app.labels.holly = "yes";

    app.cmd = raw.cmd;

    app.cmd = app.cmd.replace("cat /opt/dev_hbase_hosts >> /etc/hosts && ", "")
    app.cmd = app.cmd.replace("cat /opt/test_hbase_hosts >> /etc/hosts && ", "")
    app.cmd = app.cmd.replace("cat /opt/prod_hbase_hosts >> /etc/hosts && ", "")
    app.cmd = app.cmd.replace("-Dpinpoint.agentId=$HOSTNAME -javaagent:/opt/agent/pinpoint-bootstrap-$AGENT_VERSION.jar -Dpinpoint.applicationName=$APP_NAME", "")
    while(app.cmd.includes("skywalking-agent.jar ")){
        app.cmd = app.cmd.replace("-javaagent:/mnt/mesos/sandbox/skywalking/skywalking-agent.jar","");
    }
    app.cmd = app.cmd.replace("java ", "java -javaagent:/mnt/mesos/sandbox/skywalking/skywalking-agent.jar ")
    app.env = raw.env;
    app.env.SW_AGENT_COLLECTOR_BACKEND_SERVICES = g.SW_BACKEND_SERVICES;
    app.env.SW_AGENT_NAME = app.env.APP_NAME;
    app.env.TZ = "Asia/Shanghai";
    app.labels = raw.labels;
    app.instances = raw.instances;
    app.cpus = 0.1;
    app.mem = raw.mem;
    app.constraints = raw.constraints;
    app.container = raw.container;

    app.healthChecks = raw.healthChecks;
    if(app.healthChecks.lenght>0){
        let health0=app.healthChecks[0];
        if(health0.protocol==='COMMAND'){
            health0.command={value:"curl -f -X GET http://127.0.0.1:8080"+healthPath(app)}
        }else if(health0.protocol==='HTTP'){
            health0.path=healthPath(app)
        }
    }

    app.fetch = [{
        "uri":g.SW_AGENT_JAR,
        "extract": true,
        "executable": false,
        "cache": false,
        "outputFile": "skywalking.tgz"
    }]
    delete app.env.ENABLE_PINPOINT;
    delete app.env.AGENT_VERSION;
    delete app.labels.DCOS_PACKAGE_SOURCE
    delete app.labels.DCOS_PACKAGE_OPTIONS;
    delete app.labels.DCOS_PACKAGE_METADATA;
    delete app.labels.DCOS_PACKAGE_DEFINITION;
    return app;
};

function healthPath(app){
    let rawPath=app.labels.HAPROXY_0_PATH+"/health";
    return rawPath.replace(/\/\//,'/')
};



function togsVersion(raw) {
    return {
        id:raw.id,
        version:raw.version,
        skywalking: raw.cmd.includes("skywalking-agent.jar "),
        health:getHealth(raw),
        weight:raw.labels.HAPROXY_0_BACKEND_WEIGHT,
        profile:getProfile(raw),
        docker:raw.container.docker.image.replace(g.DOCKER_PREFIX,''),
        tasks:raw.tasks
    }
}

function getHealth(app){
    if(app.healthChecks==null)return 'null'
    if(app.healthChecks.length===0)return 'null'
    let health0=app.healthChecks[0];
    if(health0.protocol==='COMMAND'){
        return '(COMMAND)'+ health0.command;
    }else if(health0.protocol==='HTTP'){
        return '(HTTP)'+ health0.path
    }
    return 'unknown'
}



function getProfile(app){
    if(app.cmd==null)return 'null'
    if(!app.cmd.includes('Dspring.profiles.active'))return 'null'
    let re1=/Dspring.profiles.active='(\w+)'/
    let p1 = re1.exec(app.cmd,re1);
    if(p1.length===2) {
        return p1[1];
    }
    let re2=/Dspring.profiles.active=(\w+)/
    let p2 = re2.exec(app.cmd,re2);
    if(p2.length===2) {
        return p2[1];
    }
    return 'null'
}

const tty=(taskId)=>{
    fetch(g.TTY.replace('taskId',taskId),{"method":"GET"})
        .then((response) => response.json())
        .then(json=>{
        if(json.status===200 && json.message==='ok' && json.data.length>0){
            window.open(json.data[0].url)
        }
    })

}



