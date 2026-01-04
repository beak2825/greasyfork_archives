// ==UserScript==
// @name           Get Courses Grades
// @version        1.0
// @description    This Tool Calculate peaks Increment in each peak
// @author         Omer Ben Yosef
// @include			https://info.braude.ac.il/yedion/fireflyweb.aspx
// @namespace       https://greasyfork.org/users/18768
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/409784/Get%20Courses%20Grades.user.js
// @updateURL https://update.greasyfork.org/scripts/409784/Get%20Courses%20Grades.meta.js
// ==/UserScript==



var myParent = document.body;

//Create array of options to be added
var array = ['11004' , '11102' , '61740' , '61741' , '11006' , '11020' , '11060' , '61743' , '61744' , '61745' , '11129' , '61746' , '61747' , '61748' , '61749' , '61750' , '11158' , '61751' , '61752' , '61753' , '61755','11069' , '61756' , '61757' , '61759' , '61760' , '11159', '61769' , '61758' , '61761' , '61763' , '61764' , '61765', '61767'  , '61768',

'11198','41942','61957','61958','61989','61991','61992','61993','61959','61960','61961','61962','61963','61964','61965','61995','61996',
 '61966','61967','61968','61969','61970','61997','61971','61972','61973','61974','61975','61976','61994',
 '61834','61977','61978','61979','61980','61981','61982','61983','61984','61985','61986','61987','61988','61990']
var names = [
'חדו"א 1מ',
'אלגברה 1 מח',
'מערכות ספרתיות',
'מבוא למדעי המחשב',
' חדו"א 2מ',
'אלגברה 2 מח',
'אנגלית מתקדמים ב',
'מתמטיקה דיסקרטית 1',
'ארגון ותכנות המחשב',
'מבוא לתכנות מערכות',
'מישדיפ',
'לוגיקה',
'מבני נתונים',
'ארכי',
'דיסקרטית 2',
'מבוא להנדסת תוכנה',
'מכניקה להנדסת תכנה',
'תכנות מונחה עצמים',
'מערכות הפעלה' ,
'אלגוריתמים',
'מסדים',
'טכנית יישומית',
'שיטות',
'מבוא לבדיקות תכנה',
'אוטומטים',
'הסתברות',
'פיזיקה 2',
'ממשק אדם מחשב',
'זמן אמת',
'כריית נתונים',
'קומפילציה',
'גרפיקה ממוחשבת',
'רשתות מחשבים',
'קריפטו',
'מקבילי ומבוזר',
'פיזיקה מודרנית',
 'מבוא לביולוגיה מולקולרית וגנטיקה להנדסת תוכנה',
 'תורת המשחקים',
 'תורת המידע',
  'מחשבים קוונטים',
  'תכנות מדעי',
   'מבוא לחישה ולמידה',
   'תורת המשחקים האלגוריתמית',
'אנליזה נומרית',
'מבוא לאופטימיזציה',
 'אחזור מידע',
  'גיאומטריה חישובית ומידול',
  'בינה מלאכותית',
  'ויזואליזציה של המידע',
   'ניתוח של נתוני הרשתות',
  'אלגוריתמים לטקסטים ורצפים',
   'אלגוריתמים מבוזרים',
 'סמינר מערכות לומדות',
 'סמינר באלגוריתמים אקראיים',
  'סמינר באלגוריתמים מתקדמים',
   'סמינר באימות תכנה',
    'סמינר באוטומטים',
    'סמינר בחישוב מבוזר',
'עיבוד תמונה ספרתי',
'עיבוד אותות ספרתי DSP',
'תקשורת אלחוטית ורשתות מחשבים',
'בדיקת מערכות ספרתיות',
   'דחיסת נתונים',
   'ביולוגיה חישובית',
   'למידה עמוקה עבור ראיית מכונה',
   'מסדי נתונים מבוזרים',
   'טכנולוגיית WEB מתקדם',
   'אימות תכנה וחומרה',
   'מחשוב ענן',
   'שפות תכנות',
    'הנדסת דרישות',
    'מעבדה במידול מערכות אקולוגיות',
    'מעבדה בתכנות מקבילי והטרוגני',
    'מעבדה באופטימיזציה',
    'מעבדה בפיתוח יישומים באנדרואיד',
    'מעבדה בסחר אלקטרוני',
    'מעבדה בכריית נתונים',
    'מעבדה בעיצוב תבניות בתכנה',
    'מעבדה בטכנולוגיות תכנות צד לקוח וצד שרת'
]

var selectListCourse = document.createElement("select");
selectListCourse.id = "mySelect_course";
myParent.appendChild(selectListCourse);

//Create and append the options
for (var i = 0; i < array.length; i++) {
    var option = document.createElement("option");
    option.value = array[i];
    option.text = names[i];
    selectListCourse.appendChild(option);
}

selectListCourse.style = "margin-right: 30%;margin-bottom: 20%; width: 15%"


var array_dept = ["1060","1070"];

var selectListDept = document.createElement("select");
selectListDept.id = "mySelect_dept";
myParent.appendChild(selectListDept);


//Create and append the options
for (var p = 0; p < array_dept.length; p++) {
    var option5 = document.createElement("option");
    option5.value = array_dept[p];
    option5.text = array_dept[p];
    selectListDept.appendChild(option5);
}

selectListDept.style = "margin-right: 2%;margin-bottom: 20%;"


var array_2 = ["2020_2","2020_1","2019_2","2019_1","2018_2","2018_1" ,"2017_2","2017_1","2016_2","2016_1"];

var selectListDate = document.createElement("select");
selectListDate.id = "mySelect_time";
myParent.appendChild(selectListDate);

//Create and append the options
for (var j = 0; j < array_2.length; j++) {
    var option_2 = document.createElement("option");
    option_2.value = array_2[j];
    option_2.text = array_2[j];
    selectListDate.appendChild(option_2);
}

selectListDate.style = "margin-right: 2%;margin-bottom: 20%;"

var array_3 = ["0","1"];

var selectListGrp = document.createElement("select");
selectListGrp.id = "mySelect_grp";
myParent.appendChild(selectListGrp);

//Create and append the options
for (var k = 0; k < array_3.length; k++) {
    var option_3 = document.createElement("option");
    option_3.value = array_3[k];
    option_3.text = array_3[k];
    selectListGrp.appendChild(option_3);
}

selectListGrp.style = "margin-right: 2%;margin-bottom: 20%;"


var array_4 = ["1","2","3"];

var selectListMoad = document.createElement("select");
selectListMoad.id = "mySelect_moad";
myParent.appendChild(selectListMoad);

//Create and append the options
for (var z = 0; z < array_4.length; z++) {
    var option_4 = document.createElement("option");
    option_4.value = array_4[z];
    option_4.text = array_4[z];
    selectListMoad.appendChild(option_4);
}

selectListMoad.style = "margin-right: 2%;margin-bottom: 20%;"


function args(tz,uniq,year,corse_code) {
    tz_str = "".concat("-N",tz)
    uniq_str = "".concat("-N",uniq)
    asa = "-AS,-A"
    year_str = "".concat("-N",year.slice(0,4));
    semster_str = "".concat("-N  ",year.slice(5,7));
    course_code = "".concat("-N  ",corse_code);
    uniq_course_code = make_code(year.slice(2,4) , $('#mySelect_dept').val() , corse_code , year.slice(5,7));
    before_str = "-N   1";
    grp = $('#mySelect_grp').val();
    if (grp == "1") {
        after_str = "-N 1,-N";
    }
    else {
        after_str = "-N,-N";
    }
    moad = $('#mySelect_moad').val();
    str_1 = "".concat(tz_str , ",", uniq_str , "," , asa , "," , year_str , "," , semster_str , "," , course_code , "," , before_str , "," , uniq_course_code , "," , after_str,moad) ;
    return str_1;
}

function get_year_in_momletz(code , semster) {
   first_year_array = ['11004' , '11102' , '61740' , '61741' , '11006' , '11020' , '11060' , '61743' , '61744' , '61745']
   second_year_array = ['11129' , '61746' , '61747' , '61748' , '61749' , '61750' , '11158' , '61751' , '61752' , '61753' , '61755']
   third_year_array = ['11069' , '61756' , '61757' , '61759' , '61760' , '11159', '61769' , '61758' , '61761' , '61763' , '61764']
   four_year_array = ['61765' , '61767' , '61768' , '11198','41942','61957','61958','61989','61991','61992','61993','61959','61960','61961','61962','61963','61964','61965','61995','61996', '61966','61967','61968','61969','61970','61997','61971','61972','61973','61974','61975','61976','61994',
 '61834','61977','61978','61979','61980','61981','61982','61983','61984','61985','61986','61987','61988','61990']
   autumn_array = ['11004' , '11102' , '61740' , '61741' , '11129' , '61746' , '61747' , '61748' , '61749' , '61750' , '11069' , '61756' , '61757' , '61759' , '61760' , '61769' , '61765' , '61767' , '61768' ]
   spring_array = ['11006' , '11020' , '11060' , '61743' , '61744' , '61745',  '11158' , '61751' , '61752' , '61753' , '61755' , '61758' , '11159', '61761' , '61763' , '61764']
   choose_array = ['11198','41942','61957','61958','61989','61991','61992','61993','61959','61960','61961','61962','61963','61964','61965','61995','61996', '61966','61967','61968','61969','61970','61997','61971','61972','61973','61974','61975','61976','61994',
 '61834','61977','61978','61979','61980','61981','61982','61983','61984','61985','61986','61987','61988','61990']
   autom_course = 0;
   spring_course = 0;
   spr_or_auto = 0;
   course_year = 0;
   if (first_year_array.indexOf(code) != -1) {
          course_year = 1
      }
      if (second_year_array.indexOf(code) != -1) {
          course_year = 2
      }
      if (third_year_array.indexOf(code) != -1) {
          course_year = 3
      }
      if (four_year_array.indexOf(code) != -1) {
          course_year = 4
      }
    if (autumn_array.indexOf(code) != -1) {
     autom_course = 1;
   }
    if (spring_array.indexOf(code) != -1) {
     spring_course = 1;
   }
   if (autom_course == 1 && semster == "1") {
     year = course_year ;
     spr_or_auto = "10"
   }

   if (spring_course == 1 && semster == "1") {
     year = course_year + 1 ;
     spr_or_auto = "30"
   }

     if (spring_course == 1 && semster == "2") {
     year = course_year ;
     spr_or_auto = "10"
   }

    if (autom_course == 1 && semster == "2") {
    year = course_year;
    spr_or_auto = "30"
   }
   if (choose_array.indexOf(code) != -1){
    year = course_year
   spr_or_auto = "20"
   }


  year = year.toString();
  var str_year = "".concat(year,spr_or_auto);
  return str_year;
}


function make_code(year,dep,course_code,semster) {
   mom_year =  get_year_in_momletz(course_code,semster);
   code_str = "".concat("-N",year,dep,mom_year);
   return code_str;
}

var btn2 = document.createElement("BUTTON");   // Create a <button> element
btn2.id = "Grades";
btn2.style = "margin-right: 10%;margin-bottom: 20%;"
btn2.innerHTML = "<p><b>התפלגות</b></p>";



document.body.appendChild(btn2);



$("#Grades").on("click", function() {
     tz = $('input[name=TZ]')[0]
     tz = tz.value
     uniq = $('input[name=UNIQ]')[0]
     uniq = uniq.value
     year = $('#mySelect_time').val();
     corse_code = $('#mySelect_course').val();
     app = 'Grade_AVR';
     arg = args(tz,uniq,year,corse_code);
     console.log(arg);
     trg = '_blank'
     send_form(app,arg,trg);
});

