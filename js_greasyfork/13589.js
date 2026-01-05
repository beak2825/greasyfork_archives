// ==UserScript==
// @name         AlmaScript
// @namespace    https://greasyfork.org/en/scripts/13589-almascript
// @version      0.2
// @description  Fixes for Alma's GUI
// @author       Ryan Meyers
// @match        https://gss.getalma.com/assignment/*/grades
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/13589/AlmaScript.user.js
// @updateURL https://update.greasyfork.org/scripts/13589/AlmaScript.meta.js
// ==/UserScript==

// Add jQuery, unless it already exists
if(typeof jQuery === 'undefined'|| !jQuery){
    (function(){
        var s=document.createElement('script');
        s.setAttribute('src','https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js');
        if(typeof jQuery=='undefined'){
            document.getElementsByTagName('head')[0].appendChild(s);
        }
    })();
}
var namesList = [];

(function(){
    var codeToExecute = function(){
    
        /***********************/
        // YOUR CODE HERE
        /***********************/
        var elements = $('select[name^="StudentGrades"').not('[name$="[Status]"]');
        elements.after(' <a href="#" style="font-size:large">&varr;</a> <a href="#" style="font-size:large">&harr;</a>');
                                                       
        
        
        var elementSorter = [];
        var idOrder = $('input[name$="[StudentId]"');
        console.log(idOrder);
        
        for(var i=0; i<idOrder.length; i++)
        {
            namesList[idOrder[i].value] = idOrder[i].parentElement.innerText;
        }
       // console.log(namesList);
       elements.sort(SortByName);
      // console.log(elements);
        for(var ii=0; ii<elements.length; ii++)
        {
            elements[ii].tabIndex=ii+1;
            $(elements[ii]).next().click(function(){
                var profselector = $(this).prev().attr('name').split('[Proficiencies][')[1];
                var fillelements = $('select[name$="'+profselector+'"]');
                fillelements.val($(this).prev().val());
                //console.log(fillelements);
                //a.name.split('[Proficiencies][')[1]
            });
            $(elements[ii]).next().next().click(function(){
                var profselector = $(this).prev().prev().attr('name').split('[Proficiencies][')[0];
                var fillelements = $('select[name^="'+profselector+'"]').not('[name$="[Status]"]');
                fillelements.val($(this).prev().prev().val());
                //console.log(fillelements);
                //a.name.split('[Proficiencies][')[1]
            });
            //  $(elements[ii]).after('<a href="#" style="font-size:x-small">FILL</a>');
            
        }
        $('.line-clamp-3').removeClass('line-clamp-3');
                                                       
       //  $('.pure-table').fixedHeaderTable({fixedColumn: true });
        
    };
    
    function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
    }

    
    //idOrder.sort(SortByParentTitle);
    
  //  function
    
    
    function SortByName(a, b){
        
        //console.log(idOrder);
       
         //console.log(idIndex);
       //console.log(a.name);
        var aName = a.name.split('[Proficiencies]')[1]+' '+namesList[a.name.split('StudentGrades[')[1].split('][Proficiencies')[0]];
        var bName = b.name.split('[Proficiencies]')[1]+' '+namesList[b.name.split('StudentGrades[')[1].split('][Proficiencies')[0]];
       // console.log(aName);
        return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
    }
 

    var intervalInt = window.setInterval(function(){
        if(typeof jQuery !== 'undefined' && jQuery){
            // Clear this interval
            window.clearInterval(intervalInt);
            
            codeToExecute();
        }
    }, 100);
})();