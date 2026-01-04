// ==UserScript==
// @name          Uniwa eClass All Classes
// @description	  Uniwa eClass display all classes in protfolio
// @author        cckats
// @include       https://eclass.uniwa.gr/main/portfolio.php
// @run-at        document-body
// @version       1.0
// @namespace https://greasyfork.org/users/661487
// @downloadURL https://update.greasyfork.org/scripts/428933/Uniwa%20eClass%20All%20Classes.user.js
// @updateURL https://update.greasyfork.org/scripts/428933/Uniwa%20eClass%20All%20Classes.meta.js
// ==/UserScript==



jQuery(document).ready(function() {

  jQuery('#portfolio_lessons').DataTable({
     destroy: true,
    'bLengthChange': false,
    'iDisplayLength': 20,
    'bSort' : false,
    'fnDrawCallback': function( oSettings ) {
      $('#portfolio_lessons_filter label input').attr({
        class : 'form-control input-sm',
        placeholder : 'Αναζήτηση...'
      });
      $('#portfolio_lessons_filter label').prepend('<span class="sr-only">Αναζήτηση</span>')
    },
    'dom': '<"all_courses">frtip',
    'oLanguage': {
           'sLengthMenu':   'Εμφάνισε _MENU_ αποτελέσματα',
           'sZeroRecords':  'Δεν βρέθηκαν αποτελέσματα',
           'sInfo':         'Εμφανίζονται _START_ έως _END_ από _TOTAL_ συνολικά αποτελέσματα',
           'sInfoEmpty':    'Εμφανίζονται 0 έως 0 από 0 αποτελέσματα',
           'sInfoFiltered': '',
           'sInfoPostFix':  '',
           'sSearch':       '',
           'sUrl':          '',
           'oPaginate': {
               'sFirst':    '&laquo;',
               'sPrevious': '&lsaquo;',
               'sNext':     '&rsaquo;',
               'sLast':     '&raquo;'
           }
       }
  });
  $('div.all_courses').html('<a class="btn btn-xs btn-default" href="https://eclass.uniwa.gr/main/my_courses.php">Όλα τα μαθήματα</a>');
  jQuery('.panel_title').click(function()
  {
    var mypanel = $(this).next();
    mypanel.slideToggle(100);
    if($(this).hasClass('active')) {
        $(this).removeClass('active');
    } else {
        $(this).addClass('active');
    }
  });var calendar = $("#bootstrapcalendar").calendar({
                    tmpl_path: "/js/bootstrap-calendar-master/tmpls/",
                    events_source: "/main/calendar_data.php",
                    language: "el-GR",
                    views: {year:{enable: 0}, week:{enable: 0}, day:{enable: 0}},
                    onAfterViewLoad: function(view) {
                                $("#current-month").text(this.getTitle());
                                $(".btn-group button").removeClass("active");
                                $("button[data-calendar-view='" + view + "']").addClass("active");
                                }
        });

        $(".btn-group button[data-calendar-nav]").each(function() {
            var $this = $(this);
            $this.click(function() {
                calendar.navigate($this.data("calendar-nav"));
            });
        });

        $(".btn-group button[data-calendar-view]").each(function() {
            var $this = $(this);
            $this.click(function() {
                calendar.view($this.data("calendar-view"));
            });
        });});
function show_month(day,month,year){
    $.get("calendar_data.php",{caltype:"small", day:day, month: month, year: year}, function(data){$("#smallcal").html(data);});
}

