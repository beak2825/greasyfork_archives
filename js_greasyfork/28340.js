// ==UserScript==
// @name        OTRS enhancements (unipd)
// @namespace   camelsoft
// @description Miglioramenti ad OTRS
// @include     https://helpdesk.ammcentr.unipd.it/otrs/index.pl*
// @include     https://helpdesk.ammcentr.unipd.it/otrs/customer.pl?Action=CustomerTicketZoom*
// @icon        data:image/png;base64,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
// @version     5.2.4
// @grant       none
// @license     GPLv3
// @downloadURL https://update.greasyfork.org/scripts/28340/OTRS%20enhancements%20%28unipd%29.user.js
// @updateURL https://update.greasyfork.org/scripts/28340/OTRS%20enhancements%20%28unipd%29.meta.js
// ==/UserScript==

// NB: queste due direttive non servono perche' OTRS ha gia' jQuery e sembra funzionare senza problemi
// require     http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js
//jQuery.noConflict();

function setup_admin ($) {
  if (!window.location.pathname.match(/index.pl/))
    return;

  var cur_user = $('#UserInfo a:first').text().trim(); // displayed name

  var icons = {
    idra:      "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",
    Coda:      "R0lGODlhEAAQAMQfAOvGUf7ztuvPMf/78/fkl/Pbg+u8Rvjqteu2Pf3zxPz36Pz0z+vTmPzurPvuw/npofbjquvNefHVduuyN+uuMu3Oafbgjfnqvf/3zv/3xevPi+vRjP/20/bmsP///////yH5BAEAAB8ALAAAAAAQABAAAAV24CeOZGmepqeqqOgxjBZFa+19r4ftWQUAgqDgltthMshMIJAZ4jYDHsBARSAmFOJvq+g6HIdEFgcYmBWNxoNAsDjGHgBnmV5bCoUDHLBIq9sFEhIdcAYJdYASFRUQhQkLCwkOFwcdEBAXhVabE52ecDahKy0oIQA7",
    Indietro:  "R0lGODlhEAAQAMQfACROFdzy00yoLbDhnUSVKFe+OV3CPMXpuLPioitfGordWnfRTXTLXLzmqX3UUYTaVjyDJGTEQaPdjI/gXXDLSc7sw2rKRdjwz9PuyVG6NTRzH4zUc9/z2H3OZf///////yH5BAEAAB8ALAAAAAAQABAAAAWH4CeOXumNKOkJLFGm4ipwXHARbrrSzaQMmArkFJtVJj7Fw4E4aIg75MSzXFCcp1WgoVCUHFbLppEoES6Ph8kUMZDNGIdjXTIUEGUPpCKxlixtBQwIAFkQBxaAHgZ2GYRQGgcSbXYFGRsDhSQaDQ0dGRkMA5lEJAkJCAijAJowJaysLzAqsighADs=",
    Rilascia:  "R0lGODlhEAAQALMPAEWi6azap1WzS9LusYrSbApexXLHV+z41vH559Ltw8ns+pe75hBs0iCZEP///////yH5BAEAAA8ALAAAAAAQABAAAARl8MlJq30uuztzawyTXc53IIjCNBtVIscxAMAysC6DDIMAEIZbC8NQJAYEmgAYwBEVgADtZxA0W47iYgoQeK+SUgI4DTUCok5j7GUUCou0OtADwePD8CcQWMTlFR4hInkWGoUciREAOw==",
    Gestisci:  "R0lGODlhEAAQAMQfAOvx9pjL/HWVsbfb/eTs9abS+0lVa1ZtjZG3z7+beLvU4cbg9Im77PHl2tfn8PD2+/v7+1JgeavO4UNLXODo7ykxQz5FVarQ8sOUaENxm36s1bF2RYlhMunXxv///////yH5BAEAAB8ALAAAAAAQABAAAAWfoCeO5PidniOtEoJoQix4qOQQQA4QPMEcNI8EsOAYOYvB4MH4iRQPTmJD5SgfWKBHIaV6rdfIk7PpmDsbcOEh9iw2DY5ZvhkU1gbRAtNImP0YdwUEeSkAGGcdgYIEEyIOGRcYkxgaGQUBARSOHpEXFxqhoRmZFBYikZGhFxmWmQCnWwAPOz0UtwAKFSICB74REQYGExMWFhViECXLIxAhADs=",
    Storico:   "R0lGODlhEAAQALMPAOz2/6mjhdrMrMe6kkE4H7OfY7iofJR7PnBgN9Dq/tLT1Ojaw3h/hf7+/v///////yH5BAEAAA8ALAAAAAAQABAAAAR88MnpqpuYusNPzVLDLeTCNZm4CEM7CMKBSts6OEhltDl9sBaHorHzPGo3i4IQIBYIlcMi2VgyEgDDs4KYIhqNAAFA1kJxC0ODDGAgEonC9ogQGNiJa2DQoxcGAXBwAQIFfQ8NCH8BjFqGMxOJBHJyCF8gRw4Em2eYGh8ZEQA7",
    PDF:       "R0lGODlhEAAQAMQfAOmNjMfHx9UqJ3Fvb9hoZqmpqbe3t96pqPn4+IeHh9ra2qRSUOXl5dtFQ9i2turq6uDg4NTT0+7u7uzMy/DX15OTk9/Ew99+fa89PN+Yl/Hp6eLi4vPz8/v7+////////yH5BAEAAB8ALAAAAAAQABAAAAWgoCeO5PidHhOtQWC8ReyhEdLdOB5Usxd1HARnSOy0eD4gkUO5UHAJUaAjqVYBl8zjgYh6pg/J9mFpZBiMrsjQGaMZDQsEovYYEI/3hiEQWBQcA2scaBtzBxkZcRoDCB4FhBuGEBcOCg19GBePHJJzCgQEDQQZBxgAjwiTChcNlSuBIhVpHBMNDRRiDxwKgo8JFQkCGAsJA8fHXiQAuCUjIQA7",
    Priorit:   "R0lGODlhEAAQAMQfAK41AGI6Ff+pJ9BPAP/x2v/DZf+eDv+kHP/qxv+5Sv+vNf+ZBP/Oe/+hFv+cCv2nNd55BP/UjP/ThVQzGIFUAP+fEv+qOP+tQP+yO/++Vv/15P/cobF2RVk2Gf///////yH5BAEAAB8ALAAAAAAQABAAAAVx4CeOZCl6aKqqp8QUWaIIh9Hd3sloBIEgEYkEwunkPp4CgXZoGBwLYuDoSSAOzcpzQeFMT5hNdsv1UgWRhpbcNZ4ODAN5UZ5QK4WLxfLoPwIcdicQEAOGAwCJHYFUKyqLgiYkHpBHkieLbpeYOJsnLCEAOw==",
    Collega:   "R0lGODlhEAAQANUkAHBwcMXFxaioqJqamtHR0XNzc6SkpJeXl6CgoNXV1ZiYmHd3d8fHx6Kioo2NjZubm6GhoX9/f4qKipSUlKenp5CQkJOTk6Ojo3t7e6WlpZ2dnX19fZ+fn4SEhHJycn5+foWFhZ6entra2v///////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAACQALAAAAAAQABAAAAZmQJJwSCwaj0jSaMlMjgSUjAGCGB2fI1GCwAg8rEKmYGRAcAYKRWDCHIXe78vyAH8vRXg8SBjJ45cggYEDSwUAh4dtDSMHFRIdHxgBC01hGllbXR5gRSMWDiAbCwWcRm1LSamqq6pBADs=",
    Operatore: "R0lGODlhEAAQAMQfAFWApnCexR4xU1SApaJ3SlB5oSg9ZrOVcy1HcURok/Lo3iM2XO/i1lJ8o2eVu011ncmbdSc8Zc6lg4212DZTgC5Hcmh3f8OUaDhWg7F2RYlhMunXxqrQ8n6s1f///////yH5BAEAAB8ALAAAAAAQABAAAAVz4CeOXumNKOpprHampAZltAt/q0Tvdrpmm+Am01MRGJpgkvBSXRSHYPTSJFkuws0FU8UBOJiLeAtuer6dDmaN6Uw4iNeZk653HIFORD7gFOhpARwGHQJ8foAdgoSGJA1/HJGRC40qHg8JGBQVe10kJiUpIQA7",
    Nota:      "R0lGODlhEAAQAMQAAJvN/MXi/naZtl13lavU+6TR+7TZ/Pz9/r7e/VpwiUhacfL1+cjk/rHX/GF8m4Gnwrrc/cDf/Za805/E2Lfa/OLq9K/Q4ubv96jL3Yyyy7DS42eHp1Nle+zx9////////yH5BAEAAB8ALAAAAAAQABAAAAV+4CeOZEl6aKqWnoVNUvY8grB5Y6t6x3JVlQHOo/EwjoFAJIJAVBYO1MTISDIhFERjIfRIDkklAmtoELiox2KJoJQJhEKhkkAJOmOKOV4AACocdh1kZnJ+f4EfHncdjY0ABY2JIh4ODgMJCRySCjgnO5uTJiccoqM5pqeUnh8hADs=",
    Chiudi:    "R0lGODlhEAAQAMQfAOt0dP94eOFjY/a0tP/JyfFfX/yVlf6mppNtbf5qanknJ9dVVeZqat5eXpiMjGo4OIUvL3pGRthWVuhvb1kaGv39/f1lZdg7O/7Y2F8/P+13d4tcXNRTU2dCQv///////yH5BAEAAB8ALAAAAAAQABAAAAV/4Cd+Xml6Y0pGTosgEap6G0YQh6FDskhjGg0AMJkwAjxfBygkGhmCAAXl6QyGnuLFI4g+qNbixLMNdBNfkpXBLncbial6AC17Gvg4eND1BPB3cHJVBguGhwsSHHo+GRqKHJGRCQo9JI4WBZoFFpUVMw8QCqMQU58qJCclqKytIQA7"
  };

  String.prototype.capitalize = function () {
    // capitalize => http://stackoverflow.com/a/38530325
    return this.replace(/\b\w/g, function(l){ return l.toUpperCase() })
  }// String.prototype.capitalize
  
  // localStorage shortcuts
  Storage.prototype.rm = function(k) { this.removeItem(k); };
  Storage.prototype.get = function(k, default_value) {
    var v = JSON.parse(this.getItem(k) || 'null');
    return (typeof v !== 'undefined' && v != null) ? v : default_value;
  };// Storage.prototype.get ---------------------------------------------------
  Storage.prototype.set = function(k, v) {
    try {
      return (typeof v !== 'undefined' && v != null) ?
        this.setItem(k, JSON.stringify(v)) :
        this.rm(k);
    } catch (e) {
      console.log('ERROR: key not saved');
      return null;
    }//try-catch
  };// Storage.prototype.set ---------------------------------------------------
  var $ls = localStorage; // abbrevia localStorage

  function extend_uris () {
    $('a[title]:contains([..])').each(function () {
      $(this).text( $(this).attr('href') );
    });
  }//extend_uris

  function get_cognome(fullname) {
    var words = fullname.toString().split(' ');
    words.shift(); // remove name
    return words.join(' ');
  }// get_cognome

  // sort select options by text => http://stackoverflow.com/a/278509
  function sortSelect (selElem) {
    var tmpAry = new Array(), i = 0;

    for (i=0; i < selElem.options.length; i++) {
      tmpAry[i] = new Array();
      tmpAry[i][0] = selElem.options[i].text;
      tmpAry[i][1] = selElem.options[i].value;
    }

    tmpAry.sort();
    
    var cur_val = $(selElem).val();
    
    while (selElem.options.length > 0)
      selElem.options[0] = null;

    for (i=0; i < tmpAry.length; i++)
      selElem.options[i] = ( new Option(tmpAry[i][0], tmpAry[i][1]) );
    
    $(selElem).val(cur_val);
  }//sortSelect

  // piccole migliorie per guadagnare spazio
  $('#Header').css('height', '1rem');
  $('#Navigation').css('top','2px');
  $('#Logo').hide();

  // Arial default font al posto dell'Helvetica per via del pessimo render a video...
  $('<style>body {font-family: Arial,"Helvetica Neue",Helvetica,sans-serif;}</style>').appendTo('head');

  // riquadro credits + links
  var links_hp     = '<a href="https://acavalin.com/" target="_blank">A.Cavalin</a>',
      links_script = '<a href="https://github.com/acavalin/tp_unipd" target="_blank">OTRS script</a>',
      links_css    = 'position: absolute; top: 0.5rem; left: 43%; padding: 0.3rem 0.6rem; z-index: 65000;'+
        'background: linear-gradient(to bottom, rgb(249, 249, 249) 0%, rgb(241, 241, 241) 100%);'+
        'border-radius: 0.5rem; border: 1px outset red;';
  $('<div style="'+links_css+'">'+links_script+' by '+links_hp+'</div>').appendTo('body');

  // --- cruscotto -------------------------------------------------------------
  if ($('.MainBox > h1:contains(Cruscotto)').length == 1) {
    //                 1     2       3      4           5      6         7          8     9
    // COLONNE: Priorita, Star, Ticket, Tempo, Da/Oggetto, Stato, Gestione, Operatore, Coda
    
    // nascondi sidebar inutile!
    $('div.SidebarColumn').hide();
    
    // mostra sempre impostazioni dell'elenco
    $('div.ActionMenu').show();
    $('div.WidgetAction.Close').remove();
    
    function setup_cruscotto () {
      if ($('form .DataTable tbody').hasClass('enhanced'))
        return;
      else
        $('form .DataTable tbody').addClass('enhanced');

      // evidenzia righe mie
      $('form .DataTable tbody tr td:nth-child(9) div:contains('+cur_user+')').
        parent().parent().
        addClass('miei').
        find('td').css('background-color', '#ddd'); // pale gray

      // evidenzia righe non mie
      $('form .DataTable tbody tr:not(.assegnati) td:nth-child(9) div').not(
        ':contains(Admin OTRS),'+
        ':contains('+cur_user+')'
      ).parent().parent().
      addClass('assegnati').
      find('td').css('background-color', '#FCE3FF'); // violetta

      // sposta righe mie in alto
      $('form .DataTable tbody tr.miei').prependTo( $('form .DataTable tbody') );
      // sposta righe non mie in basso
      $('form .DataTable tbody tr.assegnati').appendTo( $('form .DataTable tbody') );

      // metti bordo sui blocchi di righe
      $('form .DataTable tbody tr.miei:last       td').css('border-bottom', '1px solid black');
      $('form .DataTable tbody tr.assegnati:first td').css('border-top'   , '1px solid black');

      // evidenzia utente e titolo
      $('form .DataTable tbody tr td:nth-child(5)').each(function () {
        $(this).find('div:first').css('font-weight', 'bold');
      });

      // mostra solo nome finale della coda
      $('form .DataTable tbody tr td:nth-child(10)').each(function () {
        var div  = $(this).find('div:first'),
            coda = div.attr('title').trim().replace(/.*::(.+)/,'$1');
        $('<span style="font-size: smaller"></span>').text(coda).appendTo( div.empty() );
      });

      // abbrevia "preso in gestione"
      $('form .DataTable tbody tr td:nth-child(8)').each(function () {
        var div  = $(this).find('div:first');
        div.text( div.text().trim().replace(/preso /, '') );
      });

      // abbrevia "chiuso con successo"
      $('form .DataTable tbody tr td:nth-child(7)').each(function () {
        var div  = $(this).find('div:first');
        div.text( div.text().trim().replace(/ con successo/, '') );
      });

      // imposta larghezza minima per le celle mono-info
      $('form .DataTable tbody tr td:nth-child(-n+5)').css('white-space','nowrap').attr('width', '1%'); // prime 5 colonne
      $('form .DataTable tbody tr td:nth-child(n+7) ').css('white-space','nowrap').attr('width', '1%'); // dalla 7^ colonna
      // accorcia alcune scritte
      $('form .DataTable thead tr th.Age   a:last').text('Tempo');     // tempo trascorso
      $('form .DataTable thead tr th.State a:last').text('St.');       // stato
      $('form .DataTable thead tr th.Lock  a:last').text('Gestione');  // gestione
      // dai un titolo alla priorita'
      $('form .DataTable thead tr th:eq(0) a').text('Pr.');
      //rendi leggibile il campo Tempo trascorso
      $('form .DataTable tbody tr td:nth-child(4)').
        css('font-family', 'monospace').css('font-size', 'small').css('text-align', 'right').
        each(function () {
          var t = $(this).text().trim().
            replace(/ ([dhm])/g, '$1').
            replace(/ ([0-9]{1}[hm])/g, ' 0$1').
            replace(/h /, '.').
            replace(/m/, "'");
          $(this).text(t);
        });

      // evidenzia area Ticket# per middle-clic
      $('form .DataTable tbody tr td:nth-child(3)').
        css('background-color', 'orange').
        find('a').css('color', 'black');

      // avvisa se ci son tickets
      //if ($('#OverviewBody tr[id^=TicketID]').length > 0)
      //  alert('HD: ' + num_tickets + ' tickets nuovi! :O');
      window.document.title = 'T: ' +
        $('form .DataTable tbody tr.miei').length + '|' +
        $('form .DataTable tbody tr:not(.assegnati):not(.miei)').length + '/' +
        $('form .DataTable tbody tr').length;
    }//setup_cruscotto

    // per il refresh automatico in ajax e tramite i 3 link della tabella
    setInterval(setup_cruscotto, 1000);
  }//if cruscotto


  // --- ticket overview -------------------------------------------------------
  if ($('.OverviewBox h1:contains(Lista Ticket: Le mie Code)').length > 0 ||
      $('.OverviewBox h1:contains(Visualizzazione Stato: Ticket)').length > 0) {
    //            1         2     3       4      5           6      7         8          9    10
    // COLONNE: [x], Priorita, Star, Ticket, Tempo, Da/Oggetto, Stato, Gestione, Operatore, Coda

    // evidenzia righe mie
    $('#OverviewBody tr[id^=TicketID] td:nth-child(9) div:contains('+cur_user+')').
      parent().parent().
      addClass('miei').
      find('td').css('background-color', '#ddd'); // pale gray

    // evidenzia righe non mie
    $('#OverviewBody tr[id^=TicketID]:not(.assegnati) td:nth-child(9) div').not(
      ':contains(Admin OTRS),'+
      ':contains('+cur_user+')'
    ).parent().parent().
      addClass('assegnati').
      find('td').css('background-color', '#FCE3FF'); // violetta

    // sposta righe mie in alto
    $('#OverviewBody tr.miei').prependTo( $('#OverviewBody tbody') );
    // sposta righe non mie in basso
    $('#OverviewBody tr.assegnati').appendTo( $('#OverviewBody tbody') );

    // metti bordo sui blocchi di righe
    $('#OverviewBody tr.miei:last       td').css('border-bottom', '1px solid black');
    $('#OverviewBody tr.assegnati:first td').css('border-top'   , '1px solid black');

    // evidenzia utente e titolo
    $('#OverviewBody tr[id^=TicketID] td:nth-child(6)').each(function () {
      $(this).find('div:first').
        css('font-weight', 'bold').css('float', 'left').css('white-space', 'nowrap').
        css('padding-right', '0.5em');
      var t = $(this).find('div:last').css('white-space', 'wrap').css('display', 'inherit');
      t.text( t.attr('title') );
    });
    // unica linea per utente e titolo + stessa larghezza per l'utente
    var utenti   = $('#OverviewBody tr[id^=TicketID] td:nth-child(6) div:nth-child(1)'),
        utenti_w = utenti.map(function () { return $(this).outerWidth() }),
        utente_w = Math.max.apply(null, utenti_w);
    utenti.width(utente_w);

    // mostra solo nome finale della coda
    $('#OverviewBody tr[id^=TicketID] td:nth-child(10)').each(function () {
      var div  = $(this).find('div:first'),
          coda = div.attr('title').trim().replace(/.*::(.+)/,'$1');
      $('<span style="font-size: smaller"></span>').text(coda).appendTo( div.empty() );
    });

    // abbrevia "preso in gestione"
    $('#OverviewBody tr[id^=TicketID] td:nth-child(8)').each(function () {
      var div  = $(this).find('div:first');
      div.text( div.text().trim().replace(/preso /, '') );
    });

    // abbrevia "chiuso con successo"
    $('#OverviewBody tr[id^=TicketID] td:nth-child(7)').each(function () {
      var div  = $(this).find('div:first');
      div.text( div.text().trim().replace(/ con successo/, '') );
    });

    //// nascondi ultima colonna
    //$('#OverviewBody thead th.Last').hide();
    //$('#OverviewBody tr[id^=TicketID] td.Last').hide();

    // imposta larghezza minima per le celle mono-info
    $('#OverviewBody tr[id^=TicketID] td:nth-child(-n+5)').css('white-space','nowrap').attr('width', '1%'); // prime 5 colonne
    $('#OverviewBody tr[id^=TicketID] td:nth-child(n+7) ').css('white-space','nowrap').attr('width', '1%'); // dalla 7^ colonna
    // accorcia alcune scritte
    $('#OverviewBody thead tr th.Age   a:last').text('Tempo');     // tempo trascorso
    $('#OverviewBody thead tr th.State a:last').text('St.');       // stato
    $('#OverviewBody thead tr th.Lock  a:last').text('Gestione');  // gestione
    // dai un titolo alla priorita'
    $('#OverviewBody thead tr th:eq(1) a').text('Pr.');
    //rendi leggibile il campo Tempo trascorso
    $('#OverviewBody tr[id^=TicketID] td:nth-child(5)').
      css('font-family', 'monospace').css('font-size', 'small').css('text-align', 'right').
      each(function () {
        var t = $(this).text().trim().
          replace(/ ([ghm])/g, '$1').
          replace(/ ([0-9]{1}[hm])/g, ' 0$1').
          //replace(/h /, '.').
          replace(/m/, "'");
        $(this).text(t);
      });
    // eguaglia larghezza TD e TH
    $('#OverviewBody tr[id^=TicketID]:first td').each(function (i) {
      $('#OverviewBody thead tr:first th:eq('+i+')').width( $(this).outerWidth() );
    });

    // evidenzia area Ticket# per middle-clic
    $('#OverviewBody tr[id^=TicketID] td:nth-child(4)').css('background-color', 'orange');

    // avvisa se ci son tickets
    //if ($('#OverviewBody tr[id^=TicketID]').length > 0)
    //  alert('HD: ' + num_tickets + ' tickets nuovi! :O');
    window.document.title = 'T: ' +
      $('#OverviewBody tr[id^=TicketID].miei').length + '|' +
      $('#OverviewBody tr[id^=TicketID]:not(.assegnati):not(.miei)').length + '/' +
      $('#OverviewBody tr[id^=TicketID]').length;
  }//if


  // --- visualizzazione ticket ------------------------------------------------
  if ($('#ArticleTableBody').length > 0) {
    function underscorize (str) {
      return str.trim().replace(/[^A-Z ]/ig, '').replace(/\s/g, '_');
    }//camelize

    function icon_tag (icon_key) {
      return '<img src="data:image/x-icon;base64,'+icons[icon_key]+'">';
    }//icon_tag

    // inserisci filtro per area
    var sel_area = $('<select id="sel_area"><option value="-">- Area -</option></select>').insertBefore('#DestQueueID');
    // inserisci filtro per servizio
    var sel_serv = $('<select id="sel_serv"><option value="-">- Serv -</option></select>').insertBefore('#DestQueueID').hide();

    $('#sel_area, #sel_serv').css('width', '5rem'); // ridimensiona filtri
    $('#DestQueueID'        ).css('width', '6rem'); // ridimensiona combo spostamento

    var aree = [], servizi = {};

    // combo spostamento: imposta classi area/servizio ad ogni option
    var cur_opt = $('#DestQueueID option:eq(1)'), cur_area = '', cur_serv = '';
    while (cur_opt.length > 0) {
      if ( cur_opt.is('[disabled][value=-]') ) {
        if ( cur_opt.text().match(/^[^\s]/) ) {             // area
          aree.push( cur_opt.text() );
          cur_area = underscorize(cur_opt.text());
          cur_opt.addClass('area area_'+cur_area);
        } else if ( cur_opt.text().match(/^\s{2}[^\s]/) ) { // servizio
          servizi[cur_area] = servizi[cur_area] || [];
          servizi[cur_area].push( cur_opt.text() );
          cur_serv = underscorize(cur_opt.text());
          cur_opt.addClass('serv area_'+cur_area+' serv_'+cur_serv);
        } else                                              // coda corrente
          ;
      } else
        cur_opt.addClass('coda area_'+cur_area+' serv_'+cur_serv);

      cur_opt = cur_opt.next();
    }//while

    // popola filtro dell'area coi valori ordinati
    $.each(
      aree.sort(function (a,b) { return a.replace(/AREA\s+/,'') > b.replace(/AREA\s+/,'') ? 1 : -1; }),
      function () {
        var i = this.toString();
        $('<option></option>').
          html(i.replace('AREA','').trim()).
          val(underscorize(i)).
          appendTo(sel_area);
      }
    );

    // filtra code per area
    sel_area.change(function () {
      var area = $(this).val(),
          opts = $('#DestQueueID option').hide();

      $('#DestQueueID').get(0).selectedIndex = 0; //opts.first().prop('selected', true);

      if (area == '-') {
        opts.show();
        sel_serv.hide();
      } else {
        sel_serv.show().find('option:gt(0)').remove(); // svuota filtro del servizio per il successivo popolamento
        sel_serv.get(0).selectedIndex = 0;

        // popola filtro del servizio coi valori ordinati
        $.each(
          servizi[area].sort(function (a,b) { return a.replace(/SERVIZIO\s+/,'') > b.replace(/SERVIZIO\s+/,'') ? 1 : -1; }),
          function () {
            var i = this.toString();
            $('<option></option>').
              html(i.replace('SERVIZIO','').trim()).
              val(underscorize(i)).
              appendTo(sel_serv);
          }
        );

        opts.filter('.area_'+area).show();
      }//if-else
    });

    // filtra code per servizio
    sel_serv.change(function () {
      var area = sel_area.val(),
          serv = $(this).val(),
          opts = $('#DestQueueID option').hide();

      $('#DestQueueID').get(0).selectedIndex = 0; //opts.first().prop('selected', true);

      if (serv == '-')
        opts.filter('.area_'+area).show();
      else
        opts.filter('.serv_'+serv).show();
    });

    // togli margine superiore per:
    $('.MainBox:first').css('margin-top', '-0.9rem'); // contenitore principale
    $('#ArticleTree'  ).css('margin-top',  '0.2rem'); // contenitore dei post

    // piccole migliorie per guadagnare spazio col titolo
    var headline      = $('div.Headline').hide(),
        title_row     = $('div.ControlRow:first'),
        ticket_status = headline.find('div.Flag').css('display', 'inline-block').css('float', 'left'),
        ticket_descr  = headline.find('h1').hide().text().trim().replace('—','&middot;').
          replace(/Ticket\#([0-9]+)/,'Ticket <span style="font-size: larger;">$1</span>'),
        tempo_descr   = title_row.find('.AdditionalInformation').hide().text().trim().
          replace('Tempo trascorso','Tempo').replace(/ +[^ ] Data di Creazione:/, ' dal');
    title_row.
      css('min-height', 'unset').
      find('h2').hide().
      after(ticket_status).
      after('<b>'+ticket_descr+'</b>').
      after('<i style="float: right">'+tempo_descr+'</span>');

    // gestione toggle righe di sistema
    function toggle_sys_rows () {
      $('#ArticleTableBody tbody tr[class*="system-email-"]').
        toggle( !$ls.get('prefs.hide_sys_rows', true) );
    }//toggle_sys_rows

    toggle_sys_rows(); // toggle alla prima visualizzazione

    // toggle su onclick del pulsantino che aggiorna le preferenze
    var sys_rows_class = $ls.get('prefs.hide_sys_rows', true) ? ' Active' : '';
    $('<a href="#" title="Mostra righe di sistema" class="OneArticle'+sys_rows_class+'"><i style="font-size: small">Sys</i><span>Mostra righe di sistema</span></a>').
      prependTo('.TicketList .ControlRow .ArticleView.Icons').
      click(function () {
        var hide_rows = $ls.set('prefs.hide_sys_rows', !$ls.get('prefs.hide_sys_rows', true));
        $(this).toggleClass('Active', hide_rows);
        toggle_sys_rows();
      });

    // ridimensiona lo scroller in modo da mostrare tutte le righe
    var rows = $('#ArticleTableBody tbody tr:visible');
    $('#ArticleTableBody div.Scroller').
      css('min-height', '3.5rem').
      height(
        parseInt($('#ArticleTableBody thead tr:visible:first').height()) +
        rows.length * parseInt(rows.filter(':first').height()) +
        3
      );

    // evidenzia link allegati
    $('a.Attachment').parent().
      css('border', '1px dotted red').
      css('background-color', 'orange');

    //$('#ArticleTableBody tbody tr').live('click', function () {
    //  setTimeout(extend_uris, 1000);
    //  setTimeout(extend_uris, 2000);
    //  setTimeout(extend_uris, 3000);
    //});
    setInterval(extend_uris, 1000);

    // visualizza l'ultimo messaggio
    rows.filter(':last').click();

    // scambia nome-cognome nella colonna "DA"
    $('#ArticleTableBody tbody tr:visible td.From').each(function () {
      $(this).text(
        $(this).text().trim().replace(/^(\w+)\s([\w\s]+)$/,"$2 $1")
      );
    });

    // rendi visibile il telefono
    $('p:contains(049827)').each(function () {
      var tel = $(this).text().trim().replace(/049827(.+)/, '049.827.<b style="font-size: large">$1</b>');
      $(this).html(tel);
    });

    // rendi visibile il telefono esterno (medicina)
    $('p:contains(049821)').each(function () {
      var tel = $(this).text().trim().replace(/049821(.+)/, '049.<b style="font-size: large">821</b>&minus;<b style="font-size: large">$1</b>');
      $(this).html(tel);
    });

    // rimuovi intestazioni delle widgets sulla destra...
    $('div.SidebarColumn div.WidgetSimple').
      css('margin-bottom', '0').
      find('div.Header').hide();
    // ...e il bordo in alto
    $('div.SidebarColumn div.WidgetSimple:gt(0)').css('border-top', '0');

    // evidenzia stato ticket
    var p_stato = $('fieldset label:contains(Stato:)').next();
    p_stato.html( '<b>'+p_stato.text().trim()+'</b>' );
    // nascondi codice cliente = email cliente (gia' presente in basso)
    $('fieldset label:contains(Codice cliente:)').hide().next().hide().next().hide();
    // evidenzia operatore
    var p_op = $('fieldset label:contains(Operatore:)').next(),
        op_name = p_op.text().trim().toUpperCase();
    if (op_name != 'ADMIN OTRS') {
      $('.ActionRow ul.Actions a:contains(Operatore)').
        append(' ('+get_cognome(op_name)+')');
      
      p_op.html( '<b>'+op_name+'</b>' ).find('b').
        css('border', '4px outset red').
        css('padding', '0.25rem').
        css('background-color', 'black').
        css('color', 'white').
        css('font-family', 'monospace');
    } else {
      $('.ActionRow ul.Actions a:contains(Operatore)').
        append(' (libero)');
      
      p_op.html( '<b>'+op_name+'</b>' );
    }// if-else
    // rendi leggibile la coda
    var p_coda = $('fieldset label:contains(Coda:)').next(),
        //coda = p_coda.text().trim().replace(/::/g,'<hr style="border-top: 1px solid black">');
        coda = p_coda.text().trim().replace(/.*::/,'');
    p_coda.html('<div style="font-size: smaller">'+coda+'</div>' );
    // evidenzia email
    var p_email = $('fieldset label:contains(Email:)').next(),
        mail    = p_email.attr('title').trim(),
        ticket_num = $('h1:contains(Ticket#)').text().trim().replace(/^([^ ]+).+/,'$1');
    p_email.html('<a href="mailto:'+mail+'?Subject='+ticket_num+'">'+mail+'</a>' );
    if (p_coda.is('[title^=AREA DIDATTICA E SERVIZI AGLI STUDENTI]')) { // add link IDRA personale
      p_email.
        append('<br>').
        append('<a href="https://programmazione.didattica.unipd.it/persone?search='+mail+'" target="_blank"></a>').
        find('a:last').append('(vedi in '+icon_tag('idra')+')');
    }
    // merge nome e cognome
    var p_cogn = $('fieldset label:contains(Cognome:)').next();
    p_cogn.hide().prev().hide().prev().hide().prev().append( p_cogn.text().trim() );
    // rendi leggibile la sede
    var p_sede = $('fieldset label:contains(Commento:)').next();
    p_sede.text( (p_sede.attr('title')||'').trim().replace(/DIPARTIMENTO (DI|DEI)/,'DIP.') );

    // nascondi nome utente che e' uguale alla mail
    $('fieldset label:contains(Nome utente:)').next().andSelf().hide();

    // compatta fieldset info sulla destra
    $('div.Content fieldset.TableLike').css('margin-bottom', '0');
    // metti in riga i link dei tickets aperti dall'utente
    $('div.Content ul.ItemRow').css('margin-left', '0').find('li').css('display', 'inline-block');

    // migliora elenco collegamenti
    $('ul.Tablelike.SpacingTopSmall').each(function () {
      var ul    = $(this).css('margin-left', '0'),
          title = ul.prev().hide().text().trim();
      ul.find('li.Header').text(title);
      ul.find('li:not(.Header)').css('display', 'inline-block');
    });

    $('#Footer').hide(); // nascondi footer

    // aggiungi icone ai link delle azioni
    $.each(icons, function (label, data) {
      var link = $('.ActionRow ul.Actions a:contains('+label+')');
      switch (label) {
        case 'Nota':   link.text('Nota'); break;
        case 'Chiudi': link.text('Chiudi/Stato'); break;
      }//switch
      link.append(icon_tag(label));
    });
    $('#DestQueueID').after(icon_tag('coda'));
    $('.ActionRow ul.Actions').
      find('li').css('margin-right', '-1px').
      find('a').css('border', '2px outset #555').css('border-radius', '0.3rem');
    $('#DestQueueID').parents('form:first').
      css('border', '2px outset #555').css('border-radius', '0.3rem').css('padding', '0.13rem').
      find('select').css('margin', 'auto');
    $('.ActionRow img').css('vertical-align', 'middle').css('margin-left', '0.2rem');

    // mostra storico sopra alle righe delle note
    var storico = $('<fieldset style="height: 40px; font-size: smaller; padding: 0 2px 6px 2px; border: 1px solid black; overflow-x: hidden; overflow-y: scroll;"><legend style="margin: 0 2em; padding: 0 0.5em">Storico del ticket</legend></fieldset>').
      insertBefore('#ArticleTableBody');
    $.get(
      $('a:contains(Storico)').attr('href'),
      function (resp) {
        $('#ArticleTableBody').css('border', '1px solid green');
        $(resp).find('table.DataTable:first').appendTo(storico);
        storico.find('tr').hide();
        var storico_height = storico.find('tr td:first-child').
          filter(':contains(Move), :contains(OwnerUpdate)').
          parent().show().
          length * 22;
        storico.height(storico_height > 100 ? 100 : storico_height);
        // indica se la richiesta proviene da un TEAM
        var team_row = storico.find('table tbody tr:first td[title*="TEAM"]');
        if (team_row.length != 0) {
          var team = team_row.attr('title').replace(/.+(TEAM[^;)]+).+/, '$1');
          $('<span style="background-color: red; margin-left: 1rem;">Creato in: '+team+'</span>').prependTo('.TicketList .ControlRow');
        }//if
        // evidenzia righe col cambio operatore
        storico.find('table tbody tr td:contains(Nuovo operatore):contains(@unipd.it)').
          css('background-color', 'lightpink');
      },//success
      'html'
    );
  
    // --- controlla periodicamente se ci son state modifiche ------------------
    var check_ticket_updates_interval = 15000;
    function check_ticket_updates () {
      $.get(window.location, function (resp) {
        var old_rows = $('#ArticleTableBody tbody tr').length,
            new_rows = $(resp).find('#ArticleTableBody tbody tr').length;
        console.log([old_rows, new_rows]);
        if (old_rows != new_rows && confirm("Il ticket è stato modificato,\nricaricare la pagina?"))
          window.location.reload();
        else
          setTimeout(check_ticket_updates, check_ticket_updates_interval);
      }, 'html');
    }//check_ticket_updates
    setTimeout(check_ticket_updates, check_ticket_updates_interval);
  }//if


  // --- cambio proprietario ---------------------------------------------------
  var sel_owner = $('#NewOwnerID');
  if (sel_owner.length > 0) {
    //// nascondi nomi non usati
    //sel_owner.find('option').not(
    //  ':contains(nome.cogn@unipd.it),'+
    //  ':contains(nome.cogn@unipd.it)'
    //).hide()

    // imposta oggetto predefinito
    $('#NewOwnerID, #OldOwnerID').change(function () {
      var name = $(this).find('option:selected').text().
        replace(/^([0-9]+: )*([^()]+)( \(.+\))/, '$2').
        split(' ').pop();
      $('#Subject').val('per ' + name.capitalize());
      
      setTimeout(function () {
        // swap nome e cognome
        sel_owner.find('option').each(function () {
          $(this).text( $(this).text().trim().replace(/^([^ ]+) (.+)/, '$2 $1').capitalize() );
        });
        
        // resort options
        sortSelect( sel_owner.get(0) );
      }, 1000);
      
      return false;
    });

    // seleziona proprietario precedente
    $(':radio[value="Old"]').attr('checked', true);
    $('#OldOwnerID').change();

    // testo predefinito
    $('#RichText').
      val('...').
      bind('focus', function () { $(this).select(); }); // seleziona tutto onfocus
  }//if


  // --- aggiungi nota ---------------------------------------------------------
  // evidenzia la riga col tipo di nota
  $('#ArticleTypeID').
    css('height',    '3rem').
    css('width',     '50%').
    css('font-size', 'x-large');
}// setup_admin ----------------------------------------------------------------

function setup_customer ($) {
  if (!window.location.pathname.match(/customer.pl/))
    return;

  // nascondi righe di sistema
  $('#Messages li[class*=system]').hide();
}// setup_customer -------------------------------------------------------------

(function ($) { $(function () {
  setup_customer($);
  setup_admin($);
});})(jQuery);
