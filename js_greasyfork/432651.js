var webHook=(function() {
    'use strict';
    var backup={};
    var api={
        filter:(args)=>{return true;},
        WSList:[],
        messageHandler:(event)=>{
            var e = new Event('globalWebsocketMessage')
            e.data=event.data
            window.document.dispatchEvent(e);
        },
        closeHandler:(event)=>{
            var e = new Event('globalWebsocketClose')
            e.data=event.data
            window.document.dispatchEvent(e);
            event.target.removeEventListener('message', api.messageHandler);
            event.target.removeEventListener('close', api.closeHandler);
        },
        beginSend:(webSocket,args)=>{return args;},
        endSend:(webSocket,args)=>{},
        filterSend:(webSocket,args)=>{return true;}

    }
    backup.WebSocket=window.WebSocket;
    window.WebSocket=new Proxy(window.WebSocket,{
        construct:function(target,args){
                var ws=new target(...args);
            if(api.filter(args)){
                api.WSList.push(ws);
                ws.addEventListener('message', api.messageHandler);
                ws.addEventListener('close', api.closeHandler);
                backup.WSSend=ws.send;
                ws.send= new Proxy(ws.send, {
                    apply: function(target, _this, _arguments) {
                        if(ws.readyState === ws.OPEN && api.filterSend(_this, _arguments)){
                           _arguments=api.beginSend(_this,_arguments)
                            Function.prototype.apply.apply(target, [_this, _arguments]);
                            api.endSend(_this,_arguments);

                        }
                    }
                });
            }
        return ws;}
    });
    console.log(api);
    return api;
})();