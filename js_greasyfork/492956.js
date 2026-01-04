// ==UserScript==
// @name         SkyNet addon
// @namespace    http://s170/
// @version      0.107
// @description  Fast arrival/departure
// @author       mpapec
// @match        http://s170/intus-web/*
// @match        http://s170.ipcck.hr/intus-web/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/492956/SkyNet%20addon.user.js
// @updateURL https://update.greasyfork.org/scripts/492956/SkyNet%20addon.meta.js
// ==/UserScript==

// https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/a499871d-b693-45f6-ae90-f9451fff00da/d71vu65-58c5c8ea-e6ad-4e22-9f34-862d6967500c.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwic3ViIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsImF1ZCI6WyJ1cm46c2VydmljZTpmaWxlLmRvd25sb2FkIl0sIm9iaiI6W1t7InBhdGgiOiIvZi9hNDk5ODcxZC1iNjkzLTQ1ZjYtYWU5MC1mOTQ1MWZmZjAwZGEvZDcxdnU2NS01OGM1YzhlYS1lNmFkLTRlMjItOWYzNC04NjJkNjk2NzUwMGMucG5nIn1dXX0.nHcdwj0CJwqZ_NmCNkp936kwu0gJdFeRx3ZYKsw4FSI

(function($) {
// $(document).ready(function(){
    'use strict';

    // redirect na glavnu ako je stranica za upis
    if (location.href.match(/upisi/)) {
        location.replace("./");
        return;
    }

    $(document.body).prepend(`
  <style>
     body {
       margin: 0;
       padding: 0;
       ${ location.href.match(/ipcck/) ? `background-color: powderblue;` : "" }
     }
    .container {
      display: flex;
    }
    .cbox {
      width: 100%;
      padding: 50px;
      box-sizing: border-box;
      font-family: 'Helvetica', 'Arial', sans-serif;
      font-size: 180%;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: black;
      color: lightgreen
    }
    .box {
      width: 50%;
      padding: 50px;
      box-sizing: border-box;
      font-weight: bold;
      font-family: 'Helvetica', 'Arial', sans-serif;
      font-size: 180%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .box.x {
      background-color: gray;
      color: #ddd;
    }
    .box.y {
      background-color: lightgreen;
      color: #fff;
    }
  </style>
  <div class="cbox" align=center>ODABERI KORISNIKA IZ PADAJUCEG</div>
  <div class="container">
    <div id="ulaz"  class="box x">ULAZ</div>
    <div id="izlaz" class="box x">IZLAZ</div>
  </div>
${ "" && `
  <form action="">
    <select name=sifra_dropdown>
      <option value="">-- f --</option>
      <option value="271063">matija</option>
      <option value="270679">drazen</option>
    </select><br>
    <select name=indikator>
      <option value="">-- x --</option>
      <option value="0">ulaz</option>
      <option value="4">izlaz</option>
    </select><br>
    <input type=submit name=daj value=salji>
  </form>
270679 Drazen prezime: NE RADI - 18.4.2024 15:30:19<br>
271063 Matija prezime: U FIRMI - 19.4.2024 7:23:18<br>
`}
    `);

    const toDate= (date) => {
      const d = date.split(/[.:\s]+/);
      //const tz_local = (new Date()).getTimezoneOffset()/60 *-1
      return new Date(
          [
              d[2],
              d[1].padStart(2, "0"),
              d[0].padStart(2, "0"),
          ].join("-")+
          "T"+
          [
              d[3].padStart(2, "0"),
              d[4].padStart(2, "0"),
              d[5].padStart(2, "0"),
          ].join(":")
          // `+0${tz_local}:00`
      );
    };
    const formatPeriod= (msec) => {
      let date = new Date(null);
      date.setSeconds(msec/1000);
      // return date.toISOString().substr(11-3,8+3).replace("T", "d ");
      return date.toISOString().substr(11-0,8+0).replace("T", "d ");
    };
    const parseDData= (str) => {
      const [t, date] = str.split(/\s*-\s*/);
      const [t1, status] = t.split(/\s*:\s*/);
      const [sifra, ime] = t1.split(/(?<=\d)\s+/);
      // console.log([status,date]);
      // console.log([sif, o.ime]);
      const dateo = toDate(date);
      return {
        sifra: sifra, ime: ime,
        status: status, date: dateo,
        duration: formatPeriod(new Date() - dateo),
      };
    };
    //
    const assignVal = (key, newVal, setFunc) => {
      if (newVal) { //  !== null
          localStorage.setItem(key, newVal);
      }
      else {
          newVal = localStorage.getItem(key);
          if (newVal && setFunc) setFunc(newVal);
      }
      return newVal;
    };
    /* ------ */

    let _state = {};
    const getState = () => {
        return _state;
    };
    // ufirmi: 0,
    // sifra: "271063", ime: "IME PREZIMEx", status: "U FIRMI", duration: 6000,
    const setState = (o) => {
        _state = o;
        _state.ufirmi = _state.status === "U FIRMI";
        if (!_state.ufirmi) _state.duration = "";
    };
    const displayRefresh = () => {
        let o = getState();
        $(".cbox").html(`
          ${o.ime}<br>
          ${o.status}${ o.duration && "/"+o.duration }<br>
          ${o.sifra}
        `);
        $("#ulaz, #izlaz").removeClass("x").removeClass("y");
        if (o.ufirmi) {
          $("#ulaz").addClass("x"); $("#izlaz").addClass("y");
        }
        else {
          $("#ulaz").addClass("y"); $("#izlaz").addClass("x");
        }
    };
    /* ------ */

    //listener na gumbe
    $("#ulaz, #izlaz").click(function(){
        let is_ulaz = this.id === "ulaz";
        let o = getState();
        let needAlert = (is_ulaz && o.ufirmi) || (!is_ulaz && !o.ufirmi) || !o.sifra;
        if (needAlert && !confirm(`Akcija nije u skladu sa statusom, nastavi?`)) {
            return;
        }
        // postavi i submitaj formu
        $("select[name=indikator]").val(is_ulaz ? 0 : 4);
        $("input[type=submit]").click(); //$("form").submit();
    });
    // listener na dropdown
    $("select[name=sifra_dropdown]").change(function(){
      const self = this;
      assignVal("sifra", self.value, (v)=> { self.value = v });
      if (!self.value || self.value === "0") return;

      //let line = sifra +" Ime Prezime: U FIRMI - 19.4.2024 7:23:18";
      const m = $(document.body).html().match(new RegExp(
          `(${self.value}[^<>]+)`, 'g'
      ));
      // console.log(m);
      if (!m) return;
      setState(parseDData(m[ m.length-1 ])); //console.log(getState());
      displayRefresh();
    })
    .css("font-size", "30px")
    .after("<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>")
    .val("").change();

    $("input[type=submit]").css("font-size", "50px");

    let now = new Date();
    //prevent caching
    $("form").prepend(`<input type="hidden" name="r" value="${ now.getTime() }">`);
    //auto sign-in
    if (!getState().ufirmi && now.getHours() ===7 && now.getMinutes() <30) {
        $("#ulaz").click();
        //console.log("Imin");
    }
// });
})(jQuery);
