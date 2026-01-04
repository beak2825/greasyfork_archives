// ==UserScript==
// @name         Virtonomica: Настройка лаб
// @namespace    Быстрая настройка лаб
// @version 	   1.0.1
// @description   обработка сообщений лаб
// @include       http*://virtonomic*.*/*/main/user/privat/persondata/message
// @downloadURL https://update.greasyfork.org/scripts/416191/Virtonomica%3A%20%D0%9D%D0%B0%D1%81%D1%82%D1%80%D0%BE%D0%B9%D0%BA%D0%B0%20%D0%BB%D0%B0%D0%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/416191/Virtonomica%3A%20%D0%9D%D0%B0%D1%81%D1%82%D1%80%D0%BE%D0%B9%D0%BA%D0%B0%20%D0%BB%D0%B0%D0%B1.meta.js
// ==/UserScript==
var run = function () {
  window.onload = function () {
  var win = (typeof (unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
  $ = win.$;
  myrealm = readCookie('last_realm');
  prot = window.location.protocol;
  hostserv = window.location.host;
  //***************************обработчик всех исследований
  var strnlab = window.location.href; // del
  strnlab = strnlab.split('/')  // del
  console.log(strnlab)             // del
  //******************* запись лаб в память и их исследований
   var dlaisllab2 = $('<input type="button" id=labApi value="Обновить список лаб"/>').click(function () {
     localStorage.removeItem('myisltehn');
     localStorage.removeItem('myToken');
       var   myCompLink = prot+"//"+hostserv+"/api/"+myrealm+"/main/my/company";
       $.ajax({
        url: myCompLink,
        async: false,
        type: 'post',
        dataType: "json",
        success: function (data) {
        var idCompany= data['id'];
          //запрос на список лаб
      var   myLabSp = prot+"//"+hostserv+"/api/"+myrealm+"/main/company/units?id="+idCompany+"&pagesize=5000&unit_type_id=2203";
       $.ajax({
        url: myLabSp,
        async: false,
        type: 'post',
        dataType: "json",
        success: function (data) {
                 console.log(data)
         var spLab = data['data'];
            console.log(spLab)
            schet = 0;
   for (var key in spLab) {
       schet++
        var idlab = spLab[key]['id'];
       console.log(idlab)
          console.log(idlab)
        var nameissl = spLab[key]['unit_type_produce_name'];
              console.log(nameissl)

        if (nameissl == '') continue;
        //    console.log(nameissl)
        var myisltehn = JSON.parse(localStorage.getItem('myisltehn'));
        if (myisltehn == null) {
          myisltehn = {};
        }
        if (myisltehn[myrealm] == null) {
          myisltehn[myrealm] = {};
        }
        if (myisltehn[myrealm][nameissl] == null) {
          var idvpam = '';
        }
        else {
          idvpam = myisltehn[myrealm][nameissl]
        }
        idvpam = idvpam + idlab + ',';
        myisltehn[myrealm][nameissl] = idvpam;
        localStorage.setItem('myisltehn', JSON.stringify(myisltehn));
      }
        }
       })

         var   myTokenS = prot+"//"+hostserv+"/api/"+myrealm+"/main/token";
                  $.ajax({
        url: myTokenS,
        async: false,
        type: 'post',
        dataType: "json",
        success: function (data) {
           var token = data;
             localStorage.setItem('myToken', JSON.stringify(token));
            alert ('Обновлены данные на '+schet+' лабораториях. Токен: '+ token);
        }
       })

        }
       })


   })

   
  
  var obrSoob = $('<input type="button" id=labApi value="Определить/Изменить сообщение"/>').click(function () {
      var namesoob = $('div.col-md-9>h3').text().replace(/\s/g, "");
 //******определяем тип сообщения
  switch (namesoob) {
	  case "Предварительноеисследованиезавершено!":
	 typesoob=1;
      //моя кнопка
    $('div.clearfix').append('<a class="MyBut">Применить гипотезы!<a>');
      //стиль кнопки
         $('.MyBut').css({

  'display': 'inline-block',
  'color': 'white',
  'text-decoration': 'none',
  'padding': '.5em 2em',
  'outline': 'none',
  'border-width': '2px 0',
  'border-style': 'solid none',
  'border-color': '#FDBE33 #000 #D77206',
  'border-radius': '6px',
  'background': 'linear-gradient(#F3AE0F, #E38916) #E38916',
  'transition': '0.2s',
   //'hover { background: linear-gradient(#f5ae00, #f59500) #f5ae00; }',
  //  'active { background: linear-gradient(#f59500, #f5ae00) #f59500; }',
          })
  $(".MyBut").mouseenter(function () {
          $(this).css({
            'background': 'linear-gradient(#f59500, #f5ae00) #f59500',
          })
        })
        $(".MyBut").mouseout(function () {
          $(this).css({
            'background': 'linear-gradient(#f5ae00, #f59500) #f5ae00',
          })

        });
	    break
	  case "Гипотезаверна!":
	    typesoob=2;
	    break
	  case "Эврика!":
	    typesoob=3;
	    break
	  default:
	    typesoob=0;
	}

         $('.MyBut').click(function(){
       var myToken = JSON.parse(localStorage.getItem('myToken'))
          tdAll = $("table#mysort>tbody>tr");
   //  console.log(tdAll)
     for (i=0;i<tdAll.length;i++){
var numgip=$("td>input:checked", tdAll[i]).attr('value');
if (numgip==undefined ){
  alert ('Выбраны не все гипотезы!')
  return;
}
   }
    for (i=0;i<tdAll.length;i++){
    var   link2st = $('td>a', tdAll[i]).attr('href')
    //console.log(link)
    var numgip=$("td>input:checked", tdAll[i]).attr('value');
    labaid =link2st.replace(/\D+/g ,"")
       var  link2stNew =prot+"//"+hostserv+"/api/"+myrealm+"/main/unit/project/hipotesis/set";
        var gipotpr = {};
        gipotpr['id']= labaid;
        gipotpr['hipotesis_id']=numgip;
        gipotpr['token']= myToken;
   $.ajax({   //отправляем данные для нового исследования
        url: link2stNew,
        async: false,
        type: 'post',
        data: gipotpr,
        success: function (data) {
           $('td:gt(4)', tdAll[i]).remove();
$.ajax({// запрос для инновации
			url: prot+'//'+hostserv+'/'+myrealm+'/ajax/unit/artefact/attach/',
		    async: false,
            dataType: "json",
		    data: "unit_id=" +labaid+"&artefact_id=" + 302782+"&slot_id=" + 300141,
		    cache: false,
		    error: function(data){ alert('При попытке прикрепить инновацию, возникла ошибка.'); },
		    success: function(data) {
          //*****добавить функцию которая узнает все про персонал и оборудование
          Uzndan (labaid, tdAll[i]);
       }
})
        }
   })
    }
   })

   if (typesoob == 0){
   return;
 }
  if (typesoob == 1) {
    PolNazv(typesoob);
}
  if (typesoob == 2) {
  PolNazv(typesoob);
}
  if (typesoob == 3) {
    tr = $('div.table-responsive>table>tbody>tr');
    //console.log(tr.length)
    var myisltehn = JSON.parse(localStorage.getItem('myisltehn'));
    $('div#mainContent').attr("style", "width: 1100px;");
    $('div.col-md-9').attr("style", "width: 1100px;");
    $('div.col-md-3').remove();
    $('div.table-responsive>table').removeClass();
    $('div.table-responsive>table').attr("style", "width: 1000px; font-size: 8px");
    // обрабатываем все лабы
    for (i = 0; i < tr.length; i++) {
     var   link = $('td>a', tr[i]).attr('href')
         var idForNewLink = link.replace(/\D+/g, "")
      // console.log("новое ид="+idForNewLink)
  var  newIntLink =prot+"//"+hostserv+"/api/"+myrealm+"/main/unit/project/browse?id="+idForNewLink
      $.ajax({
        url: newIntLink,
        async: false,
        type: 'post',
        dataType: "json",
        success: function (data) {
              //var nazvissl = $('div#mainContent>table.list>tbody>tr:eq(1)>td:eq(1)>div:eq(0)>img', data).attr('alt'); //получаем назвапние исследования
//console.log(data)
            //определяем последнее  исследование
            var nazvissl = data['data'];
            var keyIsl = 0;
            for (var key in nazvissl){
            //    console.log('key='+key+'   '+'data  '+nazvissl[key])
                var numKey = Number(key);
                if (numKey > keyIsl){
                keyIsl = numKey;
                }
            }

var poslIssl = data['data'][keyIsl];
 //console.log (poslIssl['unit_type_name'])
          nazvissl = data['data'][keyIsl]['unit_type_name']
          var idnewissl = poslIssl['unit_type_id']; //ид для нового исследования+
          $('td:eq(1)>a', tr[i]).replaceWith('<a class="internal_link" href=' + link + '>' + nazvissl + '</a>');  //заменяем ссылку на стр
          var izur = Number(poslIssl['level_developing']); //получаем изученный уровень
         //для нового интерфейса поиск размера лабы, еще 1 запрос на главную страницу
       var linkForRazm =link.replace(/\/investigation/g, "");
           $.ajax({
        url: linkForRazm,
        async: false,
        type: 'post',
        success: function (dataRazm) {
                  var razmlab=parseInt($('td:contains("Размер лаборатории")', dataRazm).next().text().replace(/\s/g, "")); //картинка с размером лабы

  // razmlab=razmlab.split("/")
var    labid = link.split('/')
          var spisok = myisltehn[myrealm][nazvissl]
          if (spisok == null) {
            spisok = 0
                      $(tr[i]).append('<td class="drugielabi" title="Еще изучают">' + spisok.length + '</td><td><input title="Запустить на всех" disabled="disabled" type="checkbox"/></td><td><input class="newproject" newissl="'+idnewissl+'" izur="'+(izur)+'" razmlab="'+razmlab+'" labid="'+labid[7]+'" type="button" value="New-'+(izur+1)+'"></td>')
          }
          else {
            spisok = spisok.slice(0, - 1);
            spisok = spisok.split(',')
            $(tr[i]).append('<td class="drugielabi" title="Еще изучают">' + spisok.length + '</td><td><input class="mychekid" labid="'+spisok+'" title="Запустить на всех" type="checkbox"/></td><td><input class="newproject" newissl="'+idnewissl+'" izur="'+(izur)+'" razmlab="'+razmlab+'" labid="'+labid[7]+'" type="button" value="New-'+(izur+1)+'"></td>')
          }

        }
           })

        }
      })
    }    //$('table.unit-list-2014').remove();


  $('.newproject').click(function(){
      myToken = JSON.parse(localStorage.getItem('myToken'))
       var td = $(this).parent().parent();
   //  console.log(td)
   if ($('td:eq(4)>input', td).prop("checked")==true){


     knopka=$(this);
      dlalabid=$(this).attr('labid');
   var type=$(this).attr('newissl');
       var izur=parseInt($(this).attr('izur'));
     var level=izur+1;


 //проверка размера
       var razmlab2=$(this).attr('razmlab');
      if (razmlab2 == '1000'){
   var  maxtehn=1000;
   }
            if (razmlab2 == '700'){
     maxtehn=25;
   }
            if (razmlab2 == '300'){
     maxtehn=19;
   }
            if (razmlab2 == '100'){
     maxtehn=13;
   }
            if (razmlab2 == '30'){
     maxtehn=8;
   }
            if (razmlab2 == '10'){
     maxtehn=4;
   }
      if (level > maxtehn){
        alert ("Размер лаборатории не подходит для нового исследования");
        return;
      }

       link2 =prot+"//"+hostserv+"/api/"+myrealm+"/main/unit/project/browse?id="+dlalabid
        var  link3 =prot+"//"+hostserv+"/api/"+myrealm+"/main/unit/project/create";
  fff={};
  fff['id'] = dlalabid;
  fff['unit_type_id'] = type;
  fff['token'] = myToken;
  fff['level'] = level;
        $.ajax({   //отправляем данные для нового исследования
        url: link3,
        async: false,
        type: 'post',
        data: fff,
        success: function (data) {
  $(knopka).attr('disabled', 'disabled'); //делаем кнопку не активной
        //узнаем сколько надо персонала
           $.ajax({
        url: link2,
        async: false,
        type: 'post',
        success: function (data) {

          var nazvissl = data['data'];
            var keyIsl = 0;
            for (var key in nazvissl){
            //    console.log('key='+key+'   '+'data  '+nazvissl[key])
                var numKey = Number(key);
                if (numKey > keyIsl){
                keyIsl = numKey;
                }
            }

var poslIssl = data['data'][keyIsl];
var coltreb=  data['data'][keyIsl]['min_employees_required'];
            $(td).append('<td bgcolor="#e5e9e6" style="border:2px solid; border-color:#aeabab;">Тр.раб.</td><td class="trebrab" title="Требуется рабочих" style="border:2px solid; border-color:#aeabab">'+coltreb+'</td>')

           link5=prot+'//'+hostserv+'/'+myrealm+'/main/unit/view/'+dlalabid;
        $.ajax({
        url: link5,
        async: false,
        type: 'post',
        success: function (data) {
           var nanato=parseInt($('td:contains("Количество учёных")', data).next().text().replace(/\s/g, ""));
           var maxnanato=parseInt($('td:contains("Количество учёных")', data).next().text().replace(/\s/g, "").replace(/\d+/, "").replace(/\(максимум:/, ""));
        $(td).append('<td bgcolor="#e5e9e6" style="border:2px solid; border-color:#aeabab">Раб.</td><td class="nanato" title="Нанято рабочих" style="border:2px solid; border-color:#aeabab">'+nanato+'</td><td bgcolor="#e5e9e6" style="border:2px solid; border-color:#aeabab">Макс раб.</td><td class="maxnanato" title="Максимум рабочих" style="border:2px solid; border-color:#aeabab">'+maxnanato+'</td>')
   var kvala=parseFloat($('td:contains("Уровень квалификации учёных")', data).next().text().replace(/\s/g, ""));
           var trebkvala=parseFloat($('td:contains("Уровень квалификации учёных")', data).next().text().replace(/\s/g, "").replace(/\d+/, "").replace(/\./, "").replace(/\d+/, "").replace(/\(всреднемпогороду/, "").replace(/\d+/, "").replace(/\./, "").replace(/\d+/, "").replace(/\,требуетсяпотехнологии/, ""));
        $(td).append('<td  bgcolor="#e5e9e6" style="border:2px solid; border-color:#aeabab">Кв.раб.</td><td class="kvala" title="Квала" style="border:2px solid; border-color:#aeabab">'+kvala+'</td>')
        $(td).append('<td  bgcolor="#e5e9e6" style="border:2px solid; border-color:#aeabab">Тр.кв.</td><td class="trebkvala" title="Требуется квала" style="border:2px solid; border-color:#aeabab">'+trebkvala+'</td>')

        var obor=parseFloat($('td:contains("Качество оборудования")', data).next().text());
                  $(td).append('<td  bgcolor="#e5e9e6" style="border:2px solid; border-color:#aeabab">Кач.об.</td><td class="obor" title="Кач оборудование" style="border:2px solid; border-color:#aeabab">'+obor+'</td>')
    var obortreb=parseFloat($('td:contains("Качество оборудования")', data).next().text().replace(/\s/g, "").replace(/\d+/, "").replace(/\./, "").replace(/\d+/, "").replace(/\(требуетсяпотехнологии/, ""));
                   $(td).append('<td  bgcolor="#e5e9e6"  style="border:2px solid; border-color:#aeabab">Тр.кач.</td><td class="obortreb" title="Требуется кач" style="border:2px solid; border-color:#aeabab">'+obortreb+'</td>')
  var kolobor=parseInt($('td:contains("Количество оборудования")', data).next().text().replace(/\s/g, ""));
          var trebkolobor=nanato*10;
         $(td).append('<td  bgcolor="#e5e9e6"  style="border:2px solid; border-color:#aeabab">Кол.об.</td><td class="kolobor" title="Количество оборудования" style="border:2px solid; border-color:#aeabab">'+kolobor+'</td><td  bgcolor="#e5e9e6"  style="border:2px solid; border-color:#aeabab">Тр.об.</td><td class="trebkolobor" title="Требуется оборудования" style="border:2px solid; border-color:#aeabab">'+trebkolobor+'</td>')

          if (kvala < trebkvala) {
          $('.kvala', td).attr('bgcolor', '#fd4646');
        }
          else {
          $('.kvala', td).attr('bgcolor', '#4ab154');
          }
         if (nanato < coltreb) {
          $('.nanato', td).attr('bgcolor', '#fd4646');
        }
          else {
          $('.nanato', td).attr('bgcolor', '#4ab154');
          }
           if (obor < obortreb) {
          $('.obor', td).attr('bgcolor', '#fd4646');
        }
          else {
          $('.obor', td).attr('bgcolor', '#4ab154');
          }
             if (kolobor < trebkolobor) {
          $('.kolobor', td).attr('bgcolor', '#fd4646');
        }
          else {
          $('.kolobor', td).attr('bgcolor', '#4ab154');
          }
      //версия для отпуска
         // $(td).append('<td><input class="wan" dlalabid="'+dlalabid+'"  type="button" value="1:1"></td>')
         //   $(td).append('<td><input class="wan" dlalabid="'+dlalabid+'"  type="button" value="ВО"></td>')
        $.ajax({// запрос для инновации
			url: prot+'//'+hostserv+'/'+myrealm+'/ajax/unit/artefact/attach/',
		    async: false,
            dataType: "json",
		    data: "unit_id=" +dlalabid+"&artefact_id=" + 302766+"&slot_id=" + 300141,
		    cache: false,
		    error: function(data){ alert('При попытке прикрепить инновацию, возникла ошибка.'); },
		    success: function(data) {

            }
        })

        }


        })

        }
        })

        }
      })

 //****** для остальных
       dlalabidvse=$('.mychekid', td).attr('labid');
     dlalabidvse=dlalabidvse.split(',');

               $('<div id="js-wall"  style="position: fixed; top: 0px; left: 0px; background-color: black; z-index: 100001; opacity: 0.5;" />').height($(window).height()).width($(window).width()).prependTo('body');
       $('<div id="js-progress" align="center" style=" background-color: #e6e6e0; left:25%; top:25%;  position: absolute; color: black;  z-index: 1000000; font-size: 12pt; text-align: center;" >'+
          '<div  align="center" style="width:1000px; float:left; margin: 5px; background-image:linear-gradient(to top, #b9f8c2, #49f761); border-radius:20px;-moz-border-radius:20px; padding:5px;"><table id="newspisok"'+
                                     'style="border-collapse: collapse;">'+
                                    '</table></div></div>').prependTo('body');
         for (i = 0; i < dlalabidvse.length; i++) {

  link2 =prot+"//"+hostserv+"/api/"+myrealm+"/main/unit/project/browse?id="+dlalabidvse[i]
        var  link3 =prot+"//"+hostserv+"/api/"+myrealm+"/main/unit/project/create";
   fff['id'] = dlalabidvse[i];

        $.ajax({   //отправляем данные для нового исследования
        url: link3,
        async: false,
        type: 'post',
        data: fff,
        success: function (data) {
           $.ajax({
        url: link2,
        async: false,
        type: 'post',
        success: function (data) {

          var nazvissl = data['data'];
            var keyIsl = 0;
            for (var key in nazvissl){
            //    console.log('key='+key+'   '+'data  '+nazvissl[key])
                var numKey = Number(key);
                if (numKey > keyIsl){
                keyIsl = numKey;
                }
            }

var poslIssl = data['data'][keyIsl];
var coltreb=  data['data'][keyIsl]['min_employees_required'];
            $('#newspisok').append('<tr><td bgcolor="#e5e9e6" style="border:2px solid; border-color:#aeabab;"><a href="'+prot+'//'+hostserv+'/'+myrealm+'/main/unit/view/'+dlalabidvse[i]+'/investigation">Лаборатория</a></td><td bgcolor="#e5e9e6" style="border:2px solid; border-color:#aeabab;">Тр.раб.</td><td class="trebrab" title="Требуется рабочих" style="border:2px solid; border-color:#aeabab">'+coltreb+'</td></tr>')

           link5=prot+'//'+hostserv+'/'+myrealm+'/main/unit/view/'+dlalabidvse[i];
        $.ajax({
        url: link5,
        async: false,
        type: 'post',
        success: function (data) {
           var nanato=parseInt($('td:contains("Количество учёных")', data).next().text().replace(/\s/g, ""));
           var maxnanato=parseInt($('td:contains("Количество учёных")', data).next().text().replace(/\s/g, "").replace(/\d+/, "").replace(/\(максимум:/, ""));
        $('#newspisok>tbody>tr:last-child').append('<td bgcolor="#e5e9e6" style="border:2px solid; border-color:#aeabab">Раб.</td><td class="nanato" title="Нанято рабочих" style="border:2px solid; border-color:#aeabab">'+nanato+'</td><td bgcolor="#e5e9e6" style="border:2px solid; border-color:#aeabab">Макс раб.</td><td class="maxnanato" title="Максимум рабочих" style="border:2px solid; border-color:#aeabab">'+maxnanato+'</td>')
   var kvala=parseFloat($('td:contains("Уровень квалификации учёных")', data).next().text().replace(/\s/g, ""));
           var trebkvala=parseFloat($('td:contains("Уровень квалификации учёных")', data).next().text().replace(/\s/g, "").replace(/\d+/, "").replace(/\./, "").replace(/\d+/, "").replace(/\(всреднемпогороду/, "").replace(/\d+/, "").replace(/\./, "").replace(/\d+/, "").replace(/\,требуетсяпотехнологии/, ""));
         $('#newspisok>tbody>tr:last-child').append('<td  bgcolor="#e5e9e6" style="border:2px solid; border-color:#aeabab">Кв.раб.</td><td class="kvala" title="Квала" style="border:2px solid; border-color:#aeabab">'+kvala+'</td>')
          $('#newspisok>tbody>tr:last-child').append('<td  bgcolor="#e5e9e6" style="border:2px solid; border-color:#aeabab">Тр.кв.</td><td class="trebkvala" title="Требуется квала" style="border:2px solid; border-color:#aeabab">'+trebkvala+'</td>')

        var obor=parseFloat($('td:contains("Качество оборудования")', data).next().text());
                    $('#newspisok>tbody>tr:last-child').append('<td  bgcolor="#e5e9e6" style="border:2px solid; border-color:#aeabab">Кач.об.</td><td class="obor" title="Кач оборудование" style="border:2px solid; border-color:#aeabab">'+obor+'</td>')
    var obortreb=parseFloat($('td:contains("Качество оборудования")', data).next().text().replace(/\s/g, "").replace(/\d+/, "").replace(/\./, "").replace(/\d+/, "").replace(/\(требуетсяпотехнологии/, ""));
                     $('#newspisok>tbody>tr:last-child').append('<td  bgcolor="#e5e9e6"  style="border:2px solid; border-color:#aeabab">Тр.кач.</td><td class="obortreb" title="Требуется кач" style="border:2px solid; border-color:#aeabab">'+obortreb+'</td>')
  var kolobor=parseInt($('td:contains("Количество оборудования")', data).next().text().replace(/\s/g, ""));
          var trebkolobor=nanato*10;
          $('#newspisok>tbody>tr:last-child').append('<td  bgcolor="#e5e9e6"  style="border:2px solid; border-color:#aeabab">Кол.об.</td><td class="kolobor" title="Количество оборудования" style="border:2px solid; border-color:#aeabab">'+kolobor+'</td><td  bgcolor="#e5e9e6"  style="border:2px solid; border-color:#aeabab">Тр.об.</td><td class="trebkolobor" title="Требуется оборудования" style="border:2px solid; border-color:#aeabab">'+trebkolobor+'</td>')
     var  tdkon=$('#newspisok>tbody>tr:last-child');
          if (kvala < trebkvala) {
          $('.kvala', tdkon).attr('bgcolor', '#fd4646');
        }
          else {
          $('.kvala', tdkon).attr('bgcolor', '#4ab154');
          }
         if (nanato < coltreb) {
          $('.nanato', tdkon).attr('bgcolor', '#fd4646');
        }
          else {
          $('.nanato', tdkon).attr('bgcolor', '#4ab154');
          }
           if (obor < obortreb) {
          $('.obor', tdkon).attr('bgcolor', '#fd4646');
        }
          else {
          $('.obor', tdkon).attr('bgcolor', '#4ab154');
          }
             if (kolobor < trebkolobor) {
          $('.kolobor', tdkon).attr('bgcolor', '#fd4646');
        }
          else {
          $('.kolobor', tdkon).attr('bgcolor', '#4ab154');
          }
           //версия для отпуска
        //  $('#newspisok>tbody>tr:last-child').append('<td><input class="wan" dlalabid="'+dlalabidvse[i]+'" type="button" value="1:1"></td>')
       //   $('#newspisok>tbody>tr:last-child').append('<td><input class="wan" dlalabid="'+dlalabidvse[i]+'" type="button" value="ВО"></td>')

        $('div#js-wall').click(function(){

        $('#js-progress').remove();
     $('#js-wall').remove();

    })
        var linkVO=prot+'//'+hostserv+'/'+myrealm+'/main/unit/view/'+dlalabidvse[i]+'/holiday_unset';
           $.ajax({
        url: linkVO,
        async: false,
        type: 'get',
        success: function (data) {

              $.ajax({// запрос для инновации
			url: prot+'//'+hostserv+'/'+myrealm+'/ajax/unit/artefact/attach/',
		    async: false,
            dataType: "json",
		    data: "unit_id=" +dlalabidvse[i]+"&artefact_id=" + 302766+"&slot_id=" + 300141,
		    cache: false,
		    error: function(data){ alert('При попытке прикрепить инновацию, возникла ошибка.'); },
		    success: function(data) {

            }
              })


                        }
           })
        }
        })

           }
        })

        }
      })











    }
    /*    $('.wan').click(function(){
                                          dlalabid=$(this).attr('dlalabid');
   var td2 = $(this).parent().parent();
    //версия для отпуска
           var link6=prot+'//'+hostserv+'/'+myrealm+'/main/unit/view/'+dlalabid+'/holiday_unset';
           $.ajax({
        url: link6,
        async: false,
        type: 'get',
        success: function (data) {

                        }
           })

         kolpers=parseInt($('.trebrab', td2).text());
      var link6=prot+'//'+hostserv+'/'+myrealm+'/window/unit/employees/engage/'+dlalabid;
           $.ajax({
        url: link6,
        async: false,
        type: 'post',
       data:  {'unitEmployeesData[quantity]' : kolpers},
        success: function (data) {

                  $('.nanato', td2).replaceWith('<td class="nanato"  bgcolor="#4ab154" title="Нанято рабочих" style="border:2px solid; border-color:#aeabab">'+kolpers+'</td>')

                  trebkolobor=kolpers*10;
                  $('.trebkolobor', td2).replaceWith('<td class="trebkolobor" title="Требуется оборудования" style="border:2px solid; border-color:#aeabab">'+trebkolobor+'</td>')
        kolobor=parseInt($('.kolobor', td2).text());
       trebkolobor=parseInt($('.trebkolobor', td2).text());

                  if (kolobor < trebkolobor) {
          $('.kolobor', td2).attr('bgcolor', '#fd4646');
        }
          else {
          $('.kolobor', td2).attr('bgcolor', '#4ab154');
          }
        }
           })

            })*/
   }
    else {
      knopka=$(this);
      dlalabid=$(this).attr('labid');
   var type=$(this).attr('newissl');
       var izur=parseInt($(this).attr('izur'));
     var level=izur+1;


 //проверка размера
       var razmlab2=$(this).attr('razmlab');
      if (razmlab2 == '100'){
   var  maxtehn=1000;
   }
            if (razmlab2 == '700'){
     maxtehn=25;
   }
            if (razmlab2 == '300'){
     maxtehn=19;
   }
            if (razmlab2 == '100'){
     maxtehn=13;
   }
            if (razmlab2 == '30'){
     maxtehn=8;
   }
            if (razmlab2 == '10'){
     maxtehn=4;
   }
      if (level > maxtehn){
        alert ("Размер лаборатории не подходит для нового исследования");
        return;
      }

        link2 =prot+"//"+hostserv+"/api/"+myrealm+"/main/unit/project/browse?id="+dlalabid
        var  link3 =prot+"//"+hostserv+"/api/"+myrealm+"/main/unit/project/create";
  fff={};
  fff['id'] = dlalabid;
  fff['unit_type_id'] = type;
  fff['token'] = myToken;
  fff['level'] = level;
        $.ajax({   //отправляем данные для нового исследования
        url: link3,
        async: false,
        type: 'post',
        data: fff,
        success: function (data) {
  $(knopka).attr('disabled', 'disabled'); //делаем кнопку не активной
        //узнаем сколько надо персонала
           $.ajax({
        url: link2,
        async: false,
        type: 'post',
        success: function (data) {
                  var nazvissl = data['data'];
            var keyIsl = 0;
            for (var key in nazvissl){
            //    console.log('key='+key+'   '+'data  '+nazvissl[key])
                var numKey = Number(key);
                if (numKey > keyIsl){
                keyIsl = numKey;
                }
            }

var poslIssl = data['data'][keyIsl];
 //console.log (poslIssl['unit_type_name'])
          nazvissl = data['data'][keyIsl]['unit_type_name']
            var coltreb=  data['data'][keyIsl]['min_employees_required'];
            $(td).append('<td bgcolor="#e5e9e6" style="border:2px solid; border-color:#aeabab;">Тр.раб.</td><td class="trebrab" title="Требуется рабочих" style="border:2px solid; border-color:#aeabab">'+coltreb+'</td>')

           link5=prot+'//'+hostserv+'/'+myrealm+'/main/unit/view/'+dlalabid;
        $.ajax({
        url: link5,
        async: false,
        type: 'post',
        success: function (data) {
           var nanato=parseInt($('td:contains("Количество учёных")', data).next().text().replace(/\s/g, ""));
           var maxnanato=parseInt($('td:contains("Количество учёных")', data).next().text().replace(/\s/g, "").replace(/\d+/, "").replace(/\(максимум:/, ""));
        $(td).append('<td bgcolor="#e5e9e6" style="border:2px solid; border-color:#aeabab">Раб.</td><td class="nanato" title="Нанято рабочих" style="border:2px solid; border-color:#aeabab">'+nanato+'</td><td bgcolor="#e5e9e6" style="border:2px solid; border-color:#aeabab">Макс раб.</td><td class="maxnanato" title="Максимум рабочих" style="border:2px solid; border-color:#aeabab">'+maxnanato+'</td>')
   var kvala=parseFloat($('td:contains("Уровень квалификации учёных")', data).next().text().replace(/\s/g, ""));
           var trebkvala=parseFloat($('td:contains("Уровень квалификации учёных")', data).next().text().replace(/\s/g, "").replace(/\d+/, "").replace(/\./, "").replace(/\d+/, "").replace(/\(всреднемпогороду/, "").replace(/\d+/, "").replace(/\./, "").replace(/\d+/, "").replace(/\,требуетсяпотехнологии/, ""));
        $(td).append('<td  bgcolor="#e5e9e6" style="border:2px solid; border-color:#aeabab">Кв.раб.</td><td class="kvala" title="Квала" style="border:2px solid; border-color:#aeabab">'+kvala+'</td>')
        $(td).append('<td  bgcolor="#e5e9e6" style="border:2px solid; border-color:#aeabab">Тр.кв.</td><td class="trebkvala" title="Требуется квала" style="border:2px solid; border-color:#aeabab">'+trebkvala+'</td>')

        var obor=parseFloat($('td:contains("Качество оборудования")', data).next().text());
                  $(td).append('<td  bgcolor="#e5e9e6" style="border:2px solid; border-color:#aeabab">Кач.об.</td><td class="obor" title="Кач оборудование" style="border:2px solid; border-color:#aeabab">'+obor+'</td>')
    var obortreb=parseFloat($('td:contains("Качество оборудования")', data).next().text().replace(/\s/g, "").replace(/\d+/, "").replace(/\./, "").replace(/\d+/, "").replace(/\(требуетсяпотехнологии/, ""));
                   $(td).append('<td  bgcolor="#e5e9e6"  style="border:2px solid; border-color:#aeabab">Тр.кач.</td><td class="obortreb" title="Требуется кач" style="border:2px solid; border-color:#aeabab">'+obortreb+'</td>')
  var kolobor=parseInt($('td:contains("Количество оборудования")', data).next().text().replace(/\s/g, ""));
          var trebkolobor=nanato*10;
         $(td).append('<td  bgcolor="#e5e9e6"  style="border:2px solid; border-color:#aeabab">Кол.об.</td><td class="kolobor" title="Количество оборудования" style="border:2px solid; border-color:#aeabab">'+kolobor+'</td><td  bgcolor="#e5e9e6"  style="border:2px solid; border-color:#aeabab">Тр.об.</td><td class="trebkolobor" title="Требуется оборудования" style="border:2px solid; border-color:#aeabab">'+trebkolobor+'</td>')

          if (kvala < trebkvala) {
          $('.kvala', td).attr('bgcolor', '#fd4646');
        }
          else {
          $('.kvala', td).attr('bgcolor', '#4ab154');
          }
         if (nanato < coltreb) {
          $('.nanato', td).attr('bgcolor', '#fd4646');
        }
          else {
          $('.nanato', td).attr('bgcolor', '#4ab154');
          }
           if (obor < obortreb) {
          $('.obor', td).attr('bgcolor', '#fd4646');
        }
          else {
          $('.obor', td).attr('bgcolor', '#4ab154');
          }
             if (kolobor < trebkolobor) {
          $('.kolobor', td).attr('bgcolor', '#fd4646');
        }
          else {
          $('.kolobor', td).attr('bgcolor', '#4ab154');
          }
       //версия для отпуска
        //  $(td).append('<td><input class="wan" dlalabid="'+dlalabid+'"  type="button" value="1:1"></td>')
       /*     $('.wan').click(function(){
              dlalabid=$(this).attr('dlalabid');
   var td2 = $(this).parent().parent();
       kolpers=parseInt($('.trebrab', td2).text());
       var link6=prot+'//'+hostserv+'/'+myrealm+'/window/unit/employees/engage/'+dlalabid;
           $.ajax({
        url: link6,
        async: false,
        type: 'post',
       data:  {'unitEmployeesData[quantity]' : kolpers},
        success: function (data) {

                  $('.nanato', td2).replaceWith('<td class="nanato"  bgcolor="#4ab154" title="Нанято рабочих" style="border:2px solid; border-color:#aeabab">'+coltreb+'</td>')

                  trebkolobor=coltreb*10;
                  $('.trebkolobor', td2).replaceWith('<td class="trebkolobor" title="Требуется оборудования" style="border:2px solid; border-color:#aeabab">'+trebkolobor+'</td>')
  if (kolobor < trebkolobor) {
          $('.kolobor', td2).attr('bgcolor', '#fd4646');
        }
          else {
          $('.kolobor', td2).attr('bgcolor', '#4ab154');
          }
        }
           })

            }) */

             $.ajax({// запрос для инновации
			url: prot+'//'+hostserv+'/'+myrealm+'/ajax/unit/artefact/attach/',
		    async: false,
            dataType: "json",
		    data: "unit_id=" +dlalabid+"&artefact_id=" + 302766+"&slot_id=" + 300141,
		    cache: false,
		    error: function(data){ alert('При попытке прикрепить инновацию, возникла ошибка.'); },
		    success: function(data) {

            }
             })

        }
        })

        }
        })

        }
      })
    }
  })
  }



   })


  //*****************Панель кнопак
   var panelisl = $('<fieldset><legend>Обработка научных сообщений</legend></fieldset>');
   panelisl.append(dlaisllab2).append(obrSoob);
   $('div.row:last-child').append(panelisl);

  //*****************функция получения названия в письме

  function PolNazv(typesoob) {//для 2 стадии
       tr = $('div.table-responsive>table>tbody>tr');
  // var myisltehn = JSON.parse(localStorage.getItem('myisltehn'));

    $('div#mainContent').attr("style", "width: 1100px;");
    $('div.col-md-9').attr("style", "width: 1100px;");
    $('div.col-md-3').remove();
    $('div.table-responsive>table').removeClass();
    $('div.table-responsive>table').attr("style", "width: 1000px; font-size: 8px");

    // обрабатываем все лабы
    for (i = 0; i < tr.length; i++) {
    var   link = $('td>a', tr[i]).attr('href')
      var idForNewLink = link.replace(/\D+/g, "")
      // console.log("новое ид="+idForNewLink)
  var  newIntLink =prot+"//"+hostserv+"/api/"+myrealm+"/main/unit/project/browse?id="+idForNewLink
    //  console.log(link)
      $.ajax({
        url: newIntLink,
        async: false,
        type: 'post',
        dataType: "json",
        success: function (data) {
             var nazvissl = data['data'];
            var keyIsl = 0;
            for (var key in nazvissl){
            //    console.log('key='+key+'   '+'data  '+nazvissl[key])
                var numKey = Number(key);
                if (numKey > keyIsl){
                keyIsl = numKey;
                }
            }
var poslIssl = data['data'][keyIsl];
 console.log (poslIssl['unit_type_name'])
          nazvissl = data['data'][keyIsl]['unit_type_name']
          var idnewissl = poslIssl['unit_type_id'];
          $('td:eq(1)>a', tr[i]).replaceWith('<a class="internal_link" href=' + link + '>' + nazvissl + '</a>');  //заменяем ссылку на стр
  if (typesoob==1){//доп данные для гипотез
  //   $('input.button160').after('<input class="butAllGip" type="button" value="Применить гипотезы">');
          var gip=poslIssl['hypotesis_ids'];
          var ver=poslIssl['hypotesis_success_probabilities'];
          var etvr=poslIssl['hypotesis_base_success_probabilities'];
          var modEtvr=poslIssl['hypotesis_length_modifiers'];
      gip=gip.replace(/\{/, "").replace(/\}/, "").split(',');
 /*     gip.sort(function(a, b) {
      return parseInt(a) - parseInt(b);
});*/
    //  console.log(gip)
      ver=ver.replace(/\{/, "").replace(/\}/, "").split(',');
 /*     ver.sort(function(a, b) {
      return parseInt(a) - parseInt(b);
});*/
var massGip =[];
      for (t=0; t <  gip.length; t++){
          massGip[t]=[];
          massGip[t]['idGip']=gip[t];
          massGip[t]['verGip']=ver[t];
         // console.log(massGip[t]['idGip']);
         //  console.log(massGip[t]['verGip']);

            }
//console.log(massGip);
      massGip.sort(function(a, b){
  return a.verGip-b.verGip
})
  //    console.log(massGip);
      etvr=etvr.replace(/\{/, "").replace(/\}/, "").split(',');
      modEtvr=modEtvr.replace(/\{/, "").replace(/\}/, "").split(',');
    //  console.log (gip)
     // console.log (gip.length)
                    //alert (gip.length)
    //****************************************************************************************************************************************************************
    var coltreb=  poslIssl['min_employees_required'];
var    labaid2 =link.replace(/\D+/g ,"")
        $(tr[i]).append('<td bgcolor="#e5e9e6" style="border:2px solid; border-color:#aeabab;">Тр.раб.</td><td class="trebrab" title="Требуется рабочих" style="border:2px solid; border-color:#aeabab">'+coltreb+'</td>');
        for (z = 0; z < massGip.length; z++) {
        var  idgip= massGip[z]['idGip'];
          console.log (idgip)
        var  ver1= massGip[z]['verGip'];
         console.log (idgip)
     //   var  etvr1= etvr[z];
     //   var  modEtvr1 = modEtvr[z];
          var idpred=link.replace(/\D+/g ,"")
        //    $(tr[i]).append('<td bgcolor="#c4ffc1"><input name="selectedHypotesis'+idpred+'" value="'+idgip+'" type="radio"></td><td>'+ver1+'%</td><td>'+etvr1*modEtvr1+'</td>')
            $(tr[i]).append('<td bgcolor="#c4ffc1"><input name="selectedHypotesis'+idpred+'" value="'+idgip+'" type="radio"></td><td>'+ver1+'%</td>')

          }
  }
          //***************************************************************************************************************
       if (typesoob==2){//доп данные для 3 стадии
         var coltreb2=  poslIssl['min_employees_required'];
         var    labaid2 =link.replace(/\D+/g ,"")
                    //   var link6=prot+'//'+hostserv+'/'+myrealm+'/window/unit/employees/engage/'+dlalabid;

                //  $(tr[i]).append('<td><a class="prik"  target="_blank" href="'+prot+'//'+hostserv+'/'+myrealm+'/window/unit/view/'+labaid2+'/set_experemental_unit" dlalabid="'+labaid2+'">Прикрепить</a></td>')
                 $(tr[i]).append('<td bgcolor="#e5e9e6" style="border:2px solid; border-color:#aeabab;">Тр.раб.</td><td class="trebrab" title="Требуется рабочих" style="border:2px solid; border-color:#aeabab">'+coltreb2+'</td>');
                  Uzndan (labaid2, tr[i]);
          var myisltehn = JSON.parse(localStorage.getItem('myisltehn'));
            var spisok = myisltehn[myrealm][nazvissl];
          spisok = spisok.slice(0, - 1);
            spisok = spisok.split(',')
           // alert (spisok.length)
          if (spisok.length == 1) {//только 1 лаба

                      $(tr[i]).append('<td class="drugielabi" title="Еще изучают">' + (spisok.length-1) + '</td><td><input title="Запустить на всех" disabled="disabled" type="checkbox"/></td>')
          }
          else {
               //         alert (spisok)
            $(tr[i]).append('<td class="drugielabi" title="Еще изучают">' + (spisok.length-1) + '</td><td><input class="mychekid" labid="'+spisok+'" title="Остановить другие" type="checkbox"/></td>')
              $(tr[i]).append('<td><input class="OtprVOtp" dlalabid="'+labaid2+'"  type="button" value="ОО"></td>')

          }
       }

        }
      })
    }    //$('table.unit-list-2014').remove();
      $('div.table-responsive>table').removeAttr("style");
     $('div.table-responsive>table').attr("style", "width: 1000px; font-size: 8px");

        $('.tri').click(function(){
        var    dlalabid=$(this).attr('dlalabid');
           var labaid222=dlalabid;
   var td2 = $(this).parent().parent();
    var   kolpers=parseInt($('.trebrab', td2).text());
           kolpers=kolpers*3;
          var maxpersonala=parseInt($('td.maxnanato',td2).text());
           if (kolpers > maxpersonala){
             kolpers=maxpersonala;
           }
                 if (typesoob==2){//доп данные для 3 стадии
                 if ($('input.mychekid', td2).prop("checked")==true){
                var  labid=$('input.mychekid', td2).attr('labid')
               // alert (labid);
                  labid=labid.split(',')
                      for (l = 0; l < labid.length; l++) {
                        if (labid[l]==labaid222){
                          continue;
                        }
                        var link10=prot+'//'+hostserv+'/'+myrealm+'/window/unit/employees/engage/'+labid[l];
           $.ajax({
        url: link10,
        async: false,
        type: 'post',
       data:  {'unitEmployeesData[quantity]' : 0},
        success: function (data) {

        }
           })



                      }

                 }

                 }
       var link6=prot+'//'+hostserv+'/'+myrealm+'/window/unit/employees/engage/'+dlalabid;
           $.ajax({
        url: link6,
        async: false,
        type: 'post',
       data:  {'unitEmployeesData[quantity]' : kolpers},
        success: function (data) {
        if (typesoob==1){//доп данные для гипотез
          $('td:gt(5)', td2).remove();
        }
           if (typesoob==2){//3 стадия
                     $('td:gt(6)', td2).remove();
           }
          Uzndan (labaid222,td2);
        }
           })

            })
  $('.OtprVOtp').click(function(){
        var    dlalabid=$(this).attr('dlalabid');
           var labaid222=dlalabid;
   var td2 = $(this).parent().parent();
        if ($('input.mychekid', td2).prop("checked")==true){
                var  labid=$('input.mychekid', td2).attr('labid')
               // alert (labid);
                  labid=labid.split(',')
                      for (l = 0; l < labid.length; l++) {
                        if (labid[l]==labaid222){
                                  $.ajax({// запрос для инновации
			url: prot+'//'+hostserv+'/'+myrealm+'/ajax/unit/artefact/attach/',
		    async: false,
            dataType: "json",
		    data: "unit_id=" +labaid222+"&artefact_id=" + 302792+"&slot_id=" + 300141,
		    cache: false,
		    error: function(data){ alert('При попытке прикрепить инновацию, возникла ошибка.'); },
		    success: function(data) {

            }
        })
                        }
                          else {
                        var link10=prot+'//'+hostserv+'/'+myrealm+'/main/unit/view/'+labid[l]+'/holiday_set';
           $.ajax({
        url: link10,
        async: false,
        type: 'get',
        success: function (data) {



        }
           })
                          }


                      }
                  $('td:gt(6)', td2).remove();
                 }

            })
        $('div.table-responsive>table').attr("id", "mysort");
        $('div.table-responsive>table>tbody').before("<thead><tr><th></th><th>Исследование</th><th></th><th colspan='40'></th></tr></thead>");
    //*****************************************
      var script = document.createElement("script");
        script.src = 'https://drive.google.com/uc?export=download&id=0BxSKWps-nr_vdGk1T3MxZUpMZTQ';
           document.getElementsByTagName("head")[0].appendChild(script);
           script.onload = function() {
              $('div.table-responsive>table>').attr("class", "tablesorter");
   $("#mysort").tablesorter();
            var style = document.createElement("style");
        style.type = 'text/css';
        style.textContent = 'table.tablesorter {'+
	'font-family:arial;'+
	'background-color: #CDCDCD;'+
	'margin:10px 0pt 15px;'+
	'font-size: 8pt;'+
	'width: 100%;'+
	'text-align: left;'+
'}'+
'table.tablesorter thead tr th, table.tablesorter tfoot tr th {'+
	'background-color: #e6EEEE;'+
	'border: 1px solid #FFF;'+
	'font-size: 8pt;'+
	'padding: 4px;'+
'}'+
'table.tablesorter thead tr .header {'+
	'background-image: url(http://pix.academ.info/img/2016/12/21/047b382eb2730989c963ff7ea36c73e9.gif);'+
	'background-repeat: no-repeat;'+
	'background-position: center right;'+
 'cursor: pointer;'+
'}'+
'table.tablesorter tbody td {'+
	'color: #3D3D3D;'+
	'padding: 4px;'+
  'border: 2px solid #aeabab;'+
	//'background-color: #FFF;'+
	'vertical-align: top;'+
'}'+
'table.tablesorter tbody tr.odd td {'+
	'background-color:#F0F0F6;'+
'}'+
'table.tablesorter thead tr .headerSortUp {'+
	'background-image: url(http://pix.academ.info/img/2016/12/21/1cb244f7c4093be370c6bfd32a08da9f.gif);'+
'}'+
'table.tablesorter thead tr .headerSortDown {'+
	'background-image: url(http://pix.academ.info/img/2016/12/21/0d404ce9ac0b374a6cbd80c89e4ff693.gif);'+
'}'+
'table.tablesorter thead tr .headerSortDown, table.tablesorter thead tr .headerSortUp {'+
'background-color: #8dbdd8;'+
'}';
        document.getElementsByTagName("head")[0].appendChild(style);
  }
           script.onerror = function() {
  alert( "Ошибка загрузки скрипта ");
};

    //*********************************************************************
   }
    function Uzndan(labaid, td) {//для 2 стадии

           link5=prot+'//'+hostserv+'/'+myrealm+'/main/unit/view/'+labaid;
        $.ajax({
        url: link5,
        async: false,
        type: 'post',
        success: function (data) {
           var nanato=parseInt($('td:contains("Количество учёных")', data).next().text().replace(/\s/g, ""));
           var maxnanato=parseInt($('td:contains("Количество учёных")', data).next().text().replace(/\s/g, "").replace(/\d+/, "").replace(/\(максимум:/, ""));
        $(td).append('<td bgcolor="#e5e9e6" style="border:2px solid; border-color:#aeabab">Раб.</td><td class="nanato" title="Нанято рабочих" style="border:2px solid; border-color:#aeabab">'+nanato+'</td><td bgcolor="#e5e9e6" style="border:2px solid; border-color:#aeabab">Макс раб.</td><td class="maxnanato" title="Максимум рабочих" style="border:2px solid; border-color:#aeabab">'+maxnanato+'</td>')
   var kvala=parseFloat($('td:contains("Уровень квалификации учёных")', data).next().text().replace(/\s/g, ""));
           var trebkvala=parseFloat($('td:contains("Уровень квалификации учёных")', data).next().text().replace(/\s/g, "").replace(/\d+/, "").replace(/\./, "").replace(/\d+/, "").replace(/\(всреднемпогороду/, "").replace(/\d+/, "").replace(/\./, "").replace(/\d+/, "").replace(/\,требуетсяпотехнологии/, ""));
        $(td).append('<td  bgcolor="#e5e9e6" style="border:2px solid; border-color:#aeabab">Кв.раб.</td><td class="kvala" title="Квала" style="border:2px solid; border-color:#aeabab">'+kvala+'</td>')
        $(td).append('<td  bgcolor="#e5e9e6" style="border:2px solid; border-color:#aeabab">Тр.кв.</td><td class="trebkvala" title="Требуется квала" style="border:2px solid; border-color:#aeabab">'+trebkvala+'</td>')

        var obor=parseFloat($('td:contains("Качество оборудования")', data).next().text());
                  $(td).append('<td  bgcolor="#e5e9e6" style="border:2px solid; border-color:#aeabab">Кач.об.</td><td class="obor" title="Кач оборудование" style="border:2px solid; border-color:#aeabab">'+obor+'</td>')
    var obortreb=parseFloat($('td:contains("Качество оборудования")', data).next().text().replace(/\s/g, "").replace(/\d+/, "").replace(/\./, "").replace(/\d+/, "").replace(/\(требуетсяпотехнологии/, ""));
                   $(td).append('<td  bgcolor="#e5e9e6"  style="border:2px solid; border-color:#aeabab">Тр.кач.</td><td class="obortreb" title="Требуется кач" style="border:2px solid; border-color:#aeabab">'+obortreb+'</td>')
  var kolobor=parseInt($('td:contains("Количество оборудования")', data).next().text().replace(/\s/g, ""));
          var trebkolobor=nanato*10;
         $(td).append('<td  bgcolor="#e5e9e6"  style="border:2px solid; border-color:#aeabab">Кол.об.</td><td class="kolobor" title="Количество оборудования" style="border:2px solid; border-color:#aeabab">'+kolobor+'</td><td  bgcolor="#e5e9e6"  style="border:2px solid; border-color:#aeabab">Тр.об.</td><td class="trebkolobor" title="Требуется оборудования" style="border:2px solid; border-color:#aeabab">'+trebkolobor+'</td>')
       var coltreb=parseInt($('td.trebrab', td).text());
          if (kvala < trebkvala) {
          $('.kvala', td).attr('bgcolor', '#fd4646');
        }
          else {
          $('.kvala', td).attr('bgcolor', '#4ab154');
          }
         if (nanato < coltreb) {
          $('.nanato', td).attr('bgcolor', '#fd4646');
        }
          else {
          $('.nanato', td).attr('bgcolor', '#4ab154');
          }
           if (obor < obortreb) {
          $('.obor', td).attr('bgcolor', '#fd4646');
        }
          else {
          $('.obor', td).attr('bgcolor', '#4ab154');
          }
             if (kolobor < trebkolobor) {
          $('.kolobor', td).attr('bgcolor', '#fd4646');
        }
          else {
          $('.kolobor', td).attr('bgcolor', '#4ab154');
          }

        }
        })


    }
  }
}
if (window.top == window) {
  var script = document.createElement('script');
  script.textContent = '(' + run.toString() + ')();';
  document.documentElement.appendChild(script);
}
