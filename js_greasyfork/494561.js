// ==UserScript==
// @name             ConfiguracionCSV2
// @namespace        http://tampermonkey.net/
// @version          0.1
// @description      Configuracion
// @author           You
// @match            *://*/*
// @icon             https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant            none
// @run-at           document-end
// @downloadURL https://update.greasyfork.org/scripts/494561/ConfiguracionCSV2.user.js
// @updateURL https://update.greasyfork.org/scripts/494561/ConfiguracionCSV2.meta.js
// ==/UserScript==
(function() {
try{
    // VARIABLES GLOBALES
    let body            = document.getElementsByTagName("body")[0];
    let href            = location.href;
    let iframe          = "";
    let a               = "";
    let e               = "";
    let i               = "";
    let j               = "";
    let caso_codigo     = href.replace( /^\D+/g, '');
    let hoy             = new Date();
    let mesActual       = hoy.getMonth() + 1; // Sumamos 1 porque los meses van de 0 a 11
    let diaActual       = hoy.getDate();
    let pad             = (num) => (num < 10 ? "0" : "") + num;
    let fecha_desde     = `${hoy.getFullYear()}-${pad(mesActual)}-01`;
    let fecha_hasta     = `${hoy.getFullYear()}-${pad(mesActual)}-${pad(diaActual)}`;
    let fecha_hoy       = fecha_hasta;
    let id_silogtran    = '1188';
    let login_usuario   = 'MARLON.SANCHEZ';
    let login_correo    = 'marlon.sanchez@colombiasoftware.net';
    let pass_proyectos  = "bWGfpwWy84zqGTiPUnpeSfdwZNYU9rVK2Xw4njPu";
    let pass_tool       = "GKZ45NK8CXdk5MZvN7NWCRYx5zhZvbW5rpaEwEmS5Vk";
    let pass_pgadminpro = "G2dimx5I0hV7g4AvjMrd"
    let pass_pgadminpru = "od[U}r0YQd#+/)s5w5BAI";
    let pass_gitlab     = "44dc68f7d1f7702f82769dab742173f6";
    // LOGIN
    setTimeout(function(){
        console.clear();
        // PGADMIN
        if(url('pgadmin') && url('login')){
            document.getElementsByName("email")[0].addEventListener('blur', () => {
                setTimeout(() => {
                    ponerValor('email', login_correo, 'name');
                }, 1000);
            });
            document.getElementsByName("password")[0].addEventListener('blur', () => {
                setTimeout(() => {
                    if(url('.net')){
                        ponerValor('password', pass_pgadminpro, 'name');
                    } else {
                        ponerValor('password', pass_pgadminpru, 'name');
                    }
                }, 1000);
            });
        }
        // PROYECTOS
        if( (url('colombiasoftware') || url('cesred') || url('transexpress')) && url('LoginPage')){
            ponerValor('ctl0_MainModule_Usuario', login_usuario, 'id');
            ponerValor('ctl0_MainModule_Clave', pass_proyectos, 'id');
        }
        // TOOL
        if( (url('toolprojectcs') && url('LoginPage')) ){
            ponerValor('ctl0_MainModule_Usuario', login_usuario, 'id');
            ponerValor('ctl0_MainModule_Clave', pass_tool, 'id');
        }
        if(url('fx/login')){
            setTimeout(() => {
                document.querySelector('input[name="login"]').insertAdjacentHTML('afterend', `<div>${login_usuario}</div>`);
                document.querySelector('input[name="password"]').insertAdjacentHTML('afterend', `<div>${pass_tool}</div>`);
                console.log(`${login_usuario}\n${pass_tool}`);
            }, 5000);
        }
        // GITLAB
        if(url('git.colombiasoftware') && url('sign_in')){
            ponerValor('user_login', login_correo, 'id');
            ponerValor('user_password', pass_gitlab, 'id');
        }
    }, 1000);
    // MODIFICACIONES
    if(url('VisorHelpdesk&visor')){
        e = document.getElementsByClassName('tabForm');
        if(e[1]!=null){e[1].remove();}else{e[0].remove();}
        e = document.querySelectorAll('#ctl0_PanelHeader, #ctl0_MainModule_boton_buscaritem, #ctl0_MainModule_boton_buscaritemexcel, h2, hr, br');
        e.forEach(element => element.remove());
        // VISOR DE CASOS
        e = document.getElementById('ctl0_MainModule_visor');
        j = [17,16,15,13,12,11,7,6,5,3,2,1];
        for(i=0;i<e.rows.length;i++){
            j.forEach(element => e.rows[i].cells[element].style.display = 'none');
            if( (e.rows[i].cells[14].style.backgroundColor=='rgb(153, 204, 51)') || (e.rows[i].cells[14].style.backgroundColor=='rgb(255, 255, 102)')
               ||(e.rows[i].cells[0].textContent=='185453') // CASOS JLT
               ||(e.rows[i].cells[0].textContent=='185452') // CASOS JLT
               ||(e.rows[i].cells[0].textContent=='179442') // CASO SHIPPING
              ){
                e.rows[i].style.display = 'none';
            }
            e.rows[i].cells[4].textContent = Math.floor(e.rows[i].cells[4].textContent/60);
        }
        iframe = iframeCrear('https://toolprojectcs.colombiasoftware.net/index.php?page=Requerimiento.Helpdesk.Autorizarcasos','30px');
        document.getElementById("ctl0_PanelMainModule").appendChild(document.createElement("hr"));
        document.getElementById("ctl0_PanelMainModule").appendChild(iframe);
    }
    if(url('Helpdesk.Home&caso_codigo')){
        ponerValor('ctl0_MainModule_tiempoempleado','1', 'id');
        setInterval(function(){
            e = document.querySelectorAll('#ctl0_MainModule_caso_actualizacion, #ctl0_MainModule_caso_actualizacion_tecnica');
            e.forEach(element => element.value = element.value.replaceAll('<div>','').replaceAll('</div>','').replaceAll('<p>','').replaceAll('</p>','').replaceAll('amp;',''));
        }, 5000);
        a = document.createElement('a'); a.href = 'https://toolprojectcs.colombiasoftware.net/index.php?page=Requerimiento.Helpdesk.Actualizaciontecnica&Home&'+caso_codigo; a.textContent = 'ARCHIVOS ADJUNTOS'; a.style.fontWeight = 'bold'; a.target = '_blank';
        e = document.createElement('div');
        e.style.textAlign = 'left';
        e.innerHTML = `<br>
        <b><font color='green'>#Carpeta base</font><br>
        cd /development/marlonsanchez/base/<br><br>
        <font color='green'>#Bajar Cambios</font><br>
        git pull<br>
        git checkout develop && git fetch origin && git reset --hard origin/develop<br>
        git checkout test && git fetch origin && git reset --hard origin/test<br>
        git checkout main && git fetch origin && git reset --hard origin/main<br>
        git checkout caso-${caso_codigo} && git fetch origin && git reset --hard origin/caso-${caso_codigo} && git rebase origin/main<br><br>
        <font color='green'>#Subir Cambios</font><br>
        git push origin caso-${caso_codigo}<br><br><br>
        `;
        document.getElementsByTagName('h4')[0].parentElement.appendChild(a);
        document.getElementsByTagName('h4')[0].parentElement.appendChild(e);
        eliminarBordes();
    }
    //
    if(url('Actualizaciontecnica&Home')){
        e = document.getElementsByTagName('body')[0];
        e.innerHTML = '';
        iframe = iframeCrear('https://toolprojectcs.colombiasoftware.net/index.php?page=Requerimiento.Helpdesk.Actualizaciontecnica&CASO&'+caso_codigo,'250px');
        e.appendChild(iframe);
        iframe = iframeCrear('https://toolprojectcs.colombiasoftware.net/index.php?page=Requerimiento.Helpdesk.Actualizaciontecnica&CASO&'+caso_codigo,'250px');
        e.appendChild(iframe);
        iframe = iframeCrear('https://toolprojectcs.colombiasoftware.net/index.php?page=Requerimiento.Helpdesk.AdicionArchivo&CASO&'+caso_codigo,'400px');
        e.appendChild(iframe);
    }
    //
    if(url('Actualizaciontecnica&CASO')||url('AdicionArchivo&CASO', 'id')){
        ponerValor('ctl0_MainModule_tiempoempleado','1', 'id');
        ponerValor('ctl0_MainModule_actualizaciontecnica','Se agrega archivo.', 'id');
        ponerValor('ctl0_MainModule_fechaarchivo',fecha_hoy, 'id');
        setInterval(function(){
            e = document.querySelectorAll('#ctl0_MainModule_actualizaciontecnica');
            e.forEach(element => element.value = element.value.replaceAll('<div>','').replaceAll('</div>','').replaceAll('<p>','').replaceAll('</p>','').replaceAll('amp;',''));

            e = document.querySelectorAll('#ctl0_MainModule_itecasarc_archivo');
            e.forEach(element => element.value = element.value.replaceAll(/\\/g, '/'));
        }, 5000);
        e = document.querySelectorAll('#ctl0_MainModule_caso_codigo, #ctl0_MainModule_solicitud_codigo');
        e.forEach(element => element.value = caso_codigo);
        e = document.querySelectorAll('#ctl0_PanelHeader, #ocultar_cabecera, .hideShow, br');
        e.forEach(element => element.remove());
        e = document.querySelectorAll('table,tr,td');
        e.forEach(element => element.style.cssText = 'box-sizing: border-box; margin: 0; padding: 0;');
        eliminarBordes();
    }
    if(url('Autorizarcasos')){
        e = document.querySelectorAll('#ctl0_PanelHeader, .hideShow, br');
        e.forEach(element => element.remove());
        e = document.querySelectorAll('*');
        e.forEach(element => element.style.cssText = 'box-sizing: border-box; margin: 0; padding: 0;');
        e = document.querySelectorAll('input[type="checkbox"]');
        // Recorrer todos los checkboxes encontrados y marcarlos como seleccionados
        for (i = 0; i < e.length; i++) {
            e[i].checked = true;
        }
        document.querySelectorAll('tbody')[5].style.display = 'none';
        eliminarBordes();
    }
    //
    if(url('ControlAtencion.Home')){
        ponerValor('ctl0_MainModule_tecnico_codigo','USUARIO', 'id');
        ponerValor('ctl0_MainModule_tecnico_codigo_IDHidden',id_silogtran, 'id');
        if(document.getElementById('ctl0_MainModule_conate_fecha').value==''){
            ponerValor('ctl0_MainModule_conate_fecha',fecha_hoy, 'id');
        }
        i = document.querySelectorAll('input[id^="ctl0_MainModule_ItemsConate_ctl"][id$="_fecha"]');
        e = document.getElementById('ctl0_MainModule_conate_fecha').value;
        i.forEach(input => {
            input.value = e;
        });
        eliminarBordes();
    }
    //
    if(url('VisorRendimientoNEW')){
        ponerValor('ctl0_MainModule_caso_fechadesde', fecha_desde, 'id');
        ponerValor('ctl0_MainModule_caso_fechahasta', fecha_hasta, 'id');
        ponerValor('ctl0_MainModule_tipo_indicador', '1', 'id');
        ponerValor('ctl0_MainModule_visor_agrupamiento', 'INDIVIDUAL', 'id');
    }
     // FUNCIONES
    if(url('&reload')){
        location.reload();
    }
    function url(url_href) {
        return href.indexOf(url_href) > 0;
    }
    function iframeCrear(href, height) {
        let iframe = document.createElement('iframe');
        iframe.src = href;
        iframe.style.cssText = `width: 100%; border: 0; height: ${height};`;
        return iframe;
    }
    function ponerValor(inputId, inputValor, inputTipo) {
        let e = ''
        if(inputTipo=='id'){
            e = document.getElementById(inputId);
        } else if(inputTipo=='name'){
            e = document.getElementsByName(inputId)[0];
        }
        if(e!=''){
            e && (e.value = inputValor);
        }
    }
    function eliminarBordes(){
        e = document.querySelectorAll('hr,h2');
        e.forEach(element => element.remove());
        e = document.querySelectorAll('#ctl0_PanelHeaderLogo, #ocultar_cabecera, #leftCol, .copyRight');
        e.forEach(element => element.style.display = 'none');
    }
} catch(error) {
    console.log(error);
}
})();