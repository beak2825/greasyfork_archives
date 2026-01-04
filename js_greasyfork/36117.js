// ==UserScript==
// @name         UltraKey
// @namespace    saqfish
// @version      0.1.0.1
// @description  uh
// @author       saqfish
// @match      *://*/*
// @require     https://code.jquery.com/jquery-3.2.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36117/UltraKey.user.js
// @updateURL https://update.greasyfork.org/scripts/36117/UltraKey.meta.js
// ==/UserScript==
$(document).ready(function() {

    (function() {
        'use strict';
        var waitClick = false, type = null, maxElements = new Array(10), _elementSet = 0;
        var _frame = $('#MainContent').find('iframe')[0];

        var _sendChild = (_child,e)=>{
            _child.contentWindow.postMessage(e, '*');
        }
        var disableE=(e,t)=>{
            $(e).attr("disabled", t);
        }
        var _apply = (e,_key)=>{
            let _apply = $('<button/>',{id:"applyButton", text:"Apply", click:(_e)=>{
                _sendChild(_frame,{job:"apply",data:_key});
                maxElements = new Array(10);
                _elementSet = 0;
                waitClick = false;
                _control.children().not('#addButton, #status').remove();
                _control.before($('<div/>',{class:"project-detail-bar", text:JSON.stringify(_key)}));
                statusUpdate('<- Click to Add');
            }});
            e.before($(_apply));
            statusUpdate('<- Apply start');

        }
        var _uKey={};
        var _applyKey = (e)=>{
            let _elements = [];
            $.each(e.data,(i,_e)=>{
                switch(e.function.type){
                    case 'click':
                        $(document).on('keydown',(_ee)=>{
                            if(_ee.keyCode == e.function.data.key){
                                $(document.evaluate(_e,document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue).trigger('click');
                            }
                        });
                        break;
                    case 'paste':
                        $(document).on('keydown',(_ee)=>{
                             if(_ee.keyCode == e.function.data.key){
                                 let _elm =  $(document.evaluate(_e,document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue);
                                 _elm.val(e.function.data.word);
                            }
                        });
                        break;
                }
            });


        }

        function getXPath( element )
        {
            var xpath = '';
            for ( ; element && element.nodeType == 1; element = element.parentNode )
            {
                var id = $(element.parentNode).children(element.tagName).index(element) + 1;
                id > 1 ? (id = '[' + id + ']') : (id = '');
                xpath = '/' + element.tagName.toLowerCase() + id + xpath;
            }
            return xpath;
        }


        var _pdb = $('.project-detail-bar');
        var _row = $('<div/>',{class:"row"});
        var _status = $('<span/>',{id:"status",text:"<-- Click to add", class:""});
        var _control = $('<div/>',{class:"project-detail-bar"});
        var _addButton = $('<button/>',{id:"addButton",text:"Add",class:"", click:(e)=>{
            _uKey={};
            let _butt = e.target;
            let _select = $('<select/>',{name:"ting", id:"clauseSelect"});
            let _elementCount = 0;
            $.each(maxElements,(i,v)=>{ _select.append($(`<option>${i}</option>`,{value:i}))});
            _status.before($(_select));
            _select.change((e)=>{
                _elementSet = e.target.value;

                statusUpdate(`Waiting for ${_elementSet} elment${(_elementSet > 1)?'s':''}`);
                _sendChild(_frame,{job:"elements",count:_elementSet});
                disableE(_select,true); waitClick = true;
            });
            statusUpdate('<- Select number of Elements');
            waitClick = true;
        }});
        var statusUpdate = (t)=>{
            _status.text(t);
        }
        _control.append(_addButton,_status);
        _pdb.before(_control);

        if(window.location.origin.includes('worker.mturk.com')){
            console.log("worker");
            window.addEventListener( "message",
                                    function (e) {
                if($(_frame).attr('src').includes(e.origin)){
                    if(waitClick){
                        if(e.data.job == "elements"){
                            if(e.data.count < _elementSet){
                                let _c = _elementSet-e.data.count
                                statusUpdate(`Waiting for ${_c} elment${(_c > 1)?'s':''}`);
                            }else if(e.data.count == _elementSet){
                                _uKey={elements: e.data.count, data: e.data.data};

                                let _selectOld = $('#clauseSelect');
                                let _elementDetail = $('<button/>',{text:`${e.data.count} Element${(e.data.count > 1)?'s':''}`, click:()=>{
                                    //Show selected element details
                                }});
                                _selectOld.replaceWith(_elementDetail);
                                let _select = $('<select/>',{id:"clauseSelect2"});
                                let _functions = ['None','click','paste'];
                                $.each(_functions,(i,v)=>{ _select.append($(`<option>${v}</option>`,{value:v}))});
                                _status.before($(_select));
                                _select.change((e)=>{
                                    let _target = e.target;
                                    _uKey.function={type:_target.value};
                                    switch(_target.value){
                                        case 'click':
                                            statusUpdate(' Press key [1-9] or [a-z]');
                                            $(document).one('keydown',(_e)=>{
                                                if(_e.keyCode >- 65 && _e.keyCode <= 105){
                                                    statusUpdate('<- Apply start');
                                                    let _selectOld = $(_target);
                                                    let _elementDetail = $('<button/>',{text:`Click on ${_e.key} key`, click:()=>{
                                                        //Show selected element details
                                                    }});
                                                    _selectOld.replaceWith(_elementDetail);
                                                    _uKey.function.data = {key:_e.keyCode};
                                                    _apply(_status,_uKey);
                                                }
                                            });
                                            break;
                                        case 'paste':
                                            statusUpdate(' Press key [1-9] or [a-z]');
                                            $(document).one('keydown',(_e)=>{
                                                if(_e.keyCode >- 65 && _e.keyCode <= 105){
                                                    let _selectOld = $(_target);
                                                    let _elementDetail = $('<button/>',{text:`Click on ${_e.key} key paste ->`, click:()=>{
                                                        //Show selected element details
                                                    }});
                                                    _selectOld.replaceWith(_elementDetail);
                                                    _uKey.function.data = {key:_e.keyCode};
                                                }

                                                let _select = $('<input/>',{id:"pasteInput", change:(_e)=>{
                                                    _uKey.function.data.word =_e.target.value;
                                                    _apply(_status,_uKey);
                                                }});
                                                _status.before($(_select));
                                                statusUpdate('<- Enter to finish');
                                            });
                                            break;
                                    }

                                    // _sendChild(_frame,{job:"elements",count:_elementSet});
                                });
                                statusUpdate('<- Select Function');
                                //disableE(_); waitClick = true;

                            }
                        }
                    }
                }
            },false);
        }
        if(!window.location.origin.includes('worker.mturk.com')){
            console.log("frame");
            let _elements = 0, _bgs = [], _es = [];
            var _sendParent = (e)=>{
                window.parent.postMessage(e, '*');
            }
            window.addEventListener( "message",function (e) {
                console.log(e);
                if(e.data.job == "elements"){
                    $(document).on("contextmenu",(_e)=>{
                        let _ting = _e.target.tagName;
                        _es.push(getXPath(_e.target));
                        _bgs.push({element:$(_e.target),bg:$(_e.target).css('background-color')});
                        $(_e.target).css({"background-color":"green"})
                        _elements++;
                        if(_elements == e.data.count){
                            $(document).off('click');
                            $.each(_bgs,(i,_e)=>{
                                setTimeout(()=>{ _e.element.css({"background-color":_e.bg});},500);
                            });
                            let _sendData = {job:"elements",count:_elements, data: _es}
                            _sendParent(_sendData);
                            $(document).off("contextmenu");
                            _elements = 0;
                            _es = [];
                        }else{

                            _sendParent({job:"elements",count:_elements});

                        }
                        return false;
                    });

                }else if(e.data.job == "apply"){
                    _applyKey(e.data.data);
                }
            },false);

        }
    })();
});