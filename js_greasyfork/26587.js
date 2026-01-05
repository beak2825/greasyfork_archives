// ==UserScript==
// @author         Matteo Burbui @maxeo90
// @name           jQuery CssDynamic
// @description    A dinamic system to customize style css. It append the rules in the end of body
// @license        https://creativecommons.org/licenses/by-sa/4.0/
// @version        1.1.1
// @grant          none
// ==/UserScript==
(function( $ ){
   $.fn.cssDynamic = function(prop) {
     var selector=$(this).selector;
     var data,fval,action,idStyle,newName;
     
     if(typeof(prop)=='object'){
      fval=1,data='';
      for (var k in prop){
        if (prop.hasOwnProperty(k)) {
          data+=k+':'+prop[k]+';'
        }
      }
     }else if(prop=='rename' && arguments[2]!=undefined ){
       fval=0;
       newName=arguments[2];
     }else if(arguments[1]!=undefined){
       fval=2;
       data=arguments[0]+':'+arguments[1]
     }else if(prop=='remove'){
       fval=0;
     } else{return 'error'}
     action=(arguments[fval]==undefined)?'add':arguments[fval];
     idStyle=(arguments[fval+1]==undefined)?'cssDynamic':arguments[fval+1];
     
     switch(action) {
      case 'new':
        actNew()
        break;
      case 'add':
        actAdd()
        break;
      case 'remove':
        actRemove()
        break;
      case 'renew':
        actRemove()
        actNew()
        break;
      case 'rename':
        actRename()
        break;
     }
     function chData(){
       data=selector+'{'+data+'}'
     }
     function actNew(){
       chData();
       $('body').append('<style id="'+idStyle+'">'+data+'</style>')
     }
     function actAdd(){
       if(!$('#'+idStyle).length){
         actNew()
       }else{
         chData();
         $('style#'+idStyle).append(data)
       }
     }
     function actRemove(){
       $('style#'+idStyle).remove();
     }
     
     function actRename(){
       $('style#'+idStyle).attr('id',newName);
     }
      return this;
   }; 
})( jQuery );