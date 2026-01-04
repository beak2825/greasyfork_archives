// ==UserScript==
// @name         WME Sort Comments
// @namespace    waze-bg
// @version      0.1.20200114
// @description  Automatically sort comments in comment objects by date, current sorting is broken
// @author       DataMatrix47
// @include 	   /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor.*$/
// @exclude        https://www.waze.com/user/*editor/*
// @exclude        https://www.waze.com/*/user/*editor/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395154/WME%20Sort%20Comments.user.js
// @updateURL https://update.greasyfork.org/scripts/395154/WME%20Sort%20Comments.meta.js
// ==/UserScript==

//W.model.mapComments.objects returns comment objects in current selection (or in view?)


function DM47WMECommentSort() {
    var wazeapi = W || window.W;
    var _sf=wazeapi.selectionManager.getSelectedFeatures();
    //_sf[0].layer.selectedFeatures - array with selected features, contatins "OpenLayers_Feature_Vector_#", but it's useless
    //_sf[0].layer._featureMap{"commentObjectID"} where the key "commentObjectID points to the comment object and can be referenced via W.model.mapComments.objects
    //W.model.mapComments.getObjectById("commentObjectID")
    console.log(_sf);
    if(_sf.length==1 && typeof _sf[0].layer !='undefined' && _sf[0].layer.featureType=='mapComment') {
    	console.log(_sf[0].layer._featureMap);
        var _comentsort=[];
        var $commentList=$('.comment-list');
        $commentList.find('.comment .date').each(function(ind,ele){
            var $date=$(ele);
            var $comment=$date.parents('.comment');
            var cdate=new Date($date.text());
            var sortval=(cdate.getTime()*1000+ind);
            $comment.attr('data-sort',sortval);
            _comentsort.push({'val':sortval,'ele':$comment});
        });
        for(var __i in _comentsort.sort(function(a,b) { if(a.val<b.val) return -1; if(a.val>b.val) return 1; return 0 })) {
            $commentList.append(_comentsort[__i].ele.detach());
        }
    }
}

function DM47WMECommentSort_init() {
    var wazeapi = W || window.W;
    if(!wazeapi || !wazeapi.map) {
        setTimeout(DM47WMECommentSort_init, 1000);
        return;
    }
    wazeapi.selectionManager.events.register('selectionchanged',null,DM47WMECommentSort);
    console.log('Init DM47WMECommentSort');
}

(function() {
    'use strict';

    DM47WMECommentSort_init();

})();