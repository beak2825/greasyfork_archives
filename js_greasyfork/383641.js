// ARIA favlet via http://www.manateeroad.com/favelets/revealariaCheck.js

var ariaCheck = {
    start: function(myDocument){

        //Instead of window. for global
        //we use aA. so that we don't have
        //variables that might get mixed in
        //with site-level js

             var aA=[];

             // counting
             aA.foundCount = 0;

             //for id of added spans
             //so we can removed them
             aA.idi=0;

             //for frames outside domain
             //so we can report them
             aA.framemsg='';
             aA.fi=0;

             // for landmark outline styles
             // so we can keep switching them
             // even through frames
             aA.cx=-1;
             aA.bx=-1;
             aA.wx=-1;

             //might as well have these here too
         aA.c=['#800000','#000080','#006D00','#800080','#202020'];
         aA.b=['solid','dotted','dashed','double','solid','double'];
         aA.w=['2','2','2','4','3','6'];


        //recursive through frames
             aA = ariaCheck.checkFrames(myDocument,aA);

       //reporting
             ariaCheck.provideMessage(aA);
    },
    checkFrames: function(myDocument,aA){

        //run ariaCheck.aria123 check for current document which might
        //have frames or aria or both

        aA = ariaCheck.aria123(myDocument,aA);

        //run ariaCheck.checkFrames for each frame's document if there
        //are any frames
        var frametypes=['frame','iframe','ilayer'];
        for (var x=0;x<frametypes.length;x++) {
            var myframes=myDocument.getElementsByTagName(frametypes[x]);
            for (var y=0;y<myframes.length;y++) {
                try {
                     //alert('in try');
                     ariaCheck.checkFrames(myframes[y].contentWindow.document,aA);
                } catch(e) {
                     //errors are stored in aA too
                     aA.framemsg=aA.framemsg + '\n' +  myframes[y].src;
                     aA.fi=aA.fi + 1;
                }
            }
        }
        return aA;
    },
    provideMessage: function(aA) {
      var pl, pl1, pl2;
        if(aA.foundCount!=1){
          pl='s';
          pl1='are indicated by';
          pl2='were';
        } else {
          pl='';
          pl1='is indicated by an';
          pl2='was';
        }

        var m = [
            'No ARIA attributes were found.',
            'No aria attributes were found and by that we mean no roles, no tabindex of -1, and no attributes starting with ariaCheck.',
            'No, no ARIA attributes here.',
            'Not a single aria attribute was found - not one!',
            'Nope, no aria attributes here either! The spec isnt even final yet, you know.'
        ];
        var mx = Math.floor(Math.random()*5); 
        if(aA.foundCount==0) {
             alert(m[mx]);
        } else {
             alert(aA.foundCount + ' element' + pl + ' with ARIA ' +  pl2 + ' found and ' + pl1 + ' h6 heading' + pl + '.');
        }

       // alert(alertmessage);
    },
    inArray: function(arr, obj) {
        for(var i=0; i<arr.length; i++) {
            if (arr[i] == obj) return true;
        }
        return false;
    },
    aria123: function(mydocument,aA){
        if (mydocument == null) {
            return;
        }
         //create object just to check length of the properties array
         var jt_generic_obj = mydocument.createElement('var');
         var ie7 = false;
         if (jt_generic_obj.attributes.length > 0) {
             ie7 = true;
         }


         //changes as we add things
      	 var eLive;
         if (mydocument.all) {
             // ie
             eLive = mydocument.all;
             // .attributes does not work til 2
         } else {
             eLive = mydocument.getElementsByTagName('*');
         }

         //static (e won't change - don't use eLive while editing page)
         var e = [];
         for (var ij=0; ij<eLive.length;ij++) {
             e[ij] = eLive[ij];
         }

         for (var i = 0; i < e.length; i++) {
         // EACH OBJECT

            //remove anything added last time favelet ran

            var myExpress1 = /ariastAdded.*/;
            if (((ie7 && e[i].attributes && e[i].attributes.id.specified) || (!(ie7) && e[i].hasAttribute('id'))) && myExpress1.test(e[i].getAttribute('id'))) {
                e[i].parentNode.removeChild(e[i]);
                continue;
            }


            //original favelet code from revealARIA

                  var myText = 'Found: ';

                  /*
                  // Check for role
                  // ie7 cannot do this
                  if  ((!(ie7) && e[i].hasAttribute('role'))) {
                      myRole=e[i].getAttribute('role');
                      myText = myText + ' role="' + myRole + '" ';
                  }
                  */


                  //Check for aria- attributes
                  if (e[i].attributes) {
                      for (var x = 0; x < e[i].attributes.length; x++) {
                          var myA = e[i].attributes[x].nodeName.toLowerCase();
                          //alert(myA + ' is ' + e[i].getAttribute(myA) );
                          var myExpress = /ariaCheck.*/;
                          // ie7 if below is only needed when
                          // ie8 immitates ie7 - as then the aria attributes are in 
                          // the ie7-style list of empty attributes
                          if ((!ie7 || (ie7 && e[i].attributes[x].specified)) && ((myExpress.test(myA) && e[i].getAttribute(myA)!=null) || (myA=='tabindex' && e[i].getAttribute(myA)=='-1') || 
    (myA=='role' && e[i].getAttribute(myA)!=null))) {
                               myText = myText + ' ' + myA + '="' + e[i].getAttribute(myA) + '"'; 

                               //check for items with ids
                               var value_is_id_attributes = ['aria-controls','aria-describedby','aria-flowto','aria-labelledby','aria-labeledby','aria-owns','aria-activedescendant'];
                               // all can have a list of ids, except aria-activedescendant

                               if (ariaCheck.inArray(value_is_id_attributes,myA)) {

                                     //report on the attribute


                                     //get array of ids
                                     var id_array = e[i].getAttribute(myA).split(' ');
                                     for (var mapi=0;mapi<id_array.length;mapi++) {
                                         //var myAid=e[i].getAttribute(myA);
                                         var myAid=id_array[mapi];
                                         //alert(mydocument.getElementById(myAid)); 
                                         if (mydocument.getElementById(myAid) != undefined && mydocument.getElementById(myAid) != null) {
                                              //get object
                                              var myIdTarget=mydocument.getElementById(myAid);

                                              var myTextNode2 = mydocument.createTextNode('<'+myIdTarget.tagName.toLowerCase()+' id="'+myAid+'">');

                                              //create message
                                              var mySpan2 = mydocument.createElement('h6');
                                              mySpan2.setAttribute('id', ('ariastAddedid' + i));

                                              //style message
                                              mySpan2.style.color='navy';
                                              mySpan2.style.fontSize='small';
                                              mySpan2.style.fontWeight='bold';
                                              mySpan2.style.backgroundColor='#f5deb3';
                                              mySpan2.style.margin='0';
                                              mySpan2.style.padding='2px';

                                              //append attribute info
                                              mySpan2.appendChild(myTextNode2);

                                              //place message for id's object
                                              var firstthing = myIdTarget.childNodes[0];
                                              if (firstthing == undefined) {firstthing = null;}
                                              myIdTarget.insertBefore(mySpan2,firstthing);
                                         } else {
                                              myText = myText+' [NO ID MATCH] ';
                                         }
                                     }


     
                               }




                          }
                      }
                  }
              
                  //Results per element
                  if (myText != 'Found: ') {
                  
                      aA.foundCount++;
                      
                      //get color
                      aA.cx=(aA.cx+1)%5; 

                      //get border
                      aA.bx=(aA.bx+1)%6;

                      //get width
                      aA.wx=(aA.wx+1)%6;


                      //outline 
                      e[i].style.border=aA.w[aA.wx] + 'px ' + aA.b[aA.bx] + ' ' + aA.c[aA.cx];
                      e[i].style.marginTop='0';
                  

                      //create message
                      var mySpan = document.createElement('h6');
                      mySpan.setAttribute('id', ('ariastAdded' + i));
                      var myTextNode = document.createTextNode(myText);
                      mySpan.appendChild(myTextNode);

                      //style message
                      mySpan.style.color=aA.c[aA.cx];
                      mySpan.style.fontSize='small';
                      mySpan.style.backgroundColor='#f5deb3';
                      mySpan.style.border=aA.w[aA.wx] + 'px ' + aA.b[aA.bx] + ' ' + aA.c[aA.cx];
                      mySpan.style.borderBottom='0';
                      mySpan.style.padding='2px';
                      mySpan.style.margin='0px';
                      mySpan.style.clear='left';

                      if (e[i].clientWidth && (e[i].clientWidth > 72)) {
                          mySpan.style.width=e[i].clientWidth - 4 + 'px';
                      }
                  

                      // place message just before element it is about
                      e[i].parentNode.insertBefore(mySpan,e[i]);

                      //create end message
                      var myEnd = document.createElement('div');
                      myEnd.setAttribute('id', ('ariastAddedend' + i));
                      var myEndTextNode = document.createTextNode('END Element');
                      myEnd.appendChild(myEndTextNode);

                      //style end message offscreen
                      myEnd.style.position='fixed';
                      myEnd.style.left='-199px';
                      myEnd.style.top='auto';
                      myEnd.width='1px';
                      myEnd.height='1px';
                      myEnd.overflow='hidden';

                      // place end message just after element it is about
                      e[i].parentNode.insertBefore(myEnd,e[i].nextSibling);

                  }
              
         }
        // close going through each object


        //Return argument array
        return aA;
    }

};

//Feb 21, 2013
//the main code from the quick and dirty favelet that used
//to be revealariaCheck.js has been copied into the framework of
//the Landmarks favelet, so it can go through frames & reuse other features 
//Marks targets of every WAI-ARIA id reference, even when they are in lists