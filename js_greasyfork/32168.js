// ==UserScript==
// @name         虎扑帖子关键词屏蔽
// @namespace    http://tampermonkey.net/
// @version      v0.2
// @description  根据关键词屏蔽虎扑帖子
//在"blockedList"里编辑需要屏蔽的关键词
//blockedStyle添加包含屏蔽关键词的html元素,数字表示向上的父元素层级,比如"div.titlelink>a"往上两级父元素是li,删除掉li就可以在你的页面上删除掉这一条帖子,这样做为了提高效率.
// @author         zhvxiao
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
//设置里的用户排除,可以将你的专区排除.也就是不屏蔽帖子.
// @include        https://bbs.hupu.com/*
// @downloadURL https://update.greasyfork.org/scripts/32168/%E8%99%8E%E6%89%91%E5%B8%96%E5%AD%90%E5%85%B3%E9%94%AE%E8%AF%8D%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/32168/%E8%99%8E%E6%89%91%E5%B8%96%E5%AD%90%E5%85%B3%E9%94%AE%E8%AF%8D%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==     
var blockedList=[
    
    "C罗","内马尔","中超","中国","梅西"
];



var MyMap=function (){  
    this.mapArr={};  
    this.arrlength=0;  

    //假如有重复key，则不存入  
    this.put=function(key,value){  
        if(!this.containsKey(key)){  
            this.mapArr[key]=value;  
            this.arrlength=this.arrlength+1;  
        }  
    }  ;
    this.get=function(key){  
        return this.mapArr[key];  
    };

    //传入的参数必须为Map结构  
    this.putAll=function(map){  
        if(Map.isMap(map)){  
            var innermap=this;  
            map.each(function(key,value){  
                innermap.put(key,value);  
            }) ;
        }else{  
            alert("传入的非Map结构");  
        }  
    };
    this.remove=function(key){  
        delete this.mapArr[key];  
        this.arrlength=this.arrlength-1;  
    } ;
    this.size=function(){  
        return this.arrlength;  
    }  ;

    //判断是否包含key  
    this.containsKey=function(key){  
        return (key in this.mapArr);  
    }  ;
    //判断是否包含value  
    this.containsValue=function(value){  
        for(var p in this.mapArr){  
            if(this.mapArr[p]==value){  
                return true;  
            }  
        }  
        return false;  
    }  ;
    //得到所有key 返回数组  
    this.keys=function(){  
        var keysArr=[];  
        for(var p in this.mapArr){  
            keysArr[keysArr.length]=p;  
        }  
        return keysArr;  
    }  ;
    //得到所有value 返回数组  
    this.values=function(){  
        var valuesArr=[];  
        for(var p in this.mapArr){  
            valuesArr[valuesArr.length]=this.mapArr[p];  
        }  
        return valuesArr;  
    }  ;

    this.isEmpty=function(){  
        if(this.size()===0){  
            return false;  
        }  
        return true;  
    }  ;
    this.clear=function(){  
        this.mapArr={};  
        this.arrlength=0;  
    }  ;
    //循环  
    this.each=function(callback){  
        for(var p in this.mapArr){  
            callback(p,this.mapArr[p]);  
        }  

    }  ;
    this.isMap=function(map){  
        return  (map instanceof Map);  
    } ;

}  ;

var blockedStyle=new MyMap();
blockedStyle.put("div.titlelink>a",2);

$(document).ready(
    function()
    {
        init();
    }
);

function init(){
    blockedList.forEach(function(item,index,array)
                        {
        blockedStyle.each(function(key1,value1)
                             {
            $(key1+":contains("+item+")").each(function()
               {
				     my_parent=$(this);	
					for(var i=0;i<value1;i++)
					{
                        my_parent=my_parent.parent();
                       
					}
                my_parent.remove();
                console.log("屏蔽掉关于"+item+"的一条帖子");
            });
        });
    }
                       );
}