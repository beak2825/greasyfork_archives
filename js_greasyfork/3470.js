// ==UserScript==
// @name       Orareview Helper
// @version    0.1.6
// @description  Help you making life easier when orareview. 
// @namespace https://greasyfork.org/users/3729
// @match      https://orareview.us.oracle.com/*
// @require    https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @grant      unsafeWindow
// @grant      GM_log
// @grant      GM_setClipboard
// @copyright  2014, Rex
// @downloadURL https://update.greasyfork.org/scripts/3470/Orareview%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/3470/Orareview%20Helper.meta.js
// ==/UserScript==

(function(document,jQuery) {
    var $=jQuery;
    var patternPageMap={"onMainPage":/\.com\/\d+$/g, "onDiffPage":/\.com\/\d+\/diff[2]?\/\d+(:\d+)?\/\d+/g};
    
    var paramLineWidth='display_width',patternLineWidth=new RegExp(paramLineWidth);
    var preferedLineWidth=80;
    function log(){
        unsafeWindow.console.debug(arguments); 
    }
    function getPreferedLineWidth(){
        var lineNumberColWidth=0, codeViewportWidth=0, windowWidth=jQuery(unsafeWindow).width();
        if(!!jQuery('table#table-top').length){
            codeViewportWidth=jQuery('table#table-top').width();
            jQuery('table#thecode:first tbody tr:eq(1) b').each(function(i,col){
                lineNumberColWidth=jQuery(col).width();
            });
        }
        if(lineNumberColWidth==0){
            lineNumberColWidth=42;
            if(codeViewportWidth==0){
             	codeViewportWidth=windowWidth-26;
            }
        }
        return parseInt(((codeViewportWidth-lineNumberColWidth*2)/2)/7);
    }
    function onDiffPage(){
        //log('onDiffPage');
        var patternMatch=false,lineContent=null,filter=null;
        var lineFilters=[{name:"CreationDate",pattern:/CreationDate/},{name:"LastUpdateDate",pattern:/LastUpdateDate/},{name:"LastUpdateLogin",pattern:/LastUpdateLogin/},{pattern:/CreatedBy/},{pattern:/LastUpdatedBy/},{pattern:/BaseFlowParameterId/},{pattern:/BaseTaskParameterId/},{pattern:/<BaseFlowTaskParameterId>/},{pattern:/BaseFlowTaskParamId/},{pattern:/<prop prop-type="ObjectVersionNumber"/},{pattern:/prop-type="GUID"/},{pattern:/prop-type="extract_date"/},{pattern:/<DefaultVal>\d+<\/DefaultVal>/}];/**['<CreationDate>','<LastUpdateDate>','<LastUpdateLogin>','<BaseFlowParameterId>'];*/
        jQuery("table#thecode tbody tr[id*=pair]:not(:has(td[class*=oldequal]))").each(function(i,tr){
          tr=jQuery(tr);
          lineContent=tr.text();
          patternMatch=false;
          for(i in lineFilters){
              filter=lineFilters[i];
            if(filter && filter.pattern && filter.pattern.test(lineContent)){
                //log(lineContent, filter.pattern, tr);
                patternMatch=true;
                break;
            }
          }
          if(patternMatch){tr.toggle();}else{//remove spaces only changes TOCONFIG
              var diffsInline=tr.find("[class*=dark]");
              if(!jQuery.trim(diffsInline.text()).length){
                  if(diffsInline.parents("td:first").index()==0)
                  	  diffsInline.addClass('oldequal');
                  else
                      diffsInline.addClass('newequal');
              }
          }
        });
        //0.1.5
        if(unsafeWindow.hookState){
            unsafeWindow.hookState.updateHooks();
        }
        //clipboard support
        //add a hidden button
        var filePath = jQuery('div.code:first #table-top > div:nth-child(1) h3');filePath.css("display","inline-block");
        var clipboardButton= jQuery("<button>Copy(<u>O</u>)</button>").attr("id","clipboardButton").attr("title","Click to copy full path.").css('margin-left',20).click(function(){
        	GM_setClipboard(filePath.text());
            clipboardButton.toggleState();
        });
        clipboardButton.toggleState=function(){
            clipboardButton.html('Copied');
            unsafeWindow.setTimeout(function(){
                clipboardButton.html('Copy(<u>O</u>)');
            },2000);
        }
        onDiffPageAttachKeyEvents();
        filePath.after(clipboardButton);
        //remain current display width when jumping to another file
        var fileJumper=jQuery('select[onChange*=M_jumpToPatch]:first');
        var displayWidth=parseInt(jQuery(":input[name="+paramLineWidth+"]:visible:first").val());
        
        fileJumper.children().each(function(i,opt){
            if(i==0 && patternLineWidth.test(opt.value)){
                return false;
            }else if(i==0){
                if(isNaN(displayWidth) || displayWidth==80){
                	displayWidth=getPreferedLineWidth();
            	}   
            }
          opt.value+='?display_width='+displayWidth;
        });//*/
        //mark file reviewed/not reviewed
        var statusPanel=fileJumper.parent().nextAll('div:has(a[href*=mark_file_reviewed]):first');
        if(statusPanel.length>0){
            var selectedOption=fileJumper.children(':selected:first');
            var markTrigger=statusPanel.find('a[href*=mark_file_reviewed]:first');        
            var statusDescriptor=jQuery('<span style="margin-right:5px;"></span>');
            statusDescriptor.text('Status: '+jQuery.trim(statusPanel.text()).match(/Status:\s(\w+(\s\w+)?)/)[1]);
            statusPanel.html('').append(statusDescriptor).append(markTrigger);
            
            var currentReviewStatus=null;//true|false
            var currentReviewStatusText=null;//'Reviewed'|'Not Reviewed'
            var reviewStatusMap={'Reviewed':true,'Not Reviewed':false,true:'Reviewed',false:'Not Reviewed'};
            var getCurrentReviewStatusText=function(){
                if(currentReviewStatusText==null){
                    var matchGroup=statusDescriptor.text().match(/Status:\s(\w+(\s\w+)?)/);
                    if(matchGroup && matchGroup.length>1){
                        currentReviewStatusText = matchGroup[1];
                    }
                }
                return currentReviewStatusText;
            }
            var getCurrentReviewStatus=function(){
                if(currentReviewStatus==null){
                    currentReviewStatusText=getCurrentReviewStatusText();
                    currentReviewStatus=reviewStatusMap[currentReviewStatusText];
                }
                return currentReviewStatus;
            }
            var setClientReviewStatus = function(reviewed){//true|false
                if(reviewed==currentReviewStatus){
                  return;   
                }
                var newStatusText=reviewStatusMap[reviewed];
                statusDescriptor.text('Status: '+newStatusText);
                markTrigger.text('Change Status to '+reviewStatusMap[!reviewed]);
                //change selected option
                selectedOption.text(selectedOption.text().replace(/\((R|V)\)/,function(match0,status){
                  return status=='V'?'(R)':'(V)';
                }));
            }
            var toggleClientReviewStatus = function(){
                setClientReviewStatus(!currentReviewStatus);
            };
            markTrigger.click(function(evt){
                //console.log(evt,evt.target,evt.target.href);
                currentReviewStatus=getCurrentReviewStatus();
                jQuery.ajax(evt.target.href,{
                    success:function(data,status,xhr){
                        //change to server status only when really successfully loaded
                        currentReviewStatus=!currentReviewStatus;
                    },error:function(xhr,status,errorThrown){
                        //console.log('onerror',status,errorThrown,xhr.status,xhr);
                        if(xhr.readyState!=0){
                            unsafeWindow.alert('Failed to mark file as ['+currentReviewStatusText+'].');
                            //revert change
                            setReviewStatus(currentReviewStatus);
                        }
                    }
                });
                //mark successfull immediately. But if error occured later, revert this change.
                setTimeout(toggleClientReviewStatus,1000);
                return false;
            });
        }
    }
    function onDiffPageAttachKeyEvents(){
        var oldKeypressFn =document.onkeypress;
        document.onkeypress=function(evt){
            var ret = M_keyPressCommon(evt, function(key) {
                if (key == 'o') {
                  // copy full file path
                    var filePath = jQuery('div.code:first #table-top > div:nth-child(1) h3');filePath.css("display","inline-block");
                    if (filePath){ 
                        GM_setClipboard(filePath.text()); 
                        return true;
                    }
                }
                return false;
              }, M_commentTextKeyPress_);
            if(ret){
             	return true;   
            }
            if(oldKeypressFn){
                return oldKeypressFn.apply(unsafeWindow,[evt]);
            }
            return false;
        };
    }
    function onMainPage(){
        //change default line width of orareview diff page
        //log('onMainPage');
        var diffLink = null;
        var paramName=paramLineWidth, adjustedParamValue = preferedLineWidth?preferedLineWidth:105, paramRegExp = new RegExp(paramName+'=(\d*)');
        jQuery('a[href*=diff]').each(function(i,a){
          a=jQuery(a);
          diffLink = a.attr('href');
          if(/^\/\d+\/diff[2]?\/\d+(:\d+)?\/\d+$/.test(diffLink)){
            if(!/\?/.test(diffLink)){diffLink+='?';}else{
                if(!/\?$/.test(diffLink)){
                    diffLink+='&';
                }
            }
            if(paramRegExp.test(diffLink)){
                diffLink=diffLink.replace(paramRegExp,paramName+'='+adjustedParamValue);
            }else{
                diffLink+=paramName+'='+adjustedParamValue;
            }
            a.attr('href',diffLink);
          }
        });
    }
    function main(){
        log('Orareview Helper loaded.',jQuery);
        unsafeWindow.jQuery=jQuery;
        preferedLineWidth=getPreferedLineWidth();
        var documentLocation = document.location.href;
        //log('preferedLW',preferedLineWidth,'documentLocation',documentLocation);
        var pattern=null;
        for(fnd in patternPageMap){
            pattern=patternPageMap[fnd];
            if(pattern.test(documentLocation)){
                log(fnd,pattern);
            	eval(fnd+'.apply()');
                break;
            }
        }
    }
	main();
})(window.document,jQuery);