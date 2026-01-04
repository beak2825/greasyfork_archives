// ==UserScript==
// @name         勋章调整
// @namespace    http://sstm.moe/
// @version      0.1
// @description  勋章排序功能
// @author       367ddd(叫我牛顿吧)
// @match        https://sstm.moe/awards/my/
// @license MIT
// @icon         https://s.sstmlt.com/board/monthly_2017_06/logo_1479532980294_5d1829.png.7c198e484115f85daaf0f04963f81954.png.418af10c64761f5ef969fe30c7992a40.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/504942/%E5%8B%8B%E7%AB%A0%E8%B0%83%E6%95%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/504942/%E5%8B%8B%E7%AB%A0%E8%B0%83%E6%95%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let togglebutton='<button id="mytoggle">启用/禁用选择项</button>';
    let ableall='<button id="ableall">启用选择项</button>';
    let disableall='<button id="disableall">禁用选择项</button>';
    let mergebutton='<button id="mergebutton" style="float: right;">合并选择项</button>';
    let unmergebutton='<button id="unmergebutton"style="float: right;">解锁选择项</button>';
    let submitbutton='<button id="submitbutton" style="margin-right: 37%;">提交</button>';
    let selectallbutton='<button id="selectallbutton">显示项全选/取消全选</button>';
    let mergemanual='<span style="float: right;height: 24.7px;margin-left: 4px;margin-right: 4px;" title="合并后，已选中的勋章会排列到一起，在拖拽时也会一起移动，在解锁后还原">?</span>';
    let selecting=0;
    let selectnum=0;
    let reordering=0;
    let reordernum=0;
    function selectall(){
        let anychecked=false;
        $('input[type="checkbox"]').each(function(){if(this.checked==true){anychecked=true;}});
        $('ol.ipsTree.ipsTree_node.ui-sortable>li').each(function(){
            if(this.style.visibility!='hidden'){
                $(this).find('input[type="checkbox"]')[0].checked=true&&!anychecked;
            }else{
                $(this).find('input[type="checkbox"]')[0].checked=false;
            }
        });
    }
    function setStyle(dom,options,fn){
        new Promise(function(resolve,reject){
            for (let key in options){
                dom.style[key] = options[key];
            }
            resolve();
        }).then(res => {
            if (fn) {
                fn();
            }
        }).catch(err => {
            console.log(err);
        });
    }
    function mergelist(){
        let mother=null;
        let i=0;
        $('ol.ipsTree.ipsTree_node.ui-sortable>li>div>div>input[type="checkbox"]').each(
            function(){
                if(this.checked==true){
                    if(i==0){
                        mother=this.parentElement.parentElement.parentElement.children[1];
                        mother.id='mylistmother';
                    }else{
                        if(mother==null){return;}
                        $(mother).append(this.parentElement.parentElement.parentElement);
                    }
                    i++;
                }
            }
        );
    }
    function unmerge(){
        let mother=$('#mylistmother')[0];
        let last = mother.parentElement;
        $('#mylistmother>li').each(function(){
            $(this).insertAfter(last);
            last=this;
        });
    }
    function select(){
        switch(selectnum){
            case 0:$('ol.ipsTree.ipsTree_node.ui-sortable>li').each(function(){
                if($($(this).find('.ipsHide')[0]).attr('data-state')=='enabled'){
                    this.style.visibility='hidden';
                    this.style.height='0px';
                    $('ol.ipsTree.ipsTree_node.ui-sortable').append(this);
                    //this.remove()
                }else{
                    this.style.visibility='visible';
                    this.style.height='inherit';
                }
            });
                break;
            case 1:$('ol.ipsTree.ipsTree_node.ui-sortable>li').each(function(){
                if($($(this).find('.ipsHide')[0]).attr('data-state')=='disabled'){
                    this.style.visibility='hidden';
                    this.style.height='0px';
                    $('ol.ipsTree.ipsTree_node.ui-sortable').append(this);
                    //this.remove()
                }else{
                    this.style.visibility='visible';
                    this.style.height='inherit';
                }
            });
                break;
            case 2:$('ol.ipsTree.ipsTree_node.ui-sortable>li').each(function(){
                if($(this).find('h4.ipsContained.ipsType_break')[0].innerText.search(/【III】/)==-1){
                    this.style.visibility='hidden';
                    this.style.height='0px';
                    $('ol.ipsTree.ipsTree_node.ui-sortable').append(this);
                    //this.remove()
                }else{
                    this.style.visibility='visible';
                    this.style.height='inherit';
                }
            });
                break;
            case 3:$('ol.ipsTree.ipsTree_node.ui-sortable>li').each(function(){
                if($(this).find('h4.ipsContained.ipsType_break')[0].innerText.search(/【II】/)==-1){
                    this.style.visibility='hidden';
                    this.style.height='0px';
                    $('ol.ipsTree.ipsTree_node.ui-sortable').append(this);
                    //this.remove()
                }else{
                    this.style.visibility='visible';
                    this.style.height='inherit';
                }
            });
                break;
            case 4:$('ol.ipsTree.ipsTree_node.ui-sortable>li').each(function(){
                if($(this).find('h4.ipsContained.ipsType_break')[0].innerText.search(/【I】/)==-1){
                    this.style.visibility='hidden';
                    this.style.height='0px';
                    $('ol.ipsTree.ipsTree_node.ui-sortable').append(this);
                    //this.remove()
                }else{
                    this.style.visibility='visible';
                    this.style.height='inherit';
                }
            });
                break;
            case 5:$('ol.ipsTree.ipsTree_node.ui-sortable>li').each(function(){
                if($(this).find('h4.ipsContained.ipsType_break')[0].innerText.search(/周年/)==-1){
                    this.style.visibility='hidden';
                    this.style.height='0px';
                    $('ol.ipsTree.ipsTree_node.ui-sortable').append(this);
                    //this.remove()
                }else{
                    this.style.visibility='visible';
                    this.style.height='inherit';
                }
            });
                break;
            case 6:$('ol.ipsTree.ipsTree_node.ui-sortable>li').each(function(){
                if(!$(this).find('input[type="checkbox"]')[0].checked){
                    this.style.visibility='hidden';
                    this.style.height='0px';
                    $('ol.ipsTree.ipsTree_node.ui-sortable').append(this);
                    //this.remove()
                }else{
                    this.style.visibility='visible';
                    this.style.height='inherit';
                }
            });
                break;
            case 7:$('ol.ipsTree.ipsTree_node.ui-sortable>li').each(function(){
                if($(this).find('span.ipsDataItem_meta.ipsType_reset.ipsType_light.ipsType_blendLinks')[0].children.length>1){
                    this.style.visibility='hidden';
                    this.style.height='0px';
                    $('ol.ipsTree.ipsTree_node.ui-sortable').append(this);
                    //this.remove()
                }else{
                    this.style.visibility='visible';
                    this.style.height='inherit';
                }
            });
                break;
            case 8:$('ol.ipsTree.ipsTree_node.ui-sortable>li').each(function(){
                if($(this).find('span.ipsDataItem_meta.ipsType_reset.ipsType_light.ipsType_blendLinks')[0].children.length==1){
                    this.style.visibility='hidden';
                    this.style.height='0px';
                    $('ol.ipsTree.ipsTree_node.ui-sortable').append(this);
                    //this.remove()
                }else{
                    this.style.visibility='visible';
                    this.style.height='inherit';
                }
            });
                break;

            default:break;
        }
        $('ol.ipsTree.ipsTree_node>li').each(function(){
            if(this.style.visibility=='hidden'&&$(this).find('input[type="checkbox"]').length>0){
                $(this).find('input[type="checkbox"]')[0].checked=false;
            }
        });
    }
    function unselect(){
        $('ol.ipsTree.ipsTree_node.ui-sortable>li').each(
            function(){
                this.style.visibility='visible';
                this.style.height='inherit';
            }
        )
    }
    function getexpiredtimebyid(a){
        if($($('ol.ipsTree.ipsTree_node.ui-sortable>li>div[data-nodeid="'+a+'"]')[0]).find('span.ipsDataItem_meta.ipsType_reset.ipsType_light.ipsType_blendLinks')[0].children.length>1){
            let expdate = new Date($($($($('ol.ipsTree.ipsTree_node.ui-sortable>li>div[data-nodeid="'+a+'"]')[0]).find('span.ipsDataItem_meta.ipsType_reset.ipsType_light.ipsType_blendLinks')[0]).find('time')[1]).attr('datetime'));
            return(expdate-1);
        }else{
            return(172407736164300);
        }
    }
    function getnamebyid(a){
        console.log('id: '+a+' name: '+$($('ol.ipsTree.ipsTree_node.ui-sortable>li>div[data-nodeid="'+a+'"]')[0]).find('h4.ipsContained.ipsType_break')[0].firstChild.textContent.trim())
        return($($('ol.ipsTree.ipsTree_node.ui-sortable>li>div[data-nodeid="'+a+'"]')[0]).find('h4.ipsContained.ipsType_break')[0].firstChild.textContent.trim());
    }
    function reorder(){
        let listarray = new Array;
        $('ol.ipsTree.ipsTree_node.ui-sortable>li>div').each(function(){
            listarray.push($(this).attr('data-nodeid'));
        })
        let i=0;
        switch(reordernum){
            case 0://get time up
                listarray.sort();
                for(i=0;i<listarray.length;i++){
                    $('ol.ipsTree.ipsTree_node.ui-sortable').append($('ol.ipsTree.ipsTree_node.ui-sortable>li>div[data-nodeid="'+listarray[i]+'"]')[0].parentElement)
                    console.log($('ol.ipsTree.ipsTree_node.ui-sortable>li>div[data-nodeid="'+listarray[i]+'"]')[0].parentElement)
                }
                break;
            case 1://get time down
                listarray.sort(function(a,b){if(a>b){return(-1);}else{return(1);}});
                for(i=0;i<listarray.length;i++){
                    $('ol.ipsTree.ipsTree_node.ui-sortable').append($('ol.ipsTree.ipsTree_node.ui-sortable>li>div[data-nodeid="'+listarray[i]+'"]')[0].parentElement)
                    console.log($('ol.ipsTree.ipsTree_node.ui-sortable>li>div[data-nodeid="'+listarray[i]+'"]')[0].parentElement)
                }
                break;
            case 2://expired time up
                listarray.sort(function(a,b){if(getexpiredtimebyid(a)>getexpiredtimebyid(b)){return(1);}else{return(-1);}});
                for(i=0;i<listarray.length;i++){
                    $('ol.ipsTree.ipsTree_node.ui-sortable').append($('ol.ipsTree.ipsTree_node.ui-sortable>li>div[data-nodeid="'+listarray[i]+'"]')[0].parentElement)
                    console.log($('ol.ipsTree.ipsTree_node.ui-sortable>li>div[data-nodeid="'+listarray[i]+'"]')[0].parentElement)
                }
                break;
            case 3://expired time down
                listarray.sort(function(a,b){if(getexpiredtimebyid(a)>getexpiredtimebyid(b)){return(-1);}else{return(1);}});
                for(i=0;i<listarray.length;i++){
                    $('ol.ipsTree.ipsTree_node.ui-sortable').append($('ol.ipsTree.ipsTree_node.ui-sortable>li>div[data-nodeid="'+listarray[i]+'"]')[0].parentElement)
                    console.log($('ol.ipsTree.ipsTree_node.ui-sortable>li>div[data-nodeid="'+listarray[i]+'"]')[0].parentElement)
                }
                break;
            case 4://name up
                listarray.sort(function(a,b){if(getnamebyid(a)>getnamebyid(b)){return(1);}else{return(-1);}});
                for(i=0;i<listarray.length;i++){
                    $('ol.ipsTree.ipsTree_node.ui-sortable').append($('ol.ipsTree.ipsTree_node.ui-sortable>li>div[data-nodeid="'+listarray[i]+'"]')[0].parentElement)
                    console.log($('ol.ipsTree.ipsTree_node.ui-sortable>li>div[data-nodeid="'+listarray[i]+'"]')[0].parentElement)
                }
                break;
            case 5://name down
                listarray.sort(function(a,b){if(getnamebyid(a)>getnamebyid(b)){return(-1);}else{return(1);}});
                for(i=0;i<listarray.length;i++){
                    $('ol.ipsTree.ipsTree_node.ui-sortable').append($('ol.ipsTree.ipsTree_node.ui-sortable>li>div[data-nodeid="'+listarray[i]+'"]')[0].parentElement)
                    console.log($('ol.ipsTree.ipsTree_node.ui-sortable>li>div[data-nodeid="'+listarray[i]+'"]')[0].parentElement)
                }
                break;
            default:
                break;
        }
        if(selecting!=0){
            unselect();
            select();
        }
        console.log('idorder'+listarray)
    }
    // MutationObserver 配置
    var observerConfig = {
        childList: true,
        subtree: false,
        attributes: false,
        characterData: false
    };

    // 创建一个 MutationObserver 实例并传入回调函数
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            //console.log('DOM 发生变化:', mutation);
            let initboxnum=1;
            $('.ipsTree_drag.ipsDrag>input:not([type="checkbox"])').each(function(){
                this.value=initboxnum;
                initboxnum++;
            })
        });
    });
    observer.observe($('.ipsTree.ipsTree_node.ui-sortable')[0],observerConfig);
    $(selectallbutton).insertBefore($('form[data-role="treeListing"]')[0]);
    //$(togglebutton).insertBefore($('form[data-role="treeListing"]')[0]);
    $(ableall).insertBefore($('form[data-role="treeListing"]')[0]);
    $(disableall).insertBefore($('form[data-role="treeListing"]')[0]);
    $(mergemanual).insertBefore($('form[data-role="treeListing"]')[0]);
    $(unmergebutton).insertBefore($('form[data-role="treeListing"]')[0]);
    $(mergebutton).insertBefore($('form[data-role="treeListing"]')[0]);
    $(submitbutton).insertBefore($('form[data-role="treeListing"]')[0]);
    $('.ipsTree_controls').each(function(){$(this).remove();})
    $('#selectallbutton')[0].addEventListener("click",function(){
        selectall();
    })
    /*$('#mytoggle')[0].addEventListener("click",function(){
        let i=0;
        let inter=setInterval(function(){
            if($('input[type="checkbox"]')[i].checked===true){
                $('.ipsPos_right>a:not(.ipsHide)')[i].click();
            }else{
                $('.ipsPos_right>a.ipsHide')[i].click();
            }
            i=i+1;
            if(i>=$('.ipsTree_drag.ipsDrag').length){
                clearInterval(inter);
            }
        },100,i);
    })*/
    $('#ableall')[0].addEventListener("click",function(){
        let i=0;
        let inter=setInterval(function(){
            if($('input[type="checkbox"]')[i].checked===true){$('.ipsPos_right>a[data-state="disabled"]')[i].click();}
            else{$('.ipsPos_right>a[data-state="enabled"]')[i].click();}
            i=i+1;
            if(i>=$('.ipsTree_drag.ipsDrag').length){
                clearInterval(inter);
            }
        },100,i);
    })
    $('#disableall')[0].addEventListener("click",function(){
        let i=0;
        let inter=setInterval(function(){
            if($('input[type="checkbox"]')[i].checked===true){$('.ipsPos_right>a[data-state="enabled"]')[i].click();}
            else{$('.ipsPos_right>a[data-state="disabled"]')[i].click();}
            i=i+1;
            if(i>=$('.ipsTree_drag.ipsDrag').length){
                clearInterval(inter);
            }
        },100,i);
    })
    $('#mergebutton')[0].addEventListener("click",function(){
        mergelist();
    })
    $('#unmergebutton')[0].addEventListener("click",function(){
        unmerge();
    })
    $('#submitbutton')[0].addEventListener("click",function(){
        let error=0;
        $('form[data-role="treeListing"]').find('input[type="text"]').each(function(){
            if(this.value<0){
                error=1;
                alert('错误的数字排序，请不要输入负数');
                return;
            }
        });
        if(error===0){$('form[data-role="treeListing"]')[0].submit();}
    })
    let checkbox='<input type="checkbox">'
    $('.ipsTree_drag.ipsDrag').each(function(){
        $(checkbox).insertAfter(this.children[1]);
    })
    $('noscript').each(function(){
        $(this.innerText).insertBefore(this);
        this.remove();
    })
    let initboxnum=1;
    $('.ipsTree_drag.ipsDrag>input:not([type="checkbox"])').each(function(){
        this.value=initboxnum;
        initboxnum++;
    })
    function insertselect(){
        let areastrings=[
            ['已启用'],
            ['已禁用'],
            ['三级'],
            ['二级'],
            ['一级'],
            ['周年'],
            ['已选择'],
            ['永久'],
            ['非永久']
        ];
        let btn = document.createElement("button");
        if(selecting==0){
            btn.textContent ="开始筛选"
        }else{
            btn.textContent ="筛选生效中"
        }
        setStyle(btn,{
            width: '100px',
            height: '32px',
            borderRadius: '7px',
            background: 'palegreen',
            color:'#000000',
            fontSize:'inherit',
            textAlign: 'center',
            marginTop:'8px',
            marginBottom:'8px',
            marginLeft:'0px'
        })
        btn.addEventListener("click",function(){
            if(selecting==0){
                selecting=1;
                select();
                btn.textContent ="筛选生效中"
            }else{
                btn.textContent ="开始筛选"
                selecting=0;
                unselect();
            }
        })
        btn.addEventListener("mouseenter",function(){
            //console.log('mousein')
            setStyle(btn,{background: '#999999', cursor: 'pointer'})
        })
        btn.addEventListener("mouseleave",function(){
            //console.log('mouseout')
            if(selecting==0){
                setStyle(btn,{background: 'palegreen'})
            }else{
                setStyle(btn,{background: 'red'})
            }
        })
        btn.addEventListener("mousedown",function(){
            //console.log('mousedown')
            setStyle(btn,{background: '#555555'})
        })
        btn.addEventListener("mouseup",function(){
            //console.log('mouseup')
            if(selecting==0){
                setStyle(btn,{background: 'palegreen'})
            }else{
                setStyle(btn,{background: 'red'})
            }
        })
        let selectarea = document.createElement("button")
        let selectnums = document.createElement("p")
        selectnums.textContent=areastrings[0][0]
        selectnums.style.margin='auto'
        selectnums.style.padding='initial'
        selectnums.style.width='max-content'
        selectnums.style.textAlign='center'
        selectnums.style.width='130px'
        selectarea.appendChild(selectnums)
        setStyle(selectarea,{
            position:'relative',
            marginTop:'8px',
            marginBottom:'8px',
            marginLeft:'8px',
            padding:'0',
            lineHeight:'30px',
            width: '130px',
            height: '32px',
            borderRadius: '7px',
            background: '#ffffff',
            color:'#000000',
            fontSize:'inherit',
            fontWeight:'inherit',
            fontStyle:'inherit',
            textAlign:'center'
        })

        let selectlist = document.createElement("ul");
        setStyle(selectlist,{
            position:'absolute',
            margin:'0',
            padding:'0',
            listStyle:'none',
            width: '130px',
            height: '256px',
            background: '#ffffff',
            color:'#000000',
            fontSize:'inherit',
            fontWeight:'inherit',
            fontStyle:'inherit',
            display:'none',
            overflow:'auto',
            scrollbarWidth:'thin',
            zIndex:'99'
        })


        let selectoptions = new Array();
        for(let num=0;num<areastrings.length;num++){
            selectoptions[num]=document.createElement("li");
            setStyle(selectoptions[num],{
                position:'relative',
                width: '130px',
                height: '32px',
                background: 'lavenderblush',
                color:'#000000',
                fontSize:'16px',
                fontWeight:'bold',
                display:'block',
                margin:'1px',
                borderWidth:'medium',
                borderStyle:'outset',
                zIndex:'100'
            })
            selectoptions[num].textContent=areastrings[num]
            if(areastrings[num].length>1){selectoptions[num].style.width='max-content'}
        }
        selectarea.appendChild(selectlist)
        for(let num=0;num<areastrings.length;num++){
            selectlist.appendChild(selectoptions[num])
            selectoptions[num].addEventListener("click",function(){
                selectnums.textContent=areastrings[num][0]
                selectnum=num;
                if(selecting!=0){
                    unselect();
                    select();
                }
                console.log(num)
            })
            selectoptions[num].addEventListener("mousedown",function(){
                selectoptions[num].style.borderStyle='inset'
            })
            selectoptions[num].addEventListener("mouseup",function(){
                selectoptions[num].style.borderStyle='outset'
            })
            selectoptions[num].addEventListener("mouseenter",function(){
                selectoptions[num].style.background='#888888'
            })
            selectoptions[num].addEventListener("mouseleave",function(){
                selectoptions[num].style.background='lavenderblush'
                selectoptions[num].style.borderStyle='outset'
            })
        }
        selectarea.addEventListener("click",function(){
            selectlist.style.display='block'
        })
        selectarea.addEventListener("mouseenter",function(){
            selectarea.style.background='#cccccc'
        })
        selectarea.addEventListener("mouseleave",function(){
            selectarea.style.background='#ffffff'
        })
        selectlist.addEventListener("mouseleave",function(){
            selectlist.style.background='#ffffff'
            selectlist.style.display='none'
            //console.log('out of list')
        })
        btn.addEventListener("click",function(){selectlist.style.display='none'})
        let jubao=$('.ipsResponsive_hideDesktop')
        $(btn).insertBefore($('form[data-role="treeListing"]')[0]);
        $(selectarea).insertBefore($('form[data-role="treeListing"]')[0]);
    }
    insertselect();
    function insertreorder(){
        let areastrings=[
            ['获取时间升序'],
            ['获取时间降序'],
            ['过期时间升序'],
            ['过期时间降序'],
            ['名字升序'],
            ['名字降序']
        ];
        let btn = document.createElement("button");
        if(reordering==0){
            btn.textContent ="开始排序"
        }else{
            btn.textContent ="排序生效中"
        }
        setStyle(btn,{
            width: '100px',
            height: '32px',
            borderRadius: '7px',
            background: 'palegreen',
            color:'#000000',
            fontSize:'inherit',
            textAlign: 'center',
            marginTop:'8px',
            marginBottom:'8px',
            marginLeft:'10px'
        })
        btn.addEventListener("click",function(){
            if(reordering==0){
                reordering=1
                reorder();
                btn.textContent ="排序生效中"
            }else{
                btn.textContent ="开始排序"
                reordering=0
            }
        })
        btn.addEventListener("mouseenter",function(){
            //console.log('mousein')
            setStyle(btn,{background: '#999999', cursor: 'pointer'})
        })
        btn.addEventListener("mouseleave",function(){
            //console.log('mouseout')
            if(reordering==0){
                setStyle(btn,{background: 'palegreen'})
            }else{
                setStyle(btn,{background: 'red'})
            }
        })
        btn.addEventListener("mousedown",function(){
            //console.log('mousedown')
            setStyle(btn,{background: '#555555'})
        })
        btn.addEventListener("mouseup",function(){
            //console.log('mouseup')
            if(reordering==0){
                setStyle(btn,{background: 'palegreen'})
            }else{
                setStyle(btn,{background: 'red'})
            }
        })
        let selectarea = document.createElement("button")
        let selectnums = document.createElement("p")
        selectnums.textContent=areastrings[0][0]
        selectnums.style.margin='auto'
        selectnums.style.padding='initial'
        selectnums.style.width='max-content'
        selectnums.style.textAlign='center'
        selectnums.style.width='130px'
        selectarea.appendChild(selectnums)
        setStyle(selectarea,{
            position:'relative',
            marginTop:'8px',
            marginBottom:'8px',
            marginLeft:'8px',
            padding:'0',
            lineHeight:'30px',
            width: '130px',
            height: '32px',
            borderRadius: '7px',
            background: '#ffffff',
            color:'#000000',
            fontSize:'inherit',
            fontWeight:'inherit',
            fontStyle:'inherit',
            textAlign:'center'
        })

        let selectlist = document.createElement("ul");
        setStyle(selectlist,{
            position:'absolute',
            margin:'0',
            padding:'0',
            listStyle:'none',
            width: '130px',
            height: '256px',
            background: '#ffffff',
            color:'#000000',
            fontSize:'inherit',
            fontWeight:'inherit',
            fontStyle:'inherit',
            display:'none',
            overflow:'auto',
            scrollbarWidth:'thin',
            zIndex:'99'
        })


        let selectoptions = new Array();
        for(let num=0;num<areastrings.length;num++){
            selectoptions[num]=document.createElement("li");
            setStyle(selectoptions[num],{
                position:'relative',
                width: '130px',
                height: '32px',
                background: 'lavenderblush',
                color:'#000000',
                fontSize:'16px',
                fontWeight:'bold',
                display:'block',
                margin:'1px',
                borderWidth:'medium',
                borderStyle:'outset',
                zIndex:'100'
            })
            selectoptions[num].textContent=areastrings[num]
            if(areastrings[num].length>1){selectoptions[num].style.width='max-content'}
        }
        selectarea.appendChild(selectlist)
        for(let num=0;num<areastrings.length;num++){
            selectlist.appendChild(selectoptions[num])
            selectoptions[num].addEventListener("click",function(){
                selectnums.textContent=areastrings[num][0]
                reordernum=num;
                if(reordering!=0){
                    reorder();
                }
                console.log(num)
            })
            selectoptions[num].addEventListener("mousedown",function(){
                selectoptions[num].style.borderStyle='inset'
            })
            selectoptions[num].addEventListener("mouseup",function(){
                selectoptions[num].style.borderStyle='outset'
            })
            selectoptions[num].addEventListener("mouseenter",function(){
                selectoptions[num].style.background='#888888'
            })
            selectoptions[num].addEventListener("mouseleave",function(){
                selectoptions[num].style.background='lavenderblush'
                selectoptions[num].style.borderStyle='outset'
            })
        }
        selectarea.addEventListener("click",function(){
            selectlist.style.display='block'
        })
        selectarea.addEventListener("mouseenter",function(){
            selectarea.style.background='#cccccc'
        })
        selectarea.addEventListener("mouseleave",function(){
            selectarea.style.background='#ffffff'
        })
        selectlist.addEventListener("mouseleave",function(){
            selectlist.style.background='#ffffff'
            selectlist.style.display='none'
            //console.log('out of list')
        })
        btn.addEventListener("click",function(){selectlist.style.display='none'})
        let jubao=$('.ipsResponsive_hideDesktop')
        $(btn).insertBefore($('form[data-role="treeListing"]')[0]);
        $(selectarea).insertBefore($('form[data-role="treeListing"]')[0]);
    }
    insertreorder();
    $('div.ipsBlock_actionbar.clearfix')[0].remove();
    // Your code here...
})();