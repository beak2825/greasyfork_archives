// ==UserScript==
// @name         Tabula+
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds additional features to tabula
// @author       You
// @include        /(http|https):\/\/tabula.warwick.ac.uk\/coursework\/?(|#[^\/]*)$/
// @grant        none
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/376554/Tabula%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/376554/Tabula%2B.meta.js
// ==/UserScript==


if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) {
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}
var tab = "https://tabula.warwick.ac.uk"
function getModules(onGot){
    $.ajax({type:"GET",url:tab+"/api/v1/member/me/assignments",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: onGot,
    error: console.log});
}
function rO(key,e){
    var i = window.localStorage.getItem(key);
    if(i==null&&e!=undefined){
        return e;
    }
    return JSON.parse(i);
}
function wO(key,item){
    window.localStorage.setItem(key,JSON.stringify(item))
}
function getByID(id){
    for(var i in assg){
        if(assg[i].id==id){
            return assg[i];
        }
    }
}
function indexByID(id){
    for(var i in assg){
        if(assg[i].id==id){
            return i;
        }
    }
}

var ls = window.localStorage
var assg;
function getAverage(){
    var t=0;
    var w=0;
    assg.forEach(function(a){
        if(a.worth==null||a.mark==null){
            return;
        }
        t+=a.worth*Number(a.mark);
        w+=a.worth
    });
    return t/w;
}
function onReady(){
    if(ls.getItem("assg")==null){
        wO("assg",[]);
       }
    assg = rO("assg");
    var asslist = assg.map(function(o){return o.id});
    getModules(function(r){
        console.log("Modules fetched");
        r.historicAssignments.forEach(function(a){
            if(a.feedback!=null){
                if(!asslist.includes(a.id)){
                console.log(asslist,a.id)
                    assg.push({id:a.id,
                               module:a.module,
                               name:a.name,
                               date:a.closeDate,
                               mark:a.feedback.mark,
                               cats:15,
                               worth:null
                              });
                }
                if(getByID(a.id).worth==null){
                    $('a[href="https://tabula.warwick.ac.uk/coursework/submission/'+a.id+'"].btn-primary.btn').parent().append('<input type="text" placeholder="Module Worth (%)" aid = "'+a.id+'" style="width:100%;margin-top:10px;height:30px,border-radius:4px"></input>');
                    let tb = $('[aid="'+a.id+'"]');
                    tb.keyup(function(event) {
                        if (event.keyCode === 13) {
                            assg[indexByID(a.id)].worth=tb.val()/100
                            tb.remove();
                            wO("assg",assg)
                        }
                    });
                }
                if(getByID(a.id).mark==null){
                    var newbtn = $('a[href="https://tabula.warwick.ac.uk/coursework/submission/'+a.id+'"].btn-primary.btn').parent().append('<input type="text" placeholder="Input Mark Manually (%)" bid = "'+a.id+'" style="width:100%;margin-top:10px;height:30px,border-radius:4px"></input>');
                    let tb = $('[bid="'+a.id+'"]');
                    tb.keyup(function(event) {
                        if (event.keyCode === 13) {
                            assg[indexByID(a.id)].mark=Number(tb.val());
                            tb.remove();
                            wO("assg",assg);
                        }
                    });
                }
            }


        });
    var stats = $('#student-completed-container').clone().appendTo($('#student-completed-container').parent());
    stats.attr('id','student-stats-container');
    var statsContainer = stats.find('div').find('div');
    var statsList = statsContainer.find('div');
    statsContainer.find('h4').click(function(){
        statsContainer.parent().toggleClass('expanded');
        var i = $(this).find('i');
        i.toggleClass('fa-chevron-down fa-chevron-right')

    });
    statsContainer.find('h4').get(0).lastChild.nodeValue = "My Stats";
    statsList.find('.row').hide();
    statsList.children("[id^='assignment-container-']").remove();
    statsList.append('<div class="item-info row"> <div class="col-md-3"> <div class="module-title"> <span class="mod-code">{0}</span> </div> <h4 class="name"> </h4> </div> <div class="col-md-6"> <div class="feedback-status">{1} </div> </div> </div>'.format('Weighted Feedback Average',getAverage().toFixed(2)+"%"))
        wO("assg",assg);
    });
};
$(document).ready(onReady);