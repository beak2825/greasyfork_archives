// ==UserScript==
// @name        Eka's Portal Direct Download
// @namespace   com.aryion.underside.hungry-vixen-userscripts
// @description Add direct download links to items on aryion.com searches and galleries.
// @usage       Help satisfy your ravenous hunger for vore. When you don't want appetite spoilers in the comments or just want to quickly add links to your download manager to take your order to go.
// @include     *aryion.com/g4/*
// @version     1.0
// @icon        data:image/png;base64,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
// @downloadURL https://update.greasyfork.org/scripts/29136/Eka%27s%20Portal%20Direct%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/29136/Eka%27s%20Portal%20Direct%20Download.meta.js
// ==/UserScript==
var EkaDownloadTool={
//Keeping a small footprint with encapsulation.
    _listGalleryItems:function(){
      var _list=[];
      var _pglist=document.getElementsByTagName('li');
      //Get all the <li> tags
	  for(var x=0,ln=_pglist.length;x<ln;x++){
        if(_pglist[x].className=="gallery-item"){
			//but just the ones we want get added to the list.
			_list.push(_pglist[x]);
        }
      }
      return _list;
	}
    ,
	_getTitle:function(item){
      var seek=item.getElementsByTagName('p');
      //get all the <p> tags in out target
	  //which should be a gallery-item
	  for(var w in seek){
        if(seek[w].className=="item-title"){
          //when we find the title return it.
			return seek[w].innerHTML                                                
        }
      }
    //If we don't find the title, it may be because of a messed up search result page.
	//I'll compensate the best I can.
      return ("Title Not Found")                        
    }
    ,
	_makeLink:function(item){
      //Make and return a direct download link for the item.
	  var el=document.createElement("a");
      el.href=("http://aryion.com/g4/data.php?id="+item.id);
      el.innerHTML=("Download "+EkaDownloadTool._getTitle(item)+"");
	  el.style=("display:block;position:absolute;");
	  return el
    }
    ,
	_appendDownloadLinks:function(gallery){
      for(var x=0,ln=gallery.length;x<ln;x++){
        //Add a child element to each gallery item, make them download links.
		gallery[x].appendChild(EkaDownloadTool._makeLink(gallery[x]));
		//It's like getting all the gallery items pregnant with HTML elements.
	  }
    }
    ,
	helper:function(){
      //A facade function to make adding links easy.
	  EkaDownloadTool._appendDownloadLinks(EkaDownloadTool._listGalleryItems());
    }
  };
  EkaDownloadTool.helper();