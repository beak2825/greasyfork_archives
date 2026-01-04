// ==UserScript==
// @name FDH_Script
// @description Script para Fanaticos del Hardware
// @namespace ComputerMaster
// @grant none
// @include https://www.3djuegos.com/*
// @version 2.40
// @author ComputerMaster
// @downloadURL https://update.greasyfork.org/scripts/368819/FDH_Script.user.js
// @updateURL https://update.greasyfork.org/scripts/368819/FDH_Script.meta.js
// ==/UserScript==

/**
 * jQuery based script for Fanaticos del Hardware
 */

/* HELPERS */

/**
 * Crea un modal para introducir la URL
 * @param {string} title
 * @param {string} img
 * @param {boolean} isReview
 */
const bbcodeCustomDialogo = (title, img, isReview) => {
  const clickOk = `bbcode_reemplaza('#form_mensaje', '', '[center][url='+ $('#form_fuente').val() +'][img]${img}', '[/img][/url][/center]'); cierra_ventana();`

  const data = `
    <p class='s14 fftit c0 mar_b6'>
      ¿A qué URL debe dirigir esta ${isReview ? 'review' : 'noticia'}?
    </p>
    <input type='text' name='form_fuente' id='form_fuente' class='input_gris br2 s13 c2 wi100' />
    <div class='comu_caja_fondo_boton br4 tar mar_t20'>
      <span onclick='cierra_ventana();' class='boton b_s14n mar_r8'>Cancelar</span>
      <span onclick="${clickOk}" class='boton b_s14 mar_r8'>Agregar fuente</span>
    </div>
  `

  const info = {
    titulo: `Insertar enlace de ${title}`,
    ancho: '500px',
    focus_open: '#form_fuente',
    focus_close: '#form_mensaje',
    cuerpo: data,
    fade: 1
  }

  crea_ventana(info)

  $('#form_fuente').on('keyup', (e) => {
    if (e.which === 13) {
      e.preventDefault()
      eval(clickOk)
    }
  })
}

/**
 * Inicializa los menús desplegables
 * @param {jQueryElement} boton
 * @param {jQueryElement} menu
 */
const initMenuDesplegable = (boton, menu) => {
  boton.bind('click', () => {
    menu.toggle(1, () => {
      if (menu.is(':visible') && menu.parents(':hidden').length === 0) {
        menu.css({ opacity: '1', transform: 'scale(1)' })
        $('body').bind('click keyup', (event) => {
          if (!event.keyCode || event.keyCode === 27) {
            menu.css({ opacity: '0', transform: 'scale(0.5)' })
            menu.toggle()
            $('body').unbind('click keyup')
          }
        })
      }
    })
  })
}

/**
 * Crea un modal para introducir la URL
 * @param {string} title
 * @param {string} url
 * @param {string} img
 * @param {boolean} isReview
 */
const itemizador = ({ title, url, isReview }) => {
  const item = $('.bbcode_boton:first').clone(true, true)
  item.attr('original-title', title)
  item.removeAttr('onclick')
  item.off('click')
  item.on('click', () => bbcodeCustomDialogo(title, url, isReview))
  item.attr('onclick', '')
  item.children().css({
    'background-image': `url(${url})`,
    'background-repeat': 'no-repeat',
    'background-size': '102px 20px',
    width: '102px',
    height: '20px'
  })
  item.css('width', '102px')
  item.css('height', '20px')

  return item
}

/**
 * Crea los botones de tamaños de letra
 * @param {string} url
 * @param {string} title
 * @param {number} size
 */
const crearBotonSize = ({ url, title, size }) => {
  const button = $('.bbcode_boton.dib:first').clone(true, true)

  button.attr('original-title', title)
  button.attr('onclick', `bbcode_reemplaza('#form_mensaje','','[size=${size}]','[/size]');`)
  button.children().css('background-image', `url(${url})`)

  return button
}

/* SEPARADOR */
const separador1 = $('.bbcode_sep:first').clone(true, true)
const separador2 = $('.bbcode_sep:first').clone(true, true)

/* CABECERA */
const cabecera = $('.bbcode_boton.dib:first').clone(true, true)

cabecera.attr('original-title', 'Cabecera')
cabecera.attr(
  'onclick',
  "bbcode_reemplaza('#form_mensaje','','[center][img]https://i.imgur.com/MVNipGI.gif','[/img][/center]');"
)
cabecera.children().css('background-image', 'url(https://i.imgur.com/g5pT7E2.jpg)')

/* MENÚ FUENTES */

const menuFuentes = $('#boton_bbcode_menu_alin_297')
  .parent()
  .clone(true, true)

const mfBoton = menuFuentes.children('#boton_bbcode_menu_alin_297')
const mfMenu = menuFuentes.children('#opciones_bbcode_menu_alin_297')

mfMenu.children('.dib.cur_p.bbcode_boton').remove()
mfBoton.attr('original-title', 'Fuentes')
mfBoton.attr('id', 'boton_bbcode_menu_fuen_0')
mfBoton.off('click')
mfMenu.attr('id', 'opciones_bbcode_menu_fuen_0')

mfBoton.children('.bbcode_ico_izq').css('background-image', 'url(https://i.imgur.com/H5EFJka.png)')

initMenuDesplegable(mfBoton, mfMenu)

/* MENÚ REVIEWS */

const menuReviews = $('#boton_bbcode_menu_alin_297')
  .parent()
  .clone(true, true)

const mrBoton = menuReviews.children('#boton_bbcode_menu_alin_297')
const mrMenu = menuReviews.children('#opciones_bbcode_menu_alin_297')

mrMenu.children('.dib.cur_p.bbcode_boton').remove()
mrBoton.attr('original-title', 'Reviews')
mrBoton.attr('id', 'boton_bbcode_menu_revi_0')
mrBoton.off('click')
mrMenu.attr('id', 'opciones_bbcode_menu_revi_0')

mrBoton.children('.bbcode_ico_izq').css('background-image', 'url(https://i.imgur.com/q9yTd0n.png)')

initMenuDesplegable(mrBoton, mrMenu)

/* MENÚ ITEMS */

const menuFuentesItems = [
  { url: 'http://i.imgur.com/UIluHZZ.jpg', title: 'ElChapuzasInformatico' },
  { url: 'http://i.imgur.com/Fv1RSll.jpg', title: 'MuyComputer' },
  { url: 'http://i.imgur.com/BB98BLj.jpg', title: 'HardZone' },
  { url: 'http://i.imgur.com/lqet9Ye.jpg', title: 'Noticias3D' },
  { url: 'http://i.imgur.com/wrZIMNh.jpg', title: 'Vandal' },
  { url: 'http://i.imgur.com/uofhdTL.jpg', title: 'Fanáticos del Hardware' }
]

const menuReviewsItems = [
  { url: 'http://i.imgur.com/Yu8rTYy.jpg', title: 'ElChapuzasInformatico' },
  { url: 'http://i.imgur.com/uc2In2i.jpg', title: 'MuyComputer' },
  { url: 'http://i.imgur.com/YMr2nOD.jpg', title: 'HardZone' },
  { url: 'http://i.imgur.com/KpZ7ulZ.jpg', title: 'Noticias3D' },
  { url: 'https://i.imgur.com/OLIpY4N.jpg', title: 'Fanáticos del Hardware' }
]

mfMenu.append(menuFuentesItems.map(fuente => itemizador(fuente)))
mrMenu.append(menuReviewsItems.map(review => itemizador({ ...review, isReview: true })))

/* TAMAÑOS */

const sizes = [
  { url: 'https://i.imgur.com/zfRJBZR.png', title: 'S', size: 12 },
  { url: 'https://i.imgur.com/ZktVHdv.png', title: 'M', size: 16 },
  { url: 'https://i.imgur.com/KFAtTCd.png', title: 'L', size: 20 },
  { url: 'https://i.imgur.com/h7S8Krl.png', title: 'XL', size: 24 }
]

const sizeItems = sizes.map(tam => crearBotonSize(tam))

/* MODO SEGURO */

if (
  window.location.href.indexOf('zona=escribir') > -1 ||
  window.location.href.indexOf('mensajes_escribir') > -1
) {
  let salir = 'Hay cambios sin guardar'

  $('.comu_caja_fondo_boton:last-child').onclick = () => {
    salir = null
    setTimeout(() => {
      salir = 'Hay cambios sin guardar'
    }, 3000)
  }

  $(window).on('beforeunload', () => ($('#form_mensaje').value !== '' ? salir : null))
}

/* INICIALIZACIÓN */

$('#tip').append([
  separador1,
  cabecera,
  menuFuentes,
  menuReviews,
  separador2,
  ...sizeItems
])
