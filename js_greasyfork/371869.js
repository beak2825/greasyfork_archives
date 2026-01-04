// ==UserScript==
// @name         4399Clear
// @description  清爽的4399
// @include      http://*.4399.com/*
// @include      http://*.4399.com/
// @grant        unsafeWindow
// @version      V20180904[1]
// @namespace https://greasyfork.org/users/209933
// @downloadURL https://update.greasyfork.org/scripts/371869/4399Clear.user.js
// @updateURL https://update.greasyfork.org/scripts/371869/4399Clear.meta.js
// ==/UserScript==

(function(w){
    //默认的需要删除的class数组，可自行添加，删除
    var classArr = ['reco','tdc','reco_r','skin-lk','menu_ri','dh','gp','i_new','middle_1','p-forum','rec_left cf','asp_box cf','evn_box','t2','w-game cf','lf_game','caro','s-box','g-box','p_game','btn','outside','ins-box cf','p-1ad','bre ovhid','rgames cf','eqwrap2','ab4--w','old-ri','setlide','dh','tm_fun h_4','rollgame'],
    idArr = [],
    filterStr={	};

    //超时检测，在规定时间内轮循f，直到为真则执行cb
    var check=function(f,cb){
        var now=new Date,
        timeout=8000;
        var fun= function(){
            var ret=f();
            if(!ret){
                if(new Date-now<timeout){
                    setTimeout(fun,500);
                }
            }else{
                cb();
            }
        }
        fun();
    }

    //class选择器
    var _class = function (name) {
        var arr= document.getElementsByClassName(name);
        return Array.prototype.slice.call(arr);
    }
    //id选择器
    var _id = function (id) {
        return document.getElementById(id);
    }
    var QQZoneCleaner = {
        //删除指定元素
        remove : function (elem) {
            elem && elem.parentNode && elem.parentNode.removeChild(elem);
        },
        hide : function (elem) {
            elem && (elem.style.display='none');
        },
        _getArr:function(){
            var el,arr,cls;
            arr=[];
            //id
            for (var j = idArr.length; j--; ) {
                el = _id(idArr[j]);
                arr.push(el);
            }
            //class
            for (var i = classArr.length; i--; ) {
                cls=classArr[i];
                el=_class(cls);
                arr=arr.concat(el);
            }
            return arr;
        },
        //文本
        _text:function(obj){
            var t='';
            var arr=obj.childNodes;
            for(var i=0,len=arr.length;i<len;i++){
                t+=arr[i].textContent;
            }
            t=t.replace(/\s/g,'');
            return t;
        },
        _filter:function(arr,type){
            var html,item,i,j,retArr=[],
			filter=filterStr[type];
            for(i=arr.length;i--;){
                item=arr[i];
                html=this._text(item);
                for(j=filter.length;j--;){
                    if(html.indexOf(filter[j])!=-1){
                        var p=item.parentElement.parentElement.parentElement;
                        retArr.push(p);break;
                    }
                }
            }
            return retArr;
        },
        //执行删除操作
        doRemove : function () {
            var arrs = this._getArr();
            //还是隐藏吧
            for (var j = 0, len = arrs.length; j < len; j++)
                this.hide(arrs[j]);
        }
    };

    QQZoneCleaner.doRemove();

    check(function(){
        return w.QZONE.qzEvent;
    },
    function(){
        w.QZONE.qzEvent.addEventListener('QZ_SCROLL',function(){
            QQZoneCleaner.doRemove();
        });
    });
})(unsafeWindow);
