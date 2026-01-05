// ==UserScript==
// @name         studentportalen-extended
// @namespace    http://ventureinto.space
// @version      0.7
// @user-agent   Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:22.0) Gecko/20130328 Firefox/22.0
// @description  Add missing functionality to studenportalen.liu.se
// @author       Nils Eriksson niler851@student.liu.se
// @match        https://www3.student.liu.se/portal/studieresultat/resultat*
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @require      http://code.jquery.com/jquery-2.1.4.min.js
// @require      https://cdn.firebase.com/js/client/2.3.1/firebase.js
// @resource     bootcss https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css
// @downloadURL https://update.greasyfork.org/scripts/13401/studentportalen-extended.user.js
// @updateURL https://update.greasyfork.org/scripts/13401/studentportalen-extended.meta.js
// ==/UserScript==

/* set up FireBASE */

var myFirebaseRef = new Firebase("https://studentportalen-data.firebaseio.com/");

var getAllCourseData = function(){
    var fireCourses = myFirebaseRef.child("courses");
    fireCourses.on("value", function(snapshot) {
        var courses = snapshot.val();
        $('.course-row').each(function(i, row){
            var rowID = $(row).attr('id').replace('*','');
            if(rowID in courses){
                var level = courses[rowID].level
                var select = $(row).find('select');
                selectAlternative(level, select);
               // $(row).find('.'+level).attr('selected',true);

            }
        });  


    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
}();


var updateCourseLevel = function(course ,level){
    var fireCourses = myFirebaseRef.child("courses");
    fireCourses.child(course).set({ "level": level});
}

/* END OF FIREBASE */



$("head").prepend('<meta charset="utf-8">');

console.debug('start: add CSS');
var bootcss = GM_getResourceText('bootcss');
GM_addStyle(bootcss);
console.debug('done: add CSS');


var studiehandbokenBase = "http://kdb-5.liu.se/liu/lith/studiehandboken/svkursplan.lasso?&k_budget_year=2015&k_kurskod="


//// VIEW ////
/*
  Create area for grade info
*/
$("form").append("<div id='info-container' class='container'><div id='snitt' class='col-md-6'><h1>Snitt</h1></div></div>");
$("#snitt").append("<h3 style='margin:0;'>Viktat: <span id='weighted-average-grade'></span></h3>");
$("#snitt").append("<h3 style='margin:1px;'>Oviktat: <span id='average-grade'></span></h3>");
$("#snitt").append("<p>Alla <input id='select-all' type='checkbox'></p>");
$("#snitt").append("<p>Avklarade <input id='select-all-done' type='checkbox'></p>");

$("#snitt").append("<p><button id='calculate-btn' type='button'>Beräkna</button></p>");

$("#info-container").append("<div id='course-level' class='col-md-6'></div>");
$("#course-level").append("<h1>Statestik</h1>");
$("#course-level").append("<h3>Avancerade hp: <span id='sum-advanced-points'></span></h3>");




/*
 Give the table of courses a id
*/
$("table.resultlist > tbody").attr('id','grade-table');


//var createLevelBox = function(selectedLevel){


var levelBox ='\
<td>\
<select class="course-levels">\
<option class="G1" value="G1">G1</option>\
<option class="G2" value="G2">G2</option>\
<option class="A" value="A">A</option>\
<option class="empty" value="empty" selected></option>\
</select>\
</td>';



/**
 MODIFY THE TABLE OF GRADES
 -Add new header "Selected"
 -Add checkbox for all courses
 -Add plus minus sign next to grades to se the impact
 of rasing them
 **/
(function expandTableOfGrades(){
    $("#grade-table").children().each(function(){

        var row = rowType(this);
        if( row.numericGrade || row.letterGrade){
            if(row.numericGrade){
                $(this).prepend("<td><input type='checkbox' class='course-checkbox'></td>");
                
                $(this).children().eq(4).attr('nowrap','nowrap');
                $(this).children().eq(4).wrapInner("<span class='grade' style='padding-right: 6px; display:inline-block; width:4px;'></span>");
                $(this).children().eq(4).append(" <input type='button' value='+' class='plus' /><input type='button' value='-' class='minus' />");
            }
            if(row.letterGrade){
                $(this).prepend("<td></td>");
            }
            $(this).children().eq(3).addClass("hp");
            $(this).children().eq(1).addClass("course-code");
            //is course finished ?
            if($(this).children().eq(1).text().indexOf("*") > 0){ $(this).children().eq(1).addClass("is-finished");}
            //
            
            $(this).children().eq(1).wrapInner("<a href='"+studiehandbokenBase+$(this).children().eq(1).text()+"'></a>");
            $(this).addClass('course-row');
            $(this).attr('id',$(this).children().eq(1).text());
            $(this).append(levelBox);
        }
        if($(this).children().eq(0).text() == "Kurskod"){
            $(this).prepend("<th>Vald</th>");
            //HP padding
            $(this).children().eq(3).attr('style','padding-right:23px');
            $(this).append("<th>Nivå</th>");
        }
    });
})();

function rowType( row ){
    var header = $(row).children().eq(0).is("th");
    var numberOfEntrys = $(row).children().size();
    var hasNumbericGrade = !isNaN(Number($(row).children().eq(3).text()));

    var numericGrade = false;
    var letterGrade = false;
    var notAcourse = false;

    if( !header &&  numberOfEntrys >2 && hasNumbericGrade ){
        numericGrade = true;
    }
    else if( !header  &&  numberOfEntrys >2 && !hasNumbericGrade){
        letterGrade =true;
    }
    else{ 
        notACourse = true;
    }

    return {
        numericGrade:numericGrade,
        letterGrade:letterGrade,
        notACourse:notACourse
    }
}

/*
 when we click select all,
 all checkboxes shoul be selected.
*/
$("#select-all").click(function(event){
    event.stopPropagation();
    if(this.checked){
        $('.course-checkbox').each(function(){
            this.checked = true;
            $(this).closest("tr").addClass('selected');
        });
    }
    else{
        $('.course-checkbox').each(function(){
            this.checked = false;
            $(this).closest("tr").removeClass('selected');
        });
    }

});
   
$("#select-all-done").click(function(event){
    event.stopPropagation();

    if(this.checked){
        $('.course-checkbox').each(function(){
            
            var row = $(this).closest("tr");
            if(row.find('.is-finished').length != 0){
                this.checked = true;
             row.addClass('selected');
            }

        });
    }
    else{
        $('.course-checkbox').each(function(){
            this.checked = false;
            $(this).closest("tr").removeClass('selected');
        });
    }

});
                         

/*
 pression a row should make it checked and highlighted
 */


$( '#grade-table' ).delegate( 'tr', 'click', function ( e ) {
    if ( $( e.target ).is( 'input:checkbox' ) ) { 
        this.checked = !this.checked;
        $(this).toggleClass('selected');
    }else if($( e.target ).parent().is( "a")){
        e.stopPropagation();
    }    
    else {
        $(this).find("input[type='checkbox']").click();

    }        
});



/**
 When we click the button "Calculate"
 we first call calculateAverages();
 then put the numbers in the view for the user to se
**/
$("#calculate-btn").click(function(event){
    var levelPoints = sumPointsInLevels();
    var grades = calculateAverages();
    $('#sum-advanced-points').text(levelPoints.A);
    $('#average-grade').text(grades.average.toFixed(2));
    $('#weighted-average-grade').text(grades.WeightedAverage.toFixed(2));
});

/*
 Add hover highlighting for course-rows

*/
document.styleSheets[0].insertRule('.course-row:hover { background-color: #FF9; outline: thin solid black;}', 0);
document.styleSheets[0].insertRule('.selected { background-color: #FFC; outline: thin solid black;}', 0);





/// Controllers /////


/*
 This function calculated the average and weighted average
 of selected fields.
*/

function calculateAverages(){

    var selectedRows = $(".course-checkbox:checked").parent().parent();


    var avrage = (function(){
        var gradesWithoutNumbers = 0;
        var sum = 0;
        selectedRows.each(function(){
            var grade = Number($(this).children().eq(4).text());
            if( !isNaN(grade)){
                sum += grade;
            }else{
                gradesWithoutNumbers++;
            }
        });

        var coursesWithRegularGrades = selectedRows.size() - gradesWithoutNumbers;
        var avrage = sum/coursesWithRegularGrades;

        return avrage;
    })();

    var WeightedAverage = (function(){
        var pointsSum = 0;
        var pointsTimesGradeSum =0;
        selectedRows.each(function(){
            var grade = Number($(this).children().eq(4).text());
            var points = Number($(this).children().eq(3).text());
            if( !isNaN(grade)){
                pointsSum += points;
                pointsTimesGradeSum += points*grade;
            }
        });
        return pointsTimesGradeSum/pointsSum;
    })();


    return {
        WeightedAverage: WeightedAverage,
        average: avrage
    }
}


(function plusMinus(){

    $('.plus').click(function(e){
        e.stopPropagation();
        var gradeElement =$(this).prev(".grade");
        var grade = Number(gradeElement.text());
        // If is not undefined
        if (!isNaN(grade)) {
            // Increment
            $(gradeElement).text(boundValue(grade+1));
        } else {
            // Otherwise put a 0 there
            $(gradeElement).text(0);
        }
    });

    $('.minus').click(function(e){
        e.stopPropagation();
        var gradeElement = $(this).prevAll(".grade");
        var grade = Number(gradeElement.text());
        // If is not undefined
        if (!isNaN(grade)) {
            // Increment
            $(gradeElement).text(boundValue(grade-1));
        } else {
            // Otherwise put a 0 there
            $(gradeElement).text(0);
        }
    });

    var boundValue = function(value){
        if(value > 5)return 5;
        if(value < 3)return 3;
        return value;
    }

    })();

(function selectLevel(){
    $('select').click(function(e){
        e.preventDefault();
        e.stopPropagation();
    });
})();

(function onCourseSelected(){
$('select').on('change', function(e) {
    var level = $(this).val();
    var select = $(this).closest('select');
    
    selectAlternative(level, select);

    var courseID = $(this).closest('tr').attr('id').replace('*','');
    updateCourseLevel(courseID,level);
});

})();


var sumPointsInLevels = function(){

    var selectedRows = $(".course-checkbox:checked").parent().parent();
    function findAndSumLevel(level){
        var sum = 0;
        var selectedRows = $(".course-checkbox:checked").parent().parent();
        selectedRows.each(function(i,obj){
            if($(obj).find('.course-levels').val() === level)
            {
             var hp = Number($(obj).find('.hp').text());
             sum +=hp;
            }
            
        });

        return sum;
    }
    var levelA  = findAndSumLevel("A");
    var levelG1 = findAndSumLevel("G1");
    var levelG2 = findAndSumLevel("G2");
    var empty   = findAndSumLevel("empty");
    return {
        G1: levelG1,
        G2: levelG2,
        A: levelA,
        empty:empty
    }
};




//Helper Functions

var selectAlternative = function(alt, select){
    select.children().removeAttr('selected');
    select.find('.'+alt).attr('selected',true);
}


























