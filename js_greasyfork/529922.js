// ==UserScript==
// @name         我的LT阅读器一键高亮补丁-开发版
// @namespace    https://www.ellibrototal.com/
// @version      2025-03-16.13
// @license      MIT
// @description  自己看书使用
// @author       You
// @match        https://www.ellibrototal.com/ltotal/*
// @icon         none
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/529922/%E6%88%91%E7%9A%84LT%E9%98%85%E8%AF%BB%E5%99%A8%E4%B8%80%E9%94%AE%E9%AB%98%E4%BA%AE%E8%A1%A5%E4%B8%81-%E5%BC%80%E5%8F%91%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/529922/%E6%88%91%E7%9A%84LT%E9%98%85%E8%AF%BB%E5%99%A8%E4%B8%80%E9%94%AE%E9%AB%98%E4%BA%AE%E8%A1%A5%E4%B8%81-%E5%BC%80%E5%8F%91%E7%89%88.meta.js
// ==/UserScript==

;(function () {
  "strict mode"

  //////// 更新日志
  //
  // 2025-03-15【从03-16回滚】
  // 实现：笔记查询界面 点击 contentHtmlDiv 后，自动关闭窗口
  // 实现：防止登录界面 contentHtmlDiv 受影响
  // 实现：兼容手机 isTouch ? "selectionchange" : "mouseup"
  // 实现：笔记正文时间戳
  //
  // 2025-03-14
  // 实现：手机界面不弹出键盘，优化删除键，尝试隐藏编辑窗口
  // 实现：通过 GM_setValue 实现 nota_title 自动填充高亮选择文字
  //
  // 2025-03-12
  // 实现：基本功能

  //////// 隐藏 div_nota_visor (CSS)
  GM_addStyle("#div_nota_visor { display: none !important; }")

  //////// 暴力猴子补丁 "/estaticosED/files/js/panelSocial-1.0.4.js" this.editNote

  function PanelSOCIAL(opts) {
    var playerMusic,
      panelMusic,
      musicaElement,
      that = this,
      boxFrame1,
      bodyDiv = document.body,
      settings = $.extend({}, opts)

    that.settings = settings
    that.nativeCapabilitiesTxt = ""
    that.textZoomVal = 1
    that.textColor = "clear"
    that.tipoLetra = 1
    that.mosaicSize = 0

    var floatTextViewer = null
    var diccTotal = null
    var contextualMenu = null
    var mosaico = null
    var clipboard
    var elementoAudio = document.createElement("AUDIO")

    var visorImagenes = null,
      visorImagenesIDs = null

    var isSmartPhone, isTablet, isTouch

    var executeNative = ltotalUtils.executeNative("TEST")
    var executeNativePlatform = ltotalUtils.executeNative("PLATFORM")
    var executeNativeCredentials = executeNative
    var orientationNative = ""

    var SycCredentials = null,
      loginReady = false,
      idCliente = 1
    var shareGiftAdmObject = null

    setTabletVars()

    var modoEstaticos = "produccion"
    function getContextoEstaticos() {
      var r = ""
      if (modoEstaticos == "desarrollo") {
        r = "estaticosED"
      }
      if (modoEstaticos == "produccion") {
        r = "/estaticosED/files"
      }
      return r
    }

    this.getContextoEstaticos = function () {
      return getContextoEstaticos()
    }

    function setTabletVars() {
      isSmartPhone = ltotalOS.isSmartPhone
      isTablet = ltotalOS.isTablet
      isTouch = isSmartPhone || isTablet
    }

    this.setTabletVars = function () {
      setTabletVars()
    }

    this.fullScreen = function () {
      if (
        (document.fullScreenElement && document.fullScreenElement !== null) || // metodo alternativo
        (!document.mozFullScreen && !document.webkitIsFullScreen)
      ) {
        // metodos actuales
        if (document.documentElement.requestFullScreen) {
          document.documentElement.requestFullScreen()
        } else if (document.documentElement.mozRequestFullScreen) {
          document.documentElement.mozRequestFullScreen()
        } else if (document.documentElement.webkitRequestFullScreen) {
          document.documentElement.webkitRequestFullScreen(
            Element.ALLOW_KEYBOARD_INPUT,
          )
        }
      }
    }

    this.cancelFullscreen = function () {
      if (document.cancelFullScreen) {
        document.cancelFullScreen()
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen()
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen()
      }
    }

    this.createIFRAME = function (opts) {
      if (boxFrame1) {
        $(boxFrame1).remove()
        boxFrame1 = null
      }

      var frameEpic,
        closeFrame1,
        settings = $.extend({}, opts)

      boxFrame1 = document.createElement("div")
      boxFrame1.setAttribute("class", "boxFrame1")
      boxFrame1.id = settings.id
      $(settings.hostDiv).append(boxFrame1)

      frameEpic = document.createElement("iframe")
      frameEpic.setAttribute("class", "frameEpic")
      frameEpic.setAttribute("src", settings.url)
      $(boxFrame1).append(frameEpic)

      closeFrame1 = document.createElement("div")
      closeFrame1.setAttribute("class", "closeFrame1")
      $(boxFrame1).append(closeFrame1)

      closeFrame1.onclick = function () {
        $(boxFrame1).remove()
        boxFrame1 = null
        if (typeof settings.close == "function") {
          settings.close()
        }

        panelSocial.setNativeMainViewBGColor(11, 28, 43)
      }

      boxFrame1.closeFrame = closeFrame1

      var doFull = true
      if (opts.avoidFullScreen) {
        doFull = false
      }

      if (doFull) {
        this.fullScreen()
      }
    }

    this.getBoxFrame = function () {
      return boxFrame1
    }

    this.openBook = function (_tipoLibro, _idLibro, _idTrad, extraParams) {
      that.closeMasInfoItem()

      var modoLibro = 1
      var searchWords = ""
      var txtsearch_exact = null
      var numePagina = null
      var numePaginaPercent = null
      var openVocabulary = null
      var numeSeccion = null
      var numePaginaSeccion = null
      var txtCoord = null
      var fechaVisto = null
      var dedicatoria = null

      var idRecRela = null
      var npagRecRela = null
      var idNotaRecRela = null

      var idNotaRela = null
      var npagNotaRela = null

      var idImagenRela = null
      var npagImagenRela = null

      var idLibroRela = null
      var idTradRela = null
      var npagLibroRela = null

      var idProyCitaRela = null
      var npagProyCitaRela = null
      var idCredCitaRela = null

      var idFotoPromo = null
      var idInstitutPromo = null
      var idRegalo = null

      var idLectorConcurso = null

      var fnAfterClose = null

      //Estadistica de apertura de libro en interfaz eDesk
      ltotalOS.statistics(
        83,
        "tipoLibro:" + _tipoLibro + " idLibro:" + _idLibro,
      )

      if (extraParams) {
        if (extraParams.searchWords) {
          modoLibro = 3
          searchWords = extraParams.searchWords

          if (extraParams.txtsearch_exact) {
            txtsearch_exact = 1
          }
        }
        if (extraParams.numePagina) {
          numePagina = extraParams.numePagina
        }
        if (extraParams.numePaginaPercent) {
          numePaginaPercent = extraParams.numePaginaPercent
        }
        if (extraParams.openVocabulary) {
          openVocabulary = extraParams.openVocabulary
        }
        if (extraParams.numeSeccion) {
          numeSeccion = extraParams.numeSeccion
        }
        if (extraParams.numePaginaSeccion) {
          numePaginaSeccion = extraParams.numePaginaSeccion
        }
        if (extraParams.txtCoord) {
          txtCoord = extraParams.txtCoord
        }
        if (extraParams.fechaVisto) {
          fechaVisto = extraParams.fechaVisto
        }
        if (extraParams.dedicatoria) {
          dedicatoria = extraParams.dedicatoria
        }
        if (extraParams.idRecRela) {
          idRecRela = extraParams.idRecRela
          npagRecRela = extraParams.npagRecRela
          idNotaRecRela = extraParams.idNotaRecRela
        }
        if (extraParams.idNotaRela) {
          idNotaRela = extraParams.idNotaRela
          npagNotaRela = extraParams.npagNotaRela
        }
        if (extraParams.idImagenRela) {
          idImagenRela = extraParams.idImagenRela
          npagImagenRela = extraParams.npagImagenRela
        }
        if (extraParams.idLibroRela) {
          idLibroRela = extraParams.idLibroRela
          idTradRela = extraParams.idTradRela
          npagLibroRela = extraParams.npagLibroRela
        }
        if (_tipoLibro && extraParams.tematico) {
          modoLibro = 4
          numeSeccion = 1
        }
        if (extraParams.idProyCitaRela) {
          idProyCitaRela = extraParams.idProyCitaRela
          npagProyCitaRela = extraParams.npagProyCitaRela
          idCredCitaRela = extraParams.idCredCitaRela
        }
        if (extraParams.idFotoPromo) {
          idFotoPromo = extraParams.idFotoPromo
        }
        if (extraParams.idInstitutPromo) {
          idInstitutPromo = extraParams.idInstitutPromo
        }
        if (extraParams.idRegalo) {
          idRegalo = extraParams.idRegalo
        }
        if (extraParams.fnAfterClose) {
          fnAfterClose = extraParams.fnAfterClose
        }
        if (extraParams.openInIndex) {
          modoLibro = 0
        }

        if (typeof extraParams.idLectorConcurso != undefined) {
          idLectorConcurso = extraParams.idLectorConcurso
        }
      }

      //Libros de investigacion abren en el indice
      if (_tipoLibro == 27 && numeSeccion == null && searchWords.length == 0) {
        modoLibro = 0
      }

      //Libros artículos (tipo 27 modo 2)
      if (_tipoLibro == 17) {
        _tipoLibro = 27
        modoLibro = 2
      }

      var viewerText = new ViewerText({
        idViewerTxt: "viewer_book",

        sections: null,
        tipoLibro: _tipoLibro,
        idLibro: _idLibro,
        idTrad: _idTrad,
        modoLibro: modoLibro,
        searchWords: searchWords,
        txtsearch_exact: txtsearch_exact,
        numePagina: numePagina,
        numePaginaPercent: numePaginaPercent,
        openVocabulary: openVocabulary,
        numeSeccion: numeSeccion,
        numePaginaSeccion: numePaginaSeccion,
        txtCoord: txtCoord,
        fechaVisto: fechaVisto,
        dedicatoria: dedicatoria,

        idRecRela: idRecRela,
        npagRecRela: npagRecRela,
        idNotaRecRela: idNotaRecRela,

        idNotaRela: idNotaRela,
        npagNotaRela: npagNotaRela,

        idImagenRela: idImagenRela,
        npagImagenRela: npagImagenRela,

        idLibroRela: idLibroRela,
        idTradRela: idTradRela,
        npagLibroRela: npagLibroRela,

        idProyCitaRela: idProyCitaRela,
        npagProyCitaRela: npagProyCitaRela,
        idCredCitaRela: idCredCitaRela,

        idFotoPromo: idFotoPromo,
        idInstitutPromo: idInstitutPromo,
        idRegalo: idRegalo,

        idLectorConcurso: idLectorConcurso,

        pageLeft: "1",
        SycCredentials: SycCredentials,
        fnOpen: function (_settings) {
          var editorNoteMini =
            typeof llector !== "undefined" &&
            llector.theresEditor &&
            llector.editorNoteMini
              ? true
              : false
          if (isTouch && editorNoteMini) {
            $(
              ".box_tool_bar_edition",
              panelSocial.selectedBook.boxViewerTXT,
            ).prepend(llector.contMinimized)
          }
        },
        fnClose: function (_settings) {
          var corpus = _settings.that.corpus
          //Chequear que haya corpus en modo indice ndice de paginas, para lanzar el corpus nuevamente
          if (isTouch && corpus && corpus.isPagesIndexMode) {
            corpus.close()
            return null
          }

          //Remueve del DOM, el corpus cuando cierra el libro
          if (corpus) {
            $(corpus.cont).remove()
          }

          //Invitar al usuario a registrarse al cerrar un libro por primera vez, sin sesion
          inviteToRegister()

          //Resetea el libro seleccionado
          panelSocial.selectedBook = null

          if (_settings.hasChangedFavorite) {
            that.settings.doARepaint = true
          }

          mosaico.destroyTab(viewerText.idTab)

          panelSocial.setNativeMainViewBGColor(11, 28, 43)

          if (fnAfterClose) {
            fnAfterClose()
          }

          var editorNoteMini =
            typeof llector !== "undefined" &&
            llector.theresEditor &&
            llector.editorNoteMini
              ? true
              : false
          if (isTouch && editorNoteMini) {
            if (panelSocial.settings.appendMode == "prepend") {
              $(panelSocial.settings.contMusicHostDiv).prepend(
                llector.contMinimized,
              )
            } else {
              $(panelSocial.settings.contMusicHostDiv).append(
                llector.contMinimized,
              )
            }
          }

          panelSocial.mosaico.resetLabel("banners", "banners", {
            labelID: "banners_banners",
          })
        },
        fnBookInfoReady: function (_info) {
          mosaico.updateTab(viewerText.idTab, _info)
        },
        fnDiscountNovedad: function (_tipoLibro, _idLibro, _extraClass) {
          mosaico.discountNovedad(_tipoLibro, _idLibro, _extraClass)
        },
        fnOpenBookComparado: function (_idLibro, _idTrad, _extra) {
          that.openBookComparado(_idLibro, _idTrad, _extra)
        },
        fnReadingProgress: function (_pgFin, _idItemFin, _settings) {
          //Guarda el progreso de lectura al pasar pagina
          if (lectorLogueado && !_settings.isProhibido) {
            var idLib = _settings.idLibro
            var idTrad = _settings.idTrad

            //Libros artículos (tipo 27 modo 2)
            if (_tipoLibro == 27 && _settings.modoLibro == 2) {
              _tipoLibro = 17
            }

            var numePaginaPercent = _settings.numePaginaPercent
            mosaico.saveBitacora(
              _tipoLibro,
              idLib,
              idTrad,
              _pgFin,
              _idItemFin,
              "",
              numePaginaPercent,
            )
          }
        },
      })

      mosaico.openObjectInTab(viewerText, "")
    }

    this.openBookComparado = function (_idLibro, _idTrad, _extraParams) {
      ltotalUtils.loadScript(
        getContextoEstaticos() + "/js/ltotal/viewerTxtComparado-1.0.0.js",
      )

      var versionsData = []
      var pg = 1

      if (_extraParams) {
        var versionsD = _extraParams.versionsData
        if (versionsD.length > 0) {
          versionsData = versionsD
        }

        if (_extraParams.pg) {
          pg = _extraParams.pg
        }
      }

      var viewerTextComparado = new ViewerTxtComparado({
        idLibro: _idLibro,
        idTrad: _idTrad,
        versionsData: versionsData,
        pg: pg,
        SycCredentials: SycCredentials,
        fnClose: function (_pgFin) {
          mosaico.destroyTab(viewerTextComparado.idTab)
        },
      })
      mosaico.openObjectInTab(viewerTextComparado, "Lectura comparada")
    }

    this.openDiccTotal = function (_word, _idDicc, _extraParams) {
      llector.loadColors()

      //NOTA!!
      //dicc_total opera de modo global con la variable diccTotal (una instancia)
      //y en pestanas (multiples instancias)
      if (diccTotal) {
        if (_word) {
          diccTotal.define(_word, diccTotal.seleccDic)
        }
        return null
      }

      var idWord = null
      var casoRela = null
      var relaInfo = null

      var signiSearch = null
      var openInTab = false
      var fnClose = function () {
        diccTotal = null
      }
      var fnAfterShowWord = null

      var diccAlfabetico = false

      if (_extraParams) {
        if (_extraParams.signiSearch) {
          signiSearch = _extraParams.signiSearch
        }
        if (_extraParams.openInTab) {
          openInTab = true
          fnClose = function () {
            mosaico.destroyTab(dicc.idTab)

            if ($(".boxMosaicFull").children().length == 0) {
              panelSocial.setNativeMainViewBGColor(11, 28, 43)
            }

            if (_extraParams && _extraParams.fromOffLineApp) {
              var cmdObj = { Module: "OfflineApp", Action: "PopWindow" }
              that.executeNative(cmdObj)
            }
          }
          fnAfterShowWord = function (_wd) {
            mosaico.updateTab(dicc.idTab, _wd)

            if (lectorLogueado) {
              mosaico.saveBitacora(16, -1, -1, -1, -1, _wd.toUpperCase(), null)
            }
          }
        }
        if (_extraParams.idWord) {
          idWord = _extraParams.idWord
        }
        if (_extraParams.casoRela) {
          casoRela = _extraParams.casoRela
        }
        if (_extraParams.relaInfo) {
          relaInfo = _extraParams.relaInfo
        }
        if (_extraParams.diccAlfabetico) {
          diccAlfabetico = true
        }
      }

      var settings = {
        settings: {
          containerTop: isSmartPhone ? 0 : 10,
          fnClose: fnClose,
          fnAfterShowWord: fnAfterShowWord,
        },
      }
      var dicc = jQuery.extend(true, settings, dicc_total)

      dicc.idActStat = 80
      dicc.getParentCont = function () {
        return bodyDiv
      }

      var idDicc = -1

      if (_idDicc) {
        idDicc = _idDicc
        dicc.seleccDic = _idDicc
      }

      if (diccAlfabetico) {
        dicc.diccAlfabetico = 1
      }

      if (idWord) {
        dicc.openContainerIDWord(idWord, casoRela, relaInfo)
      } else if (signiSearch) {
        dicc.openContainerIndexSigniSearch(idDicc, signiSearch)
      } else {
        if (_word) {
          dicc.openContainer(_word, idDicc)
        } else {
          if (diccAlfabetico) {
            var canOpenAlfabetico =
              _extraParams.publicDomain ||
              ltotalUtils.checkPermiso("anotador,anotador_palabras") ||
              (_extraParams.diccSYC &&
                ltotalUtils.checkPermiso("anotador_palabras_syc"))
            if (canOpenAlfabetico) {
              dicc.openContainer("", idDicc)
            } else {
              dicc.openContainerIntro()
            }
          } else {
            dicc.openContainerIntro()
          }
        }
      }

      if (openInTab) {
        mosaico.openObjectInTab(dicc, "Diccionario")
      } else {
        diccTotal = dicc
      }

      return dicc
    }

    this.openVideo = function (_item, _extra) {
      ltotalUtils.checkConnection()

      if (typeof panelVideo == "undefined") {
        ltotalUtils.loadScript("/estaticosED/files/js/ltotal/panelVideo.js")
        ltotalUtils.loadScript("/estaticosED/files/css/ltotal/panelVideo.css")
      }

      panelVideo.openVideo(_item, _extra)
    }

    this.openVideoVocabulary = function (item) {
      panelSocial.openVideo(item, { loadMode: "vocabulary" })
      var vc = panelVideo.corpus
      if (!vc) {
        vc = jQuery.extend(true, {}, corpus)
        panelVideo.corpus = vc
      }
      vc.showVideoVocabulary(item)
    }

    this.createBottomMenu = function (_parent) {
      return createBottomMenu(_parent)
    }

    function createBottomMenu(_parent) {
      var boxBottomMenu = $(".boxBottomMenu", _parent)[0]
      if (!boxBottomMenu) {
        boxBottomMenu = document.createElement("div")
        boxBottomMenu.setAttribute("class", "boxBottomMenu")
        $(_parent).append(boxBottomMenu)
      }

      return boxBottomMenu
    }

    this.showBottomMenu = function (_html, _closeTmr, _parent, _extra) {
      showBottomMenu(_html, _closeTmr, _parent, _extra)
    }

    function showBottomMenu(_html, _closeTmr, _parent, _extra) {
      var box = $(".boxBottomMenu", _parent)
      var boxBottomMenu = box[0]

      if (!boxBottomMenu.inited) {
        box.append('<div class="contentBox"></div>')
        boxBottomMenu.inited = true
      }

      $(".contentBox", box).html(_html)

      if (_extra && _extra.removeTools) {
        $(_extra.removeTools, boxBottomMenu).remove()
      }

      clearTimeout(boxBottomMenu.timerClose)

      if (!box.is(":visible")) {
        box.css({ display: "block", visibility: "hidden" })

        if (_extra && _extra.extraH && !boxBottomMenu.extraH) {
          var coh = boxBottomMenu.offsetHeight + _extra.extraH
          $(boxBottomMenu).css({ height: coh })
          boxBottomMenu.extraH = _extra.extraH
        }

        var oh = boxBottomMenu.offsetHeight + 10
        box.css({ bottom: "-" + oh + "px", visibility: "" })
        box.animate({ bottom: "+=" + oh })

        if (_closeTmr) {
          boxBottomMenu.timerClose = setTimeout(function () {
            closeBottomMenu(_parent)
          }, _closeTmr)
        }
      }
    }

    this.closeBottomMenu = function (_parent) {
      closeBottomMenu(_parent)
    }

    function closeBottomMenu(_parent) {
      var box = $(".boxBottomMenu", _parent)

      if (box.is(":visible")) {
        var oh = box[0].offsetHeight + 10
        box.animate({ bottom: "-=" + oh }, function () {
          box.css({ display: "" })
        })
      }
    }

    this.showConfig = function () {
      var html =
        '\
        <div class="mosa_config_cont">\
            <div class="close_btn"></div>\
            <div class="config_label">Tamaño de la interfaz</div>\
            <div class="size_btns_cont">\
                <div class="size_btn size_estandar_btn"><div class="checker"></div></div>\
                <div class="size_btn size_aumented_btn"><div class="checker"></div></div>\
            </div>\
        </div>'

      var config_cont = $(html)
      $(panelSocial.bodyDiv).append(config_cont)
      config_cont.fadeIn()

      $(".close_btn", config_cont)[0].onclick = function () {
        config_cont.fadeOut(function () {
          config_cont.remove()
        })
      }

      var btn_estandar = $(".size_estandar_btn", config_cont)
      var btn_aumented = $(".size_aumented_btn", config_cont)
      btn_estandar[0].onclick = function () {
        $(".size_btn", config_cont).removeClass("checked")
        $(this).addClass("checked")
        that.mosaico.aumentarSizeMosaico(0)
      }
      btn_aumented[0].onclick = function () {
        $(".size_btn", config_cont).removeClass("checked")
        $(this).addClass("checked")
        that.mosaico.aumentarSizeMosaico(1)
      }

      if (panelSocial.mosaicSize == 1) {
        btn_aumented.addClass("checked")
      } else {
        btn_estandar.addClass("checked")
      }
    }

    this.showTextLookTools = function (_obj, _extra) {
      var html

      var modeBottom = _extra && _extra.modeBottom

      if (isTouch || modeBottom) {
        var boxBottomMenu = $(".boxBottomMenu", _obj.boxViewerTXT)[0]
        if (
          $(boxBottomMenu).is(":visible") &&
          $(".box_txt_look", boxBottomMenu)[0]
        ) {
          return closeBottomMenu(_obj.boxViewerTXT)
        }

        html =
          '\
            <div class="box_txt_look tools_font_size">\
                <div class="txt_size_minus tool_txt_look" style="font-size:14px;"></div>\
                <div class="txt_size_plus  tool_txt_look" style="font-size:24px;"></div></div>\
            <div class="box_txt_look tools_text_color">\
                <div class="txt_color_clear tool_txt_look text_color"></div>\
                <div class="txt_color_cream tool_txt_look text_color"></div>\
                <div class="txt_color_dark  tool_txt_look text_color"></div>\
            </div>\
            <div class="box_txt_look tools_font_type">\
                <div class="tipoLetra1 tool_txt_look tool_font">Times</div>\
                <div class="tipoLetra2 tool_txt_look tool_font">DM Sans</div>\
                <div class="tipoLetra3 tool_txt_look tool_font">Literata</div>\
                <div class="tipoLetra4 tool_txt_look tool_font">Roboto</div>\
            </div>\
            '

        showBottomMenu(html, null, _obj.boxViewerTXT, _extra)

        if ($(".tools_font_size", _obj.boxViewerTXT)[0]) {
          var minus = $(".txt_size_minus", boxBottomMenu)
          var plus = $(".txt_size_plus", boxBottomMenu)
          panelSocial.configZoomTextBtns(minus, plus, _obj)

          mosaico.makeRoundButton(minus[0])
          mosaico.makeRoundButton(plus[0])
          $(".squared", $([minus[0], plus[0]])).html("A")
        }

        if ($(".tools_text_color", _obj.boxViewerTXT)[0]) {
          var clear = $(".txt_color_clear", boxBottomMenu)
          var cream = $(".txt_color_cream", boxBottomMenu)
          var dark = $(".txt_color_dark", boxBottomMenu)
          panelSocial.configColorTextBtns(
            clear[0],
            cream[0],
            dark[0],
            _obj,
            clear.parent(),
          )

          mosaico.makeRoundButton(clear[0])
          mosaico.makeRoundButton(cream[0])
          mosaico.makeRoundButton(dark[0])
          $(".squared", $([clear[0], cream[0], dark[0]])).html(
            '<div class="checker"></div>',
          )
        }

        if ($(".tools_font_type", _obj.boxViewerTXT)[0]) {
          panelSocial.configFontTextBtns(boxBottomMenu, _obj, _extra)
        }
      } else {
        var extraH = 0

        html =
          '\
            <div style="width:100%; height:10px; background-color:rgba(0, 0, 0, 0.1);"></div>\
            <div style="width:100%; height:10px; margin-top:5px; color:#99782C; text-align:center; font-size:15px;">Tamaño de letra</div>\
            <div class="text_look_tools" style="position:relative; width:60%; left:20%; height:40px; margin:20px 0 20px 0;">\
                <div class="text_size minus">A</div>\
                <div class="text_size plus">A</div>\
            </div>\
            '

        var toolsColorTema = _extra && _extra.toolsColorTema
        if (toolsColorTema) {
          html +=
            '<div class="box_theme_color">\
                    <div style="width:100%; height:10px; background-color:rgba(0, 0, 0, 0.1);"></div>\
                    <div style="width:100%; height:10px; margin-top:10px; margin-bottom:15px; color:#99782C; text-align:center; font-size:15px;">Tema del contenedor</div>\
                    <div class="text_look_tools" style="position:relative; width:60%; left:20%; height:40px; margin:20px 0 20px 0;">\
                        <div class="text_color clear"></div>\
                        <div class="text_color cream"></div>\
                        <div class="text_color dark"></div>\
                    </div>\
                </div>\
                '
          extraH += 100
        }

        var toolsTipoLetra = _extra && _extra.toolsTipoLetra
        if (toolsTipoLetra) {
          html +=
            '<div class="box_txt_type">\
                    <div style="width:100%; height:10px; background-color:rgba(0, 0, 0, 0.1);"></div>\
                    <div style="width:100%; height:10px; margin-top:10px; margin-bottom:15px; color:#99782C; text-align:center; font-size:15px;">Tipo de letra</div>\
                    <div class="tipoLetra1 tool_font">Times</div>\
                    <div class="tipoLetra2 tool_font">DM Sans</div>\
                    <div class="tipoLetra3 tool_font">Literata</div>\
                    <div class="tipoLetra4 tool_font">Roboto</div>\
                </div>\
                '
          extraH += 100
        }

        var modalViewer = _obj.showFloatTextViewer(html, "center")
        if (modalViewer) {
          modalViewer.rePaintFunc = function () {}
        }

        var cont = _obj.getFloatTextViewer().getContain()

        $(cont).addClass("box_text_look_tools")

        $(cont).css({
          width: "20%",
          left: "40%",
          height: "160px",
          "border-radius": "7px",
        })

        $(".contentHtml", cont).css({ width: "100%", "margin-left": "0" })

        $(".boxScroll", cont).remove()

        var minus = $(".minus", cont)
        var plus = $(".plus", cont)
        panelSocial.configZoomTextBtns(minus, plus, _obj)

        if (toolsColorTema) {
          var clear = $(".clear", cont)
          var cream = $(".cream", cont)
          var dark = $(".dark", cont)
          panelSocial.configColorTextBtns(
            clear[0],
            cream[0],
            dark[0],
            _obj,
            cont,
          )
        }

        if (toolsTipoLetra) {
          panelSocial.configFontTextBtns(cont, _obj, _extra)
        }

        if (extraH > 0) {
          var lec = (_obj.boxViewerTXT.offsetWidth - 380) / 2
          var hh = 160 + extraH
          $(cont).css({ width: "380px", height: hh + "px", left: lec + "px" })
        }

        var colorCont = _extra && _extra.colorCont
        if (colorCont) {
          $(cont).css({ "background-color": colorCont })
        }
      }
    }

    this.configColorTextBtns = function (_clear, _cream, _dark, _obj, _cont) {
      var text_color = $(".text_color", _cont)
      if (_clear) {
        _clear = $(_clear)
        _clear[0].onclick = function () {
          text_color.removeClass("checkmode")
          panelSocial.colorText("clear", _obj)

          _clear.addClass("checkmode")
        }

        if (panelSocial.textColor == "clear") {
          _clear.addClass("checkmode")
        }
      }

      if (_cream) {
        _cream = $(_cream)
        _cream[0].onclick = function () {
          text_color.removeClass("checkmode")
          panelSocial.colorText("cream", _obj)

          _cream.addClass("checkmode")
        }

        if (panelSocial.textColor == "cream") {
          _cream.addClass("checkmode")
        }
      }

      if (_dark) {
        _dark = $(_dark)
        _dark[0].onclick = function () {
          text_color.removeClass("checkmode")
          panelSocial.colorText("dark", _obj)

          _dark.addClass("checkmode")
        }

        if (panelSocial.textColor == "dark") {
          _dark.addClass("checkmode")
        }
      }
    }

    this.configZoomTextBtns = function (_minus, _plus, _obj) {
      _minus[0].onclick = function () {
        _plus.css({ color: "" })
        panelSocial.doTheZoomText(-0.1, true, _obj)

        if (panelSocial.textZoomVal <= 0.7) {
          _minus.css({ color: "rgba(153, 120, 44, 0.3)" })
        }
      }
      _plus[0].onclick = function () {
        _minus.css({ color: "" })
        panelSocial.doTheZoomText(0.1, true, _obj)

        if (panelSocial.textZoomVal >= 1.5) {
          _plus.css({ color: "rgba(153, 120, 44, 0.3)" })
        }
      }

      if (panelSocial.textZoomVal <= 0.7) {
        _minus.css({ color: "rgba(153, 120, 44, 0.3)" })
      }
      if (panelSocial.textZoomVal >= 1.5) {
        _plus.css({ color: "rgba(153, 120, 44, 0.3)" })
      }
    }

    this.configFontTextBtns = function (_boxMenu, _obj, _extra) {
      var toolFonts = $(".tool_font", _boxMenu)
      toolFonts.each(function () {
        $(this).append('<div class="checker"></div>')
        this.onclick = function () {
          toolFonts.removeClass("checkmode")
          $(this).addClass("checkmode")

          var font = parseInt(
            this.className.match(/tipoLetra\d+/)[0].match(/\d+/)[0],
          )
          panelSocial.changeFontText(font, _obj, _extra)
        }
      })
      $(".tipoLetra" + panelSocial.tipoLetra, _boxMenu).addClass("checkmode")
    }

    this.doTheZoomText = function (_inc, _savePref, _obj) {
      panelSocial.zoomText(_inc, _savePref)
      panelSocial.mosaico.zoomTextObjectsTabs()
      if (_obj.rePaint) {
        _obj.rePaint({ forcedRepaint: true })
      }
    }

    this.zoomText = function (_inc, _savePref) {
      var vTxtRules = []
      $.each(document.styleSheets, function () {
        if (this.href) {
          $.each(this.cssRules, function () {
            if (
              this.style &&
              this.selectorText &&
              (this.selectorText.indexOf(".boxViewerTXT") == 0 ||
                this.selectorText.indexOf("#dicc_total") == 0 ||
                this.selectorText.indexOf(".boxViewerTXTComparado") == 0 ||
                this.selectorText.indexOf(".modalViewerLT") > -1 ||
                this.selectorText.indexOf("#div_nota_visor") == 0 ||
                this.selectorText.indexOf(".paginaLibroOut") == 0)
            ) {
              vTxtRules.push(this)
            }
          })
        }
      })

      if (vTxtRules.length > 0 && _inc != 0) {
        var netxZoom = parseFloat((panelSocial.textZoomVal + _inc).toFixed(1))
        if (netxZoom > 1.5 || netxZoom < 0.7) {
          return null
        }

        panelSocial.textZoomVal = netxZoom

        $.each(vTxtRules, function () {
          //var st = this.selectorText;
          var fs = this.style["font-size"]
          if (fs && fs.length > 0 && fs.toUpperCase().indexOf("EM") > -1) {
            var em = parseFloat(fs) + _inc
            this.style["font-size"] = em + "em"

            if (isTouch) {
              this.style["line-height"] = "1.4em"
            }
          }
        })

        if (_savePref) {
          ltotalOS.setPreferenciaLector("textZoomVal", netxZoom)
        }
      }
    }

    this.colorText = function (_theme, _obj) {
      $(_obj.boxViewerTXT).removeClass("cream dark")
      var huboTema = false

      if (_theme == "cream") {
        $(_obj.boxViewerTXT).addClass("cream")
        panelSocial.setNativeMainViewBGColor(251, 246, 226)
        huboTema = true
      }
      if (_theme == "dark") {
        $(_obj.boxViewerTXT).addClass("dark")
        panelSocial.setNativeMainViewBGColor(0, 0, 0)
        huboTema = true
      }
      if (!huboTema) {
        //Este es el tema "clear"
        panelSocial.setNativeMainViewBGColor(255, 255, 255)
      }

      panelSocial.textColor = _theme

      ltotalOS.setPreferenciaLector("textColor", _theme)
    }

    this.changeFontText = function (_font, _obj, _extra) {
      $(_obj.boxViewerTXT).removeClass(
        "tipoLetra1 tipoLetra2 tipoLetra3 tipoLetra4",
      )
      $(_obj.boxViewerTXT).addClass("tipoLetra" + _font)

      panelSocial.tipoLetra = _font
      ltotalOS.setPreferenciaLector("tipoLetra", _font)

      if (_extra && typeof _extra.fnAfterFontType == "function") {
        _extra.fnAfterFontType()
      }
    }

    this.openBookVocabulary = function () {
      var book = panelSocial.selectedBook
      var c = book.corpus
      if (!c) {
        c = jQuery.extend(true, {}, corpus)
        book.corpus = c
      }

      c.showBookVocabulary(book)
    }

    this.editNote = function (tipo_nota, id_nota, _extra) {
      if (!_extra) {
        _extra = {}
      }
      if (isTablet || isSmartPhone) {
        _extra.position = 4
      }

      var config = {
        containerClass: "editor_notas_edesk",
        parentContainer: bodyDiv,
        position: _extra.position,
        subrayar: false,
        activarSeleccion: false,
        mostrarBarra: true,
        bindTouch: isTouch,

        tipoItemRela: _extra.tipoItemRela,
        idItemRela: _extra.idItemRela,
        idItem2Rela: _extra.idItem2Rela,
        npagItemRela: _extra.npagItemRela,
        idNotaRela: _extra.idNotaRela,
        txtRela: _extra.txtRela,

        correccionEdicion: _extra.correccionEdicion,

        nsecc: _extra.nsecc,

        afterSaveCallback: function (_data, _obj) {
          _obj.closeCont()

          var openMyNotas = true

          var sb = panelSocial.selectedBook
          if (sb) {
            var sets = sb.settings
            var ss = sb.settings
            if (_obj.tipoComp == ss.tipoLibro && _obj.idLibro == ss.idLibro) {
              sb.goToPageAndHighLightNote(_obj.npag, _obj.idNota).done(
                function () {
                  panelSocial
                    .getSeccionLibroByIDNota(27, 0, _obj.idNota)
                    .then(function (_nsec) {
                      var extra = { numeSeccion: _nsec }
                      // panelSocial.openBook(27, 0, -1, extra);
                      console.log("patched")
                    })
                },
              )
              openMyNotas = false
            } else {
              if (ss.tipoLibro == 27) {
                var extra = {}
                if (ss.modoLibro == 2) {
                  extra.modoLibro = 2
                }
                sb.bookGotoSection(_extra.nsecc, _extra.npagNote, extra)
                openMyNotas = false
              }
            }
          }

          if (openMyNotas) {
            var extra = { numeSeccion: 1 }
            if (_extra.nsecc) {
              extra.numeSeccion = _extra.nsecc
            }
            panelSocial.openBook(27, 0, -1, extra)
          }
        },
        extraParams: SycCredentials,
      }

      //Notas de personaje
      if (tipo_nota == 15) {
        config.mostrarBarra = false

        if (id_nota == 0) {
          fisher.newNote(config)
        }
        if (id_nota > 0) {
          fisher.editNote(id_nota, _extra.position, config)
        }
      }

      //Notas de lector
      if (tipo_nota == 17) {
        if (id_nota == 0) {
          llector.newNote(_extra.toBook, _extra.idProy, null, null, config)
        }
        if (id_nota > 0) {
          if (!_extra.npagNote) {
            _extra.npagNote = "0"
          }
          llector.editNote(id_nota, _extra.npagNote, null, config)
        }
      }
    }

    // this.deleteNote = function (tipo_nota, id_nota, _fncb) {
    //     DialogueLM({
    //       show: true,
    //       ModoBtn: true,
    //       btnClose: true,
    //       btnCancelar: "Cancelar",
    //       btnAceptar: "Aceptar",
    //       texto: "¿Está seguro de borrar esta nota?",
    //       fnAceptar: function () {
    //         var url = "/ltotal/lector/editNota.jsp"
    //         var params = { caso: 5, tipoNota: tipo_nota, idNota: id_nota }
    //         panelSocial.doPost(url, params).done(_fncb)
    //       },
    //       fnCancelar: function () {},
    //     })
    //   }

    //////// 去除确认 DialogueLM
    this.deleteNote = function (tipo_nota, id_nota, _fncb) {
      var url = "/ltotal/lector/editNota.jsp"
      var params = { caso: 5, tipoNota: tipo_nota, idNota: id_nota }
      panelSocial.doPost(url, params).done(_fncb)
    }

    this.sendNote = function (id_nota) {
      llector.grupos.dialogEnviarNota(id_nota)
    }

    this.discardNote = function (id_project, id_nota) {
      llector.grupos.setNota(2, id_project, id_nota, 0, 0, 0)
    }

    this.doPost = function (url, params) {
      var queryURL = ltotalOS.getPostURL(url)

      params.ltotalurl = url
      jQuery.extend(params, SycCredentials)
      params = $.trim(decodeURIComponent($.param(params)))
      return $.post(queryURL, params)
    }

    var buscaIDS = function (_lista, _tipo_item, _idsvec) {
      var rex = new RegExp("\\b" + _tipo_item + "_", "gi")
      $.each(_lista, function (i, e) {
        if (hasClassRegex(rex, e)) {
          var id = getCellID(e)

          //El Concurso --> 31,123 --> 31_123
          var ID = id[1].replace(",", "_")

          _idsvec.push(ID)
        }
      })
    }

    //Abrir visor imagenes desde el mosaico
    function openMosaicImage(imageItem) {
      var idImg = getCellID(imageItem)[1]

      //El Concurso --> 31,123 --> 31_123
      idImg = idImg.replace(",", "_")

      var label = imageItem.lbl

      //NOTA!!
      //El mosaico aguanta imagenes normales o de concurso por aparte,
      //NO se pueden mezclar estos dos tipos de imagenes

      var idsimgs = []
      buscaIDS(label.items, "(6|31)", idsimgs)

      //Asegura que solo coja imagenes e imagenes de concurso
      idsimgs = idsimgs.filter(function (_id) {
        return /^\d+$/.test(_id) || /^31_\d+$/.test(_id)
      })

      that.processIdsImages(idsimgs, idImg)
    }

    this.processIdsImages = function (idsimgs, idImg) {
      if (!idsimgs) {
        return null
      }

      //Orden de las imagenes
      var cantImgs = idsimgs.length
      var idsimgsOrder = []
      $.each(idsimgs, function (i, e) {
        idsimgsOrder[e] = i
      })

      var posImag = 1
      if (idImg) {
        posImag = idsimgsOrder[idImg] + 1
      }

      visorImagenesIDs = idsimgs

      ltotalOS
        .loadData("imagenes", "rutas", idsimgs, "")
        .done(function (htmlData) {
          that.openImage(cantImgs, posImag, htmlData, idsimgsOrder)
        })
    }

    this.refreshVisorImagenes = function (idImg) {
      var boxViewerImg = $(".boxViewerImg")
      if (boxViewerImg[0]) {
        $(".closeViewer", boxViewerImg).trigger("click")
        that.processIdsImages(visorImagenesIDs, idImg)
      } else if (idImg) {
        that.processIdsImages([idImg], null)
      }
    }

    this.openImage = function (cantImgs, posImag, rutasData, idsimgsOrder) {
      that.closeMasInfoItem()

      //Orden de las imagenes
      var rutasOrder = []
      $.each(rutasData.split(","), function (i, e) {
        var idr = e
          .match(/\d+\.(jp(e)?g||png)/i)[0]
          .replace(/\.(jp(e)?g||png)/i, "")

        //Las imagenes del concurso van con el prefijo 31_
        if (e.indexOf("/concurso/") > -1) {
          idr = "31_" + idr
        }

        rutasOrder[idsimgsOrder[idr]] = e
      })

      that.openImageGeneric(cantImgs, posImag, rutasOrder)
    }

    this.openImageGeneric = function (cantImgs, posImag, rutasOrder, extra) {
      ltotalUtils.loadScript(
        getContextoEstaticos() + "/js/ltotal/viewerImage-1.0.0.js",
      )

      //JSON con las rutas
      var rutas = $.map(rutasOrder, function (rut, i) {
        return ['{"url":"' + rut + '","marks": []}']
      })
      var listaImgs = "[" + rutas.join(",") + "]"

      var modeImages = "ltotal_images"
      var titlesIMGS = []

      if (extra) {
        if (extra.modeImages) {
          modeImages = extra.modeImages
        }
        if (extra.titlesIMGS) {
          titlesIMGS = extra.titlesIMGS
        }
      }

      var mijson = JSON.parse(listaImgs)
      visorImagenes = new ImgViewer({
        Toolbox: true,
        bottomTools: "85px",
        imgLensHeight: "100%",
        zoom: false,
        girar: false,
        paginador: false,
        marcasdef: false,
        guiadocumento: false,
        imglado_b: false,
        zoomInicial: 1.0,
        loadedImg: function () {
          if (modeImages == "ltotal_images") {
            //Estadistica de imagenes en interfaz eDesk
            ltotalOS.statistics(86, viewerImage.getImgID())
            //Incluye ilustracion en lo visto recientemente (lector logueado)
            if (lectorLogueado) {
              mosaico.saveBitacora(
                6,
                -1,
                -1,
                -1,
                viewerImage.getImgID(),
                "",
                null,
              )
            }

            ltotalOS.timeStats({ tipoEvento: "pags_libro" })
          }
          if (modeImages == "generic_images") {
            //Quita botones
            $(
              ".share_img, .tag_favorite, .editImage, .eraseImage, .novedadImage, .infoImage",
              viewerImage.getContain(),
            ).remove()
          }
        },
      })
      visorImagenes.load(mijson, posImag - 1)

      var viewerImage = new ViewerImage({
        hostDiv: that.bodyDiv,
        visorImagenes: visorImagenes,
        content: visorImagenes.frameViewer,
        txt: "",
        cantTxt: "",
        cantImgs: cantImgs,
        rutasOrder: rutasOrder,
        mosaico: mosaico,
        modeImages: modeImages,
        titlesIMGS: titlesIMGS,
      })
    }

    this.getFloatTextViewer = function () {
      return floatTextViewer
    }

    this.verMasInfoItem = function (tipoItem, id, item, _extra) {
      var agrupador = $(item).attr("label_agrupador")

      var extraParams = {
        basic_info: true,
      }
      jQuery.extend(extraParams, SycCredentials)

      if (_extra) {
        jQuery.extend(extraParams, _extra)
      }

      return ltotalOS
        .loadData(tipoItem, "mas_informacion", id, extraParams)
        .done(function (htmlData) {
          htmlData = htmlData.replace(/(<br>){2,}/g, "<br><br>")

          var proc = $(document.createElement("div"))
          $(proc).html(htmlData)

          var ilust = $(".img_credits_in", proc).detach()[0]

          $(".txt_desc_ilust", proc).replaceWith(function () {
            return this.innerHTML
          })
          $(".paginaLibroOut", proc).replaceWith(function () {
            return this.innerHTML
          })

          $(".music_title", proc).css({ "font-size": "" })

          //Links a libros relacionados
          $(".book_relation", proc).each(function () {
            this.onclick = function () {
              var extra = null
              var cn = this.className

              var tipoItemRela = cn.match(/tipo_item_\d+/)[0].match(/\d+/)[0]
              var idItemRela = cn.match(/id_item_\d+/)[0].match(/\d+/)[0]
              var idLibro = cn.match(/id_lib_\d+/)[0].split("_")[2]
              var idTrad = cn.match(/id_trad_\d+/)[0].split("_")[2]

              var nPag = cn.match(/n_pag_\d+/)
              if (nPag) {
                nPag = nPag[0].match(/\d+/)[0]
                if (nPag > 0) {
                  if (tipoItemRela == 6) {
                    extra = {
                      idImagenRela: idItemRela,
                      npagImagenRela: nPag,
                      numePagina: nPag,
                    }
                  }
                }
              }

              that.openBook(1, idLibro, idTrad, extra)

              //Cerrar visor de imagenes
              var bvi = $(".boxViewerImg")
              if (bvi[0]) {
                $(".closeViewer").trigger("click")
              }
            }
          })

          var relaAutor = $(".rela_author", proc)
          if (relaAutor[0]) {
            relaAutor.html("Relacionado a " + relaAutor.html())
          }

          var tipoLibro = 0
          var idLibro = null
          var idTrad = null

          if (item) {
            var cell = getCellID(item)
            var dataItem = cell[1].split(",")
            tipoLibro = cell[0]
          }

          //Editar libro
          if (tipoLibro == 1 && $(".hdn_libro_editar", proc)[0]) {
            proc.prepend(
              $(
                '<div class="tag_tool tool_edit" title="Editar libro ' +
                  id +
                  '" onclick="edicion.libros.showLoad(' +
                  id +
                  ')"></div>',
              ),
            )
          }

          //Borrar libro
          if (tipoLibro == 1 && $(".hdn_libro_borrar", proc)[0]) {
            proc.prepend(
              $(
                '<div class="tag_tool tool_borrar" title="Borrar libro ' +
                  id +
                  '" onclick="edicion.libros.borrarLibro(' +
                  id +
                  ')"></div>',
              ),
            )
          }

          //Eliminar remplazar tags de libro
          edicion.libros.eliminarTags($(".tags", proc)[0], id)

          //Editar traduccion
          if (tipoLibro == 4 && $(".hdn_libro_editar", proc)[0]) {
            proc.prepend(
              $(
                '<div class="tag_tool tool_edit" title="Editar traduccion ' +
                  dataItem[1] +
                  '" onclick="edicion.traducciones.editTrad(' +
                  dataItem[1] +
                  ')"></div>',
              ),
            )
          }

          //Editar autor
          if ($(".hdn_autor_editar", proc)[0]) {
            proc.prepend(
              $(
                '<div class="tag_tool tool_edit" title="Editar autor ' +
                  id +
                  '" onclick="edicion.autores.showLoad(' +
                  id +
                  ')"></div>',
              ),
            )
          }

          //Editar imagen
          if ($(".hdn_img_editar", proc)[0]) {
            proc.prepend(
              $(
                '<div class="tag_tool tool_edit" title="Editar imagen ' +
                  id +
                  '" onclick="edicion.imagenes.showLoad(' +
                  id +
                  ')"></div>',
              ),
            )

            var hasEditor =
              typeof llector !== "undefined" && llector.theresEditor
                ? true
                : false
            if (hasEditor) {
              var toolSend = $(
                '<div class="tag_tool tool_send_img" title="Enviar imagen a Editor"></div>',
              )
              proc.prepend(toolSend)
              toolSend[0].onclick = function () {
                that.sendImgToNote(id, ilust)
                that.closeMasInfoItem()
              }
            }
          }

          //Herramientas de la música
          proc.prepend($(".ficha_pescar, .ficha_create_nota", proc))
          if ($(".hdn_edit_music", proc)[0]) {
            proc.prepend(
              $(
                '<div class="tag_tool tool_edit" title="Editar música ' +
                  id +
                  '" onclick="edicion.musica.showLoad(' +
                  id +
                  ')"></div>',
              ),
            )
          }
          if ($(".hdn_delete_music", proc)[0]) {
            proc.prepend(
              $(
                '<div class="tag_tool tool_borrar" title="Borrar música ' +
                  id +
                  '" onclick="edicion.musica.borrar(' +
                  id +
                  ')"></div>',
              ),
            )
          }
          if ($(".hdn_public_ewall", proc)[0]) {
            proc.prepend(
              $(
                '<div class="tag_tool tool_publish" title="Publicar música en eWall ' +
                  id +
                  '" onclick="edicion.musica.setEwall(1, ' +
                  id +
                  ')"></div>',
              ),
            )
          }
          if ($(".hdn_delete_ewall", proc)[0]) {
            proc.prepend(
              $(
                '<div class="tag_tool tool_unpublish" title="Publicar música en eWall ' +
                  id +
                  '" onclick="edicion.musica.setEwall(0, ' +
                  id +
                  ')"></div>',
              ),
            )
          }

          //Editar proyecto
          if ($(".hdn_proyecto_editar", proc)[0]) {
            proc.prepend(
              $(
                '<div class="tag_tool tool_edit" title="Editar proyecto ' +
                  id +
                  '" onclick="edicion.proyectos.showLoad(' +
                  id +
                  ')"></div>',
              ),
            )
          }

          //Herramientas de video
          if ($(".hdn_edit_video", proc)[0]) {
            proc.prepend(
              $(
                '<div class="tag_tool tool_edit" title="Editar video ' +
                  id +
                  '" onclick="edicion.videos.showLoad(' +
                  id +
                  ')"></div>',
              ),
            )
          }
          if ($(".hdn_delete_video", proc)[0]) {
            proc.prepend(
              $(
                '<div class="tag_tool tool_borrar" title="Borrar video ' +
                  id +
                  '" onclick="edicion.videos.borrarVideo(' +
                  id +
                  ')"></div>',
              ),
            )
          }

          //Ir al libro
          if (
            (tipoItem == "libros" && !agrupador) ||
            tipoItem == "personajes" ||
            tipoItem == "proyectos"
          ) {
            var lnkHTML = '<div class="go_to_book">(Ir al Libro)</div>'
            if ($(".summary", proc)[0]) {
              $(".summary", proc).before(lnkHTML)
            } else {
              proc.append(lnkHTML)
            }

            var goToBook = $(".go_to_book", proc)[0]
            idLibro = dataItem[0]
            idTrad = dataItem[1]
            goToBook.onclick = function () {
              if (!idTrad) {
                idTrad = 0
              }

              if (tipoLibro == 4) {
                tipoLibro = 1
              }
              that.openBook(tipoLibro, idLibro, idTrad)
            }
          }

          that.generateShareGiftOptions(
            tipoItem,
            idLibro,
            idTrad,
            tipoLibro,
            proc,
            id,
            "share_gift",
            ilust,
          )

          //Ir a autor desde resena
          $(".tag_autor_resena", proc).each(function () {
            this.onclick = function () {
              var idAutorResena = this.className.split(" ")[1]
              var item = document.createElement("div")
              item.className = "cell 3_" + idAutorResena + " cvLD"
              item.style.display = "inline-block"
              if (isSmartPhone) {
                that.closeMasInfoItem()
              }
              panelSocial.clickSobreItem(item, "libros", panelSocial.mosaico)
            }
          })

          if ($.trim(proc[0].innerHTML.length) > 0) {
            var factor = 50
            var screW = $(window).width()
            var screH = $(window).height()
            var leftV = 0
            var topV = 100
            var heightV = screH * 0.6
            var widthV = screW * 0.26

            if (widthV < 400) {
              widthV = 400
            }

            var gridBx = $(".gridBox")
            if (item && gridBx[0]) {
              var elem = $(item)
              var elemW = elem.parent().width()
              var gBoxT = gridBx.offset().top
              var gBoxH = gridBx.height()

              var left = elem.offset().left
              leftV = left + elemW + factor

              topV = gBoxT + (gBoxH - heightV) / 2

              var posVisor = leftV + widthV
              if (posVisor > screW) {
                leftV = left - widthV - factor
              }
              if (leftV <= 0) {
                leftV = factor
              }
            } else {
              if (tipoItem == "musica" || tipoItem == "imagenes") {
                leftV = ""
              }
            }

            var setts = {
              bottomV: "60px",
              rightV: "100px",
              leftV: leftV,
              topV: topV,
              heightV: heightV,
              widthV: widthV,
            }

            if (
              extraParams.containMusicGoUp &&
              that.isContainMusicInFloatTextViewer()
            ) {
              panelMusic.placeContainer()
              panelMusic.shouldShowInfoMusic = false
            }

            if (tipoItem == "musica") {
              setts.draggable = true
            }

            if (_extra) {
              if (typeof _extra.showTheModal !== "undefined") {
                setts.showTheModal = _extra.showTheModal
              }
            }

            that.openModalTxtViewer(proc.children().detach(), setts)
          }
        })
    }

    function inviteToRegister() {
      var remInitSesion = ltotalUtils.fromLocalStorage("rememberInitSesion")
      if (!lectorLogueado && !remInitSesion) {
        ltotalUtils.toLocalStorage("rememberInitSesion", true)

        var ironCurtain = $(
          '<div class="iron_curtain" style="position: absolute; top: 0%; left: 0%; width: 100%; height: 100%; background-color: rgba(25, 32, 35, 0.6); box-sizing: border-box;"></div>',
        )
        $(bodyDiv).append(ironCurtain)

        ironCurtain[0].onclick = function (_ev) {
          floatTextViewer.destroy()
          $(this).remove()
        }

        var modalHtml =
          '\
                <div class="rem_init_sesion">\
                    Para guardar el avance de sus lecturas, debe \
                    <span onclick="$(\'.iron_curtain\').trigger(\'click\'); panelSocial.mosaico.btnRegisterClick();" style="color: #0873F5; cursor: pointer;">crear una cuenta</span>\
                    gratis como lector. Si ya la tiene, por favor\
                    <span onclick="$(\'.iron_curtain\').trigger(\'click\'); panelSocial.mosaico.btnLoginClick();" style="color: #0873F5; cursor: pointer;">inicie sesión</span>\
                </div>\
                <div class="loginBtn showInitSesion">Iniciar sesión</div>\
                <div class="loginBtn showCreateAccount">Crear cuenta</div>\
            '

        var setts = {
          heightV: null,
          widthV: null,
          scrollSyc: false,
          bgColor: "rgb(255, 255, 255)",
          fnAfterClose: function () {
            ironCurtain.remove()
          },
        }

        that.openModalTxtViewer(modalHtml, setts)

        var cont = $(floatTextViewer.getContain())
        cont.addClass("boxLogin")
        $(".contentHtml", cont).css({
          width: "90%",
          "margin-left": "5%",
          "margin-top": "10%",
        })

        $(".showInitSesion", cont)[0].onclick = function () {
          $(".iron_curtain").trigger("click")
          panelSocial.mosaico.btnLoginClick()
        }

        $(".showCreateAccount", cont)[0].onclick = function () {
          $(".iron_curtain").trigger("click")
          panelSocial.mosaico.btnRegisterClick()
        }
      }
    }

    this.generateShareGiftOptions = function (
      tipoItem,
      idLibro,
      idTrad,
      tipoLibro,
      content,
      id,
      btnClassName,
      ilust,
    ) {
      generateShareGiftOptions(
        tipoItem,
        idLibro,
        idTrad,
        tipoLibro,
        content,
        id,
        btnClassName,
        ilust,
      )
    }

    this.shareGift = function (_shareOptions) {
      var bShareOptions = {
        hostDiv: bodyDiv,
        clickClose: function () {
          panelSocial.destroyShareModal()
        },
      }

      var shareGiftOptions = $.extend(bShareOptions, _shareOptions)

      panelSocial.destroyShareModal()

      if (isTouch) {
        that.closeMasInfoItem()
      }

      shareGiftAdmObject = new Share(shareGiftOptions)
      shareGiftAdmObject.shareGiftOptions = shareGiftOptions
    }

    this.rePaintShareModal = function () {
      if (shareGiftAdmObject && shareGiftAdmObject.getModalViewer()) {
        this.shareGift(shareGiftAdmObject.shareGiftOptions)
      }
    }

    this.rePaintModalViewer = function () {
      if (floatTextViewer && !isSmartPhone) {
        floatTextViewer.rePaint()
      }
    }

    this.sendImgToNote = function (id, ilust) {
      llector.creditsIN = []
      llector.creditsIN[0] = {
        cargar: 0,
        id: id,
        idLibro: -1,
        idTrad: -1,
        metadatos: "--id_ilustracion:" + id,
        npag: -1,
        tipo: 6,
        txt: "",
        img: ilust,
      }
      llector.applyCredits(null, null)
    }

    //Textos escritos por...
    this.getIntervention = function (_elem) {
      var id_lec = _elem.className.match(/cred_lector_\d+/)[0].match(/\d+/)[0]

      var url = "/ltotal/inicio/utils/ut_34.jsp"
      var queryURL = ltotalOS.getPostURL(url)

      var params = { id_lector: id_lec, ltotalurl: url }
      params = $.trim(decodeURIComponent($.param(params)))

      return $.post(queryURL, params).then(function (data) {
        var p = $("#proceso").html(data)
        var nomb = $(".nomb_lector", p).val()

        return [nomb]
      })
    }

    this.isContainMusicInFloatTextViewer = function () {
      var r = false
      if (floatTextViewer) {
        var containMusic = $(
          ".containMusic",
          that.getFloatTextViewer().getContain(),
        )
        if (containMusic[0]) {
          r = true
        }
      }
      return r
    }

    this.closeMasInfoItem = function () {
      if (floatTextViewer) {
        //Minimiza contenedor de musica
        var cm = $(".containMusic", floatTextViewer.getContain())[0]
        if (cm) {
          panelMusic.minimizeContainer()
        }

        floatTextViewer.destroy()
        floatTextViewer = null
      }
    }

    this.initLibroTotal = function (_mosaicViewer, _fncb, _extra) {
      if (
        executeNative &&
        executeNativePlatform == "nativeAndroid" &&
        panelSocial.nativeCapabilitiesTxt.indexOf("KeyChain") == -1
      ) {
        executeNativeCredentials = false
      }

      if (executeNativeCredentials) {
        that.getNativeCredentials()
      } else {
        isLogged()
      }

      bodyDiv = _mosaicViewer.mainFrame
      that.bodyDiv = bodyDiv
      ltotalOS.bodyDiv = bodyDiv

      $(bodyDiv).addClass("ltotal_viewer")

      if (_extra) {
        if (_extra.idCliente) {
          idCliente = _extra.idCliente
        }
      }

      if (diccTotal) {
        diccTotal.cerrar()
      }

      mosaico = new MosaicBooks({
        modePilars: true,
        withLogin: settings.withLogin,
        fnClose: function () {
          _mosaicViewer.close()
        },
      })

      $(mosaico.getContain()).css({ "background-color": "transparent" })

      _mosaicViewer.setContent(mosaico.getContain())

      that.mosaico = mosaico

      var finalFunc = function () {
        $(mosaico.getContain()).css({ "background-color": "" })

        var btnCerrar = settings.btnCerrar
        if (btnCerrar == "1") {
          mosaico.activateBtnCerrar()
        }

        if (_fncb) {
          _fncb()
        }
      }

      postInitLibroTotal(finalFunc)
    }

    function postInitLibroTotal(_fncb) {
      if (!loginReady) {
        setTimeout(function () {
          postInitLibroTotal(_fncb)
        }, 300)
        return null
      }

      if (lectorLogueado) {
        mosaico.SycCredentials = SycCredentials
      }

      try {
        mosaico.configHMarginItems()
        mosaico.aumentarSizeMosaico(that.mosaicSize)
        mosaico.clickSobrePilar("libros", _fncb)
        mosaico.configBtnLogin()
        mosaico.activateCategsMenuBtns()
      } catch (e) {
        setTimeout(function () {
          postInitLibroTotal(_fncb)
        }, 1500)
      }
    }

    this.clickSobreItem = function (item, servicio, mosaico, _extraParams) {
      //No ejecuta cuando hubo desplazamiento reciente del mosaico
      if (mosaico.dy > 10) {
        return null
      }

      //No ejecuta cuando el item acaba de aumentarse (zoom) en dispositivos tactiles
      if ($(item).parent()[0] && $(item).parent()[0].justZoomed) {
        $(item).parent()[0].justZoomed = false
        return null
      }

      mosaico.destroyHoverLabel(item)

      var cellid = getCellID(item),
        _tipo_item = cellid[0],
        _id_item = cellid[1],
        tipo_item = _tipo_item,
        music_single,
        ruta,
        extraParams = {
          //filtros: 'no'
        }

      extraParams.expandRelas = 1
      jQuery.extend(extraParams, SycCredentials)

      var extraData = item.className.match(/x_\w+_\w+/g)
      if (extraData != null) {
        $.each(extraData, function () {
          var xd = this.replace("x_", "").split("_")
          extraParams[xd[0]] = xd[1]
        })
      }

      if (_extraParams) {
        jQuery.extend(extraParams, _extraParams)
      }

      var extraParamsForBook = {}
      var idTradToOpenBanner = ""

      //consola([_tipo_item, _id_item, servicio]);

      //Validacion login de usuario, que permite ver mi biblioteca
      if (
        !lectorLogueado &&
        _id_item == 0 &&
        (_tipo_item == 18 || _tipo_item == 27 || _tipo_item == 44)
      ) {
        return that.showAlertMiBiblioteca(_tipo_item)
      }

      if (_tipo_item == "minibookhelp") {
        var helpID = cellid[1] + "_" + cellid[2]
        var help = {
          "18_1":
            "En este espacio aparecerán los Libros que haya consultado recientemente",
          "18_6":
            "En este espacio aparecerán las Imágenes que haya consultado recientemente",
          "18_10":
            "En este espacio aparecerá la Música que haya consultado recientemente",
          "18_45":
            "En este espacio aparecerán las Palabras de Diccionario que haya consultado recientemente",
          "18_51":
            "En este espacio aparecerán los Videos que haya consultado recientemente",
          "44_1":
            "Para agregar a Mis Favoritos, abra un libro y pique en el ícono de la estrella",
          "44_3":
            "Para agregar a Mis Favoritos, consulte un autor y pique en el ícono de la estrella",
          "44_6":
            "Para agregar a Mis Favoritos, consulte una imagen y en modo pantalla completa pique en el ícono de la estrella",
          "44_10":
            "Para agregar a Mis Favoritos, consulte una pieza musical y pique en el ícono de la estrella en la parte superior izquierda del reproductor",
          "44_45":
            "Para agregar a Mis Favoritos, haga clic sobre una palabra, seleccione la opción diccionario y pique en el ícono de la estrella",
        }

        if (helpID == "mydownld_1") {
          var cmdObj = { Module: "OfflineApp", Action: "ShowDocuments" }
          return panelSocial.executeNative(cmdObj)
        } else {
          return alertLM.show(bodyDiv, help[helpID])
        }
      }

      if (_tipo_item == "startsesion") {
        panelSocial.mosaico.btnLoginClick()
        return null
      }

      if (_tipo_item.search(/instrumentos/) > -1) {
        alertLM.show(
          bodyDiv,
          "Esta funcionalidad estará disponible próximamente",
        )
        return null
      }

      //Protector de pantalla
      if (_tipo_item == "screensaver") {
        if (_id_item == "contrainteligence") {
          panelSocial.screenSaver({
            withFrases: true,
            withMusic: true,
            combinedArt: true,
          })
        }
        if (_id_item == "photo") {
          panelSocial.screenSaver({ withFoto: true })
        }
        if (_id_item == "photomusic") {
          panelSocial.screenSaver({ withFoto: true, withMusic: true })
        }
        if (_id_item == "art") {
          panelSocial.screenSaver({ withArt: true })
        }
        if (_id_item == "artmusic") {
          panelSocial.screenSaver({ withArt: true, withMusic: true })
        }
        return null
      }

      //Musica aleatoria ewall
      if (_tipo_item == "randommusic") {
        return panelSocial.ewallMusic("MosaicBooks")
      }

      if (_tipo_item == "faq" || (_tipo_item == 1 && _id_item == 1565)) {
        return panelSocial.mosaico.showFrequentQuestions(extraParams)
      }

      if (_tipo_item == "appcalifica") {
        var iframeURL = "/ltotal/editor/app_califica/app_califica.jsp"
        return panelSocial.createIFRAME({
          hostDiv: bodyDiv,
          id: "iframeAppCalifica",
          url: iframeURL,
          avoidFullScreen: true,
        })
      }

      if (_tipo_item == "expoart") {
        return edicion.imagenes.expoArt.showLoad(_id_item, { item: item })
      }

      if (_tipo_item == "nuevos") {
        tipo_item = "libro"
        _id_item = "6100"
      }

      if (_tipo_item == "infantil") {
        tipo_item = "libro"
        //tipo_item = "autores";
        _id_item = "83"
      }

      if (_tipo_item == "clasico") {
        //tipo_item = 'libro';
        tipo_item = "autores"
        _id_item = "4944"
      }

      if (_tipo_item == "mydownld") {
        if ($(item).hasClass("format_epub")) {
          var cmdObj = {
            Module: "OfflineApp",
            Action: "OpenDownloadedBook",
            Parameters: [_id_item],
          }
          return panelSocial.executeNative(cmdObj)
        } else {
          var docID = _id_item.replace("pdf", "")
          var cmdObj = {
            Module: "OfflineApp",
            Action: "OpenDownloadedPDFDocumento",
            Parameters: [docID],
          }
          return panelSocial.executeNative(cmdObj)
        }
      }

      // Libros
      if (_tipo_item == 1) {
        tipo_item = "libro"

        if ($(item.lbl).hasClass("confrontados_0")) {
          return that.openBookComparado(_id_item, -1, null)
        }

        //NOTA!
        //Es se usa para forzar la apertura de un libro cuando el mosaico
        //esta en -- servicio -- de Musica y Arte
        //Estos items pueden traer codificados parametors
        //extra{} en className para configurar la apertura del libro
        if ($(item).hasClass("forceopen")) {
          var extra = {}
          var icn = item.className
          var idTrad = icn.match(/idTrad_\d+/)
            ? icn.match(/idTrad_\d+/)[0].match(/\d+/)[0]
            : -1

          return that.openBook(1, _id_item, idTrad, extra)
        }
      }

      // Autores
      if (_tipo_item == 3) {
        tipo_item = "autor"
      }

      //Traducciones
      if (_tipo_item == 4) {
        var bookData = _id_item.split(",")
        var openBanner = true

        if (item.lbl && $(item.lbl).hasClass("txtsearch")) {
          extraParamsForBook.searchWords = mosaico.getSearchTXTWords()

          //Marca de color para saber que libros ya se han abierto
          $(".tag_counter", item).css({
            border: "#9BDB0D",
            background: "linear-gradient(to bottom, #D5F788, #B3F918)",
          })

          if ($(item.lbl).hasClass("txtsearch_exact")) {
            extraParamsForBook.txtsearch_exact = 1
          }
          openBanner = false
        }

        //Libro regalo con foto
        var icn = item.className
        var foto_promo = icn.match(/foto_promo_libro_\d+/)
          ? icn.match(/foto_promo_libro_\d+/)[0].match(/\d+/)[0]
          : -1
        if (foto_promo > 0) {
          extraParamsForBook.idFotoPromo = foto_promo
          extraParamsForBook.numePagina = 1
          openBanner = false
        }

        //Envio de libro regalo con mensaje institucional
        var institut_promo = icn.match(/institut_promo_libro_\d+/)
          ? icn.match(/institut_promo_libro_\d+/)[0].match(/\d+/)[0]
          : -1
        if (institut_promo > 0) {
          extraParamsForBook.idInstitutPromo = institut_promo
          extraParamsForBook.numePagina = 1
          openBanner = false
        }

        //Libro regalo
        var regalo_libro = icn.match(/regalo_libro_\d+/)
          ? icn.match(/regalo_libro_\d+/)[0].match(/\d+/)[0]
          : -1
        if (regalo_libro > 0) {
          extraParamsForBook.idRegalo = regalo_libro
          extraParamsForBook.numePagina = 1
          openBanner = false
        }

        if ($(item).hasClass("openbook")) {
          openBanner = false
        }
        if (item.lbl && $(item.lbl).is(".x_tradslibro_1 ")) {
          openBanner = false
        }

        if (openBanner) {
          _id_item = bookData[0]
          idTradToOpenBanner = " idTradToOpenBanner_" + bookData[1]
          _tipo_item = 1
          tipo_item = "libro"

          item = $(item).clone()[0]
          item.className = "cell 1_" + _id_item + "_" + bookData[1] + " cvLD"
        }
      }

      //Imagen
      if (_tipo_item == 6) {
        var doOpenImage = true
        if (_extraParams && _extraParams.queryArt) {
          doOpenImage = false
        }

        if (doOpenImage) {
          return openMosaicImage(item)
        }
      }

      //Musica
      if (_tipo_item == 10) {
        music_single = $(".music_single", item)[0]
        if (music_single) {
          openMusic(item)
          return null
        }
        tipo_item = "album_musica"
      }

      //Genero literario
      if (_tipo_item == 14) {
        tipo_item = "genero"
      }

      //Diccionarios
      if (_tipo_item == 16) {
        var doDiccOpen = true
        if (_extraParams && _extraParams.doDiccsQuery) {
          doDiccOpen = false
        }

        if (doDiccOpen) {
          var wordDic = null
          if (mosaico.getPilarSelected() == "buscar") {
            wordDic = mosaico.getSearchWords()
          }
          if (item.lbl && $(item.lbl).hasClass("txtsearch")) {
            wordDic = mosaico.getSearchTXTWords()

            //Marca de color para saber que libros ya se han abierto
            $(".tag_counter", item).css({
              border: "#9BDB0D",
              background: "linear-gradient(to bottom, #D5F788, #C4F25D)",
            })
          }

          var classCounter = item.className.match(/counter_\d+/)
          if (classCounter) {
            //Abre el diccionario en la busqueda de significados
            return that.openDiccTotal(null, _id_item, {
              signiSearch: wordDic,
              openInTab: true,
            })
          } else {
            //Abre el diccionario el mosaico y busqueda de palabras
            var diccAlfabet = wordDic ? false : true
            var pubDomain = $(item).hasClass("publicDomain")
            return that.openDiccTotal(wordDic, _id_item, {
              openInTab: true,
              diccAlfabetico: diccAlfabet,
              diccSYC: $(item).hasClass("diccSYC"),
              publicDomain: pubDomain,
            })
          }
        }
      }

      //Filtro Autores
      if (_tipo_item == 19) {
        tipo_item = "autores"
      }

      //Filtro musica
      if (_tipo_item == 20) {
        tipo_item = "musica"
      }

      //Filtro generos
      if (_tipo_item == 21) {
        tipo_item = "generos"
      }

      //Filtro imagenes
      if (_tipo_item == 22) {
        tipo_item = "imagenes"
      }

      //Filtro audiolibros
      if (_tipo_item == 23) {
        tipo_item = "audiolibros"
      }

      //Investigaciones
      if (_tipo_item == 25) {
        tipo_item = "investigaciones"
      }

      //Filtro libros relacionados
      if (_tipo_item == 26) {
        tipo_item = "relacionados"
      }

      //Libros de investigacion
      if (_tipo_item == 27) {
        if ($(item).hasClass("tematico")) {
          return panelSocial.openBook(27, _id_item, -1, { tematico: true })
        }
        if (_id_item == 0) {
          return openBookNotas(27, _id_item)
        }

        if (item.lbl && $(item.lbl).hasClass("txtsearch")) {
          //Marca de color para saber que libros ya se han abierto
          $(".tag_counter", item).css({
            border: "#9BDB0D",
            background: "linear-gradient(to bottom, #D5F788, #C4F25D)",
          })

          return panelSocial.openBook(27, _id_item, -1, {
            searchWords: mosaico.getSearchTXTWords(),
          })
        }

        //Nota! Aumentar para lidiar con libros agrupadores por panel_data
      }

      //Items del concurso
      if (_tipo_item == 31) {
        var fn = concurso.clickSobreItem(_id_item)
        if (fn) {
          return fn()
        }

        //Imagen de concurso
        if (/^31,\d+$/.test(_id_item)) {
          return openMosaicImage(item)
        }
      }

      //Personajes
      if (_tipo_item == 32) {
        if (item.lbl && $(item.lbl).hasClass("txtsearch")) {
          //Marca de color para saber que libros ya se han abierto
          $(".tag_counter", item).css({
            border: "#9BDB0D",
            background: "linear-gradient(to bottom, #D5F788, #C4F25D)",
          })

          return panelSocial.openBook(32, _id_item, -1, {
            searchWords: mosaico.getSearchTXTWords(),
          })
        }

        //Noticias. Editorial
        //NOTA!! Este id está quemado.
        //NOTA!! Generalizar por tipo_personaje -> Dato que llega al consultar la caratula en load_image.jsp
        //if ( _id_item == 12 ) {
        //    return panelSocial.openBook(32, 12, -1, {openInIndex:true});
        //}
      }

      //Filtro compositores musicales
      if (_tipo_item == 35) {
        tipo_item = "compositores"
      }

      //Filtro intrepretes musicales relacionados
      if (_tipo_item == 36) {
        tipo_item = "interpretes"
      }

      //Filtro generos musicales
      if (_tipo_item == 37) {
        tipo_item = "generos_musicales"
      }

      //Tecnica artistica
      if (_tipo_item == 42) {
        tipo_item = "generos_artisticos"
      }

      //Palabra diccionario
      if (_tipo_item == 45) {
        if (_id_item > 0) {
          that.openDiccTotal(null, null, {
            openInTab: true,
            idWord: _id_item,
            casoRela: 1,
          })
        } else {
          var cellCoverText = $(".word_cover_text", item)
          var cellWord = $.trim(cellCoverText[0].innerHTML.replace(/\s+/, " "))
          that.openDiccTotal(cellWord, null, { openInTab: true, casoRela: 1 })
        }
        return null
      }

      if (_tipo_item == 51) {
        if (item.lbl && $(item.lbl).hasClass("txtsearch")) {
          //Marca de color para saber que los videos ya se han abierto
          $(".tag_counter", item).css({
            border: "#9BDB0D",
            background: "linear-gradient(to bottom, #D5F788, #C4F25D)",
          })
          return panelSocial.openVideo(item, {
            searchWords: mosaico.getSearchTXTWords(),
            loadMode: "search",
          })
        }
      }

      if (_tipo_item == "misdescargas") {
        return panelSocial.mosaico.downloadsMosaic()
      }

      var backNavig = true
      if (_extraParams && _extraParams.backNavig == false) {
        backNavig = false
      }

      var doCache = true
      if (_extraParams && _extraParams.doCache == false) {
        doCache = false
      }

      var processData = function (htmlData, mosaicTop) {
        var proc = $("#proceso")

        if (
          typeof htmlData == "string" &&
          htmlData.indexOf("txt_open_item") > -1
        ) {
          proc.html(htmlData)
          $(".txt_open_item.txt_libro", proc).each(function () {
            var bd = this.value.split(",")
            var idLibro = bd[0]
            var idTrad = bd[1]
            var nPag = parseInt(bd[2])
            var fecha = $.trim(bd[5])
            var nPagPercent = parseFloat(bd[6])

            if (nPag > 1) {
              if (nPag == 2) {
                nPag = 3
              }
              extraParams.numePagina = nPag
            }
            if (fecha.length > 0) {
              extraParams.fechaVisto = fecha
            }
            if (nPagPercent > 0) {
              extraParams.numePaginaPercent = nPagPercent
            }

            jQuery.extend(extraParams, extraParamsForBook)

            that.openBook(1, idLibro, idTrad, extraParams)
          })

          $(".txt_open_item.txt_id_proyecto", proc).each(function () {
            panelSocial.openBookNotas(27, _id_item)
          })
        } else {
          var proc = $("#proceso").html(htmlData)
          panelSocial.mosaico.LPWrapItems(proc[0].children)

          var labels = $(".cell_label", proc)
          labels.each(function () {
            var lbl = this
            var items = $(lbl).nextUntil(".cell_label")
            items.each(function () {
              this.lbl = lbl
            })

            lbl.items = items
            items.detach()
            if (items.length > 30) {
              lbl.fullItems = items
              lbl.items = items.slice(0, 30)
            }
            $(lbl).after(lbl.items)
          })

          mosaico.createMosaic2(proc[0].children, servicio, item, mosaicTop, {
            backNav: backNavig,
            saveCache: doCache,
          })

          ltotalOS.timeStats({ sumSegs: 3 })
        }
      }

      var cache = mosaico.getMosaicCache(mosaico.getPilarSelected(), item)
      if (cache) {
        var html = cache[0]
        var mosaicTop = 0

        mosaico.createMosaic2(html, servicio, item, mosaicTop, {
          backNav: backNavig,
          saveCache: doCache,
        })
      } else {
        //Consulta el servidor
        //Previene multiples clicks consultando
        try {
          var xhr = ltotalOS.loadData(
            servicio,
            tipo_item,
            _id_item,
            extraParams,
          )
          if (xhr) {
            that.createLoaderItem(item, xhr, null)

            xhr.done(function (htmlData) {
              if (
                (_tipo_item == 1 && servicio == "libros") ||
                _tipo_item == 3 ||
                _tipo_item == 17 ||
                _tipo_item == 27 ||
                _tipo_item == 32 ||
                _tipo_item == 51
              ) {
                var doBanner = true
                if (_extraParams && _extraParams.noBanner) {
                  doBanner = false
                }

                var idBanner = _tipo_item + "_" + _id_item
                var bannerExc = {
                  "3_0,1,0": 1,
                  "3_0,6,0": 1,
                  "3_0,10,0": 1,
                  "3_0,13,0": 1,
                  "51_0": 1,
                  "3_-1": 1,
                }
                if (bannerExc[idBanner]) {
                  doBanner = false
                }

                if (doBanner) {
                  htmlData =
                    '<div class="cell_label banner_label start_visible counter_1"><div class="tag_label">&nbsp;</div></div><div class="caratula_banner banner_ficha_item ' +
                    idBanner +
                    idTradToOpenBanner +
                    '"></div>' +
                    htmlData
                }
              }

              processData(htmlData, 0)
            })
          }
          return xhr
        } catch (e) {}
      }
    }

    this.createLoaderItem = function (_item, _xhr, _extra) {
      //Cargando...
      var loader = null
      var timerLoader = setTimeout(function () {
        loader = new PanelSOCIALLoaderItem()
        $(_item).append(loader.getContain())
      }, 500)

      var removeLoader = function () {
        if (loader) {
          loader.destroy()
        }
      }
      var timerRemoveLoader = setTimeout(function () {
        removeLoader()

        if (_extra && _extra.timeOutFN) {
          _extra.timeOutFN()
        }
      }, 13000)

      _xhr.done(function () {
        clearTimeout(timerLoader)
        clearTimeout(timerRemoveLoader)
        removeLoader()
      })
    }

    this.getRangeSelectionData = function () {
      var sel = rangy.getSelection()

      var selInfo = {
        anchorNode: sel.anchorNode,
        anchorOffset: sel.anchorOffset,
        focusNode: sel.focusNode,
        focusOffset: sel.focusOffset,
        isBackwards: sel.isBackwards(),
      }

      return selInfo
    }

    this.getSelectionText = function () {
      //Seleccion de texto
      var text = ""
      if (window.getSelection) {
        text = window.getSelection().toString()
      } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text
      }
      return $.trim(text)
    }

    this.showContextualMenu = function (_ev, _container, _cnf) {
      //Lanza herramientas: diccionario, crear notas, subrayar, subir datos relacionados con texto

      //NOTA! _config podria traer lista de botones preconfigurados por el cliente
      //con lista de {"buttonLabel", "buttonFunc"}

      var emptyMenu = function () {
        panelSocial.closeContextualMenu()
      }

      if (!contextualMenu) {
        contextualMenu = document.createElement("div")
        contextualMenu.className = "contextualMenu"
      }

      emptyMenu()

      var text = that.getSelectionText()
      var selData = that.getRangeSelectionData()
      if (text.length > 0) {
        $(_container).append(contextualMenu)

        //Botones del menu

        /*if (executeNative) {
                //Copiar nativo
                ltotalUtils.loadScript(getContextoEstaticos()+'/js/ltotal/clipboard.min.js');
                var btnCopy = document.createElement('div');
                btnCopy.className = 'menuBtn';
                $(btnCopy).attr('data-clipboard-text', text);
                $(btnCopy).text('Copiar');

                btnCopy.onclick = function() {
                    if (!clipboard) {
                        clipboard = new Clipboard('.menuBtn');
                        clipboard.on('success', function(e) {
                            e.clearSelection();
                        });
                        clipboard.on('error', function(e) {});
                    }
                    emptyMenu();
                };
                $(contextualMenu).append(btnCopy);
            }*/

        //Diccionario
        var btnDicc = document.createElement("div")
        btnDicc.className = "menuBtn"
        $(btnDicc).text("Diccionario")
        btnDicc.onclick = function () {
          var hayMosaico = $(_container).parents(
            ".boxMosaic, .boxMosaicFull",
          )[0]
            ? true
            : false
          var idDicc = _cnf && _cnf.idDicc ? _cnf.idDicc : null
          panelSocial.openDiccTotal(text, idDicc, {
            openInTab: hayMosaico ? true : false,
          })
          emptyMenu()
        }
        $(contextualMenu).append(btnDicc)

        if (_cnf) {
          //Configuracion del item sobre el que sale el menu contextual
          var ti = _cnf.tipoItem
          var ii = _cnf.idItem
          var ii2 = _cnf.idItem2
          var npi = _cnf.npagItem
          var ini = _cnf.idNotaItem
          var mi = _cnf.modoItem
          var isLectorAutorLibro = _cnf.isLectorAutorLibro
          var modoLectura = mi == 1 || (ti == 27 && mi == 2)

          var hayEditorLlector =
            typeof llector !== "undefined" && llector.theresEditor
          var hayEditorFisher =
            typeof fisher !== "undefined" && fisher.theresEditor
          if (_cnf.showInsertInNote && (hayEditorLlector || hayEditorFisher)) {
            //Poner el boton de 'Insertar en nota'
            var btnNota = document.createElement("div")
            btnNota.className = "menuBtn"
            $(btnNota).text("Insertar en nota")
            btnNota.onclick = function () {
              llector.applyCredits(null, null)
              emptyMenu()
            }
            $(contextualMenu).append(btnNota)
          }

          if (modoLectura) {
            var extra = {
              position: 3,
              tipoItemRela: ti,
              idItemRela: ii,
              idItem2Rela: ii2,
              npagItemRela: npi,
              idNotaRela: ini,
              txtRela: text,
              idProy: 0,
              toBook: true,
            }

            if (isSmartPhone) {
              extra.position = 4
            }

            var esLibroLectura = ii > 0 && ti == 1 && npi > -1
            var esAnotador = ltotalUtils.checkPermiso("anotador")
            var esPersonaje = ltotalUtils.checkPermiso(
              "personaje,personaje_limitado",
            )
            var esAutorLibro = esLibroLectura && ltotalUtils.checkAutorLibro(ii)
            var esPrivadoLibro =
              esLibroLectura && ltotalUtils.checkPrivadoLibro(ii)

            if (ti == 1 && mi == 1 && npi != 2) {
              //Compartir frase
              var btnShare = document.createElement("div")
              btnShare.className = "menuBtn"
              btnShare.id = "myDeleteButton"
              var btnShareTxt = npi == 1 ? "Compartir libro" : "Delete"
              $(btnShare).text(btnShareTxt)
              btnShare.onclick = function () {
                console.log("猴子补丁")
                emptyMenu()
              }
              $(contextualMenu).append(btnShare)
            }

            if (!hayEditorLlector && esLibroLectura) {
              //Nota
              var btnNota = document.createElement("div")
              btnNota.className = "menuBtn"
              // $(btnNota).text("Nota");
              $(btnNota).text("🐵Patch")
              btnNota.onclick = function () {
                if (lectorLogueado) {
                  panelSocial.editNote(17, 0, extra)
                } else {
                  panelSocial.showAlertMiBiblioteca(27)
                }
                emptyMenu()
              }
              $(contextualMenu).append(btnNota)
            }

            //NOTA!!
            //Futuro: este boton podra ser usado por los grupos de edicion
            if (
              esLibroLectura &&
              !hayEditorLlector &&
              (esAnotador || esAutorLibro || esPrivadoLibro)
            ) {
              //Nota de edicion (correccion)
              var btnNota = document.createElement("div")
              btnNota.className = "menuBtn"
              $(btnNota).text("Nota edición")
              btnNota.onclick = function () {
                extra.correccionEdicion = true
                panelSocial.editNote(17, 0, extra)
                emptyMenu()
              }
              $(contextualMenu).append(btnNota)
            }

            if (
              !hayEditorFisher &&
              esPersonaje &&
              ii > 0 &&
              (ti == 1 || ti == 27) &&
              npi > -1
            ) {
              //Pescar
              var btnPescar = document.createElement("div")
              btnPescar.className = "menuBtn"
              $(btnPescar).text("Pescar")
              btnPescar.onclick = function () {
                panelSocial.editNote(15, 0, extra)
                emptyMenu()
              }
              $(contextualMenu).append(btnPescar)
            }

            if (
              esAnotador &&
              ii > 0 &&
              (ti == 1 || ti == 27 || ti == 32) &&
              npi > -1
            ) {
              //Imagen
              var btnImagen = document.createElement("div")
              btnImagen.className = "menuBtn"
              $(btnImagen).text("Subir Imagen")
              btnImagen.onclick = function () {
                edicion.imagenes.showLoad(0)
                emptyMenu()
              }
              $(contextualMenu).append(btnImagen)
            }

            if ((esAnotador || isLectorAutorLibro) && ti == 1 && ii > 0) {
              //Comentario
              var btnComentario = document.createElement("div")
              btnComentario.className = "menuBtn"
              $(btnComentario).text("Subir Comentario")
              btnComentario.onclick = function () {
                edicion.comentarios.showLoad(0)
                emptyMenu()
              }
              $(contextualMenu).append(btnComentario)
            }

            /*
                    //NOTA!! Se desactivan temporalmente los "Proyectos Tematicos"
                    //Mientras se define su futuro
                    if (lectorLogueado && lectorLogueado.proyectosTematicos > 0 && ti == 1) {
                        //Proyectos de investigacion tematicos (Tipo 1)
                        var btnProysTemas = document.createElement("div");
                        btnProysTemas.className = "menuBtn";
                        $(btnProysTemas).text("Investigación temática");
                        btnProysTemas.onclick = function() {
                            llector.grupos.dialogProyectsTematicos();
                            emptyMenu();
                        }
                        $(contextualMenu).append(btnProysTemas);
                    }
                    */
          }

          _cnf.txtRela = text
        }
        //FIN. Botones del menu

        that.placeContextualMenu(_container)

        $(_container).trigger("panelSocial.showContextualMenu", _cnf)
      }
    }

    this.closeContextualMenu = function () {
      $(contextualMenu).css({ width: "auto" })
      $(contextualMenu).detach()
      $(contextualMenu).empty()
    }

    this.showAlertMiBiblioteca = function (_tipoItem) {
      var st = {
        18: "Mi historial",
        27: "Mis notas",
        44: "Mis favoritos",
        48: "Mis marcadores",
      }

      $(".boxAlert", alertLM.getContain()).css({
        left: "25%",
        width: "50%",
        top: "15%",
        height: "70%",
        "max-height": "inherit",
        margin: "unset",
        "border-radius": "15px",
        padding: "unset",
      })
      $(".boxTxtAlert", alertLM.getContain()).css({
        top: "10%",
        height: "80%",
      })
      $(".boxButtons", alertLM.getContain()).css({
        position: "absolute",
        top: "15px",
        left: "0%",
        height: "24px",
        "margin-top": "unset",
        "border-top": "unset",
      })
      $(".btnCloseAlert", alertLM.getContain())
        .css({
          position: "absolute",
          top: "0px",
          width: "24px",
          left: "unset",
          height: "100%",
          right: "10px",
          margin: "unset",
          bottom: "unset",
          "background-image":
            "url(/estaticosED/files/img/book_icons/black/close.png)",
          "background-size": "80%",
          "background-position": "center",
          "background-repeat": "no-repeat",
        })
        .html("")

      if (isTouch) {
        $(".boxAlert", alertLM.getContain()).css({
          top: "0%",
          left: "0%",
          width: "100%",
          height: "100%",
          "border-radius": "0px",
        })
        $(".boxTxtAlert", alertLM.getContain()).css({
          top: "15%",
          left: "5%",
          width: "90%",
          height: "85%",
          margin: "unset   ",
        })
      }

      alertLM.show(
        bodyDiv,
        '<div class="boxAlrtMiBib">Para utilizar el servicio de <span style="color: #0873F5;">' +
          st[_tipoItem] +
          ",</span> debe crear una cuenta gratis como lector. Si ya la tiene, por favor inicie sesión.</div><div onclick=\"$('.btnCloseAlert', alertLM.getContain()).trigger('click'); panelSocial.mosaico.btnLoginClick();\" class=\"miBibliIniSesion\">Iniciar sesión</div> <div onclick=\"$('.btnCloseAlert', alertLM.getContain()).trigger('click'); panelSocial.mosaico.btnRegisterClick();\" class=\"miBibliRegister\">Crear cuenta</div>",
      )
    }

    this.placeContextualMenu = function (_container) {
      var s = rangy.getSelection()
      var rectRange = s.getRangeAt(0).nativeRange.getBoundingClientRect()
      var rectCont = _container.getBoundingClientRect()

      var btnColors = [
        "#5483CE",
        "#D75F53",
        "#38C06E",
        "#BD8C50",
        "#9873B8",
        "#74CECB",
      ]
      var icol = 0

      var ww = 0
      $(contextualMenu)
        .children()
        .each(function () {
          var nc = $(this).text().length
          var px = nc < 8 ? 12 : 8
          var wx = nc * px
          $(this).css({ width: wx + "px" })

          ww +=
            wx +
            parseInt($(this).css("margin-left")) +
            parseInt($(this).css("padding-left")) * 2

          var triangle = $('<div class="triangle_up"></div>')
          $(this).append(triangle)
          triangle.css({ "border-bottom": "5px solid " + btnColors[icol] })
          $(this).css({ "background-color": btnColors[icol] })
          icol++
          if (icol == btnColors.length) {
            icol = 0
          }
        })
      ww += 10
      $(contextualMenu).css({ width: ww + "px" })

      var left = rectRange.left - rectCont.left - ww / 2 + rectRange.width / 2
      var top = rectRange.top - rectCont.top + rectRange.height + 2

      //Corrige salida por izquierda
      if (left < 0) {
        left = 0
      }

      //Corrige salida por derecha
      var rPoint = left + ww
      if (rPoint > rectCont.width) {
        left = rectCont.width - ww - 10
      }

      $(contextualMenu).css({ left: left + "px", top: top + "px" })

      if (ww > _container.offsetWidth) {
        var btns = $(contextualMenu).children()

        $(contextualMenu).css({ width: "100%", left: "0px" })

        var btns_wrapper = $('<div class="btns_wrapper"></div>')
        $(contextualMenu).append(btns_wrapper)

        btns_wrapper.append(btns)
        btns_wrapper.css({
          position: "relative",
          width: ww + "px",
          height: "100%",
        })

        if (!contextualMenu.touchBinded) {
          contextualMenu.touchBinded = true
          var bindTouchHandleHorizontal = function (_objScroll) {
            return {
              move: function (dX, dY, ev) {
                ev.stopPropagation()
                _objScroll.scrollLeft += dX
              },
            }
          }
          bindTouch(contextualMenu, bindTouchHandleHorizontal(contextualMenu))
        }
      }
    }

    this.getContain = function () {
      return this.mainFrame
    }

    //Abrir reproductor de music
    function openMusic(musicItem, _extra) {
      var dataMusic = null
      var setRutas = false

      if (typeof musicItem == "object") {
        var label = musicItem.lbl

        var idsMusic = []
        buscaIDS(label.items, 10, idsMusic)

        //Reproduce item de musica actual
        var music_single = $(".music_single", musicItem)[0]
        var ruta = $(music_single).attr("ruta")

        //ReplaceList temporal app nativa para evitar error mientras carga dataMusic
        var author = $(musicItem)
          .attr("label_autor")
          .replace(/("|'){1,}/g, "")
        var title = $(".dvd_text", musicItem)
          .text()
          .replace(/("|'){1,}/g, "")
        dataMusic = [{ Author: author, Title: title }]

        setRutas = true
      }

      if (typeof musicItem == "string") {
        var ruta = musicItem
        var idMusica = ruta.match(/\d+\.mp3/)[0].match(/\d+/)[0]
        var idsMusic = [idMusica]
        musicItem = null

        dataMusic = [{ Author: "...", Title: "..." }]
        setRutas = true
      }

      initPanelMusic()

      var rutaR = ruta.replace("|HLS", "")
      if (rutaR == panelMusic.getRutaAudio()) {
        if (panelMusic.isPlayingMusic()) {
          panelMusic.stopAudio()
        } else {
          panelMusic.startAudio()
        }
      } else {
        panelMusic.resetIdx()

        panelMusic.idRecRelaSkip = null
        if (_extra && _extra.idRecRelaSkip) {
          panelMusic.idRecRelaSkip = _extra.idRecRelaSkip
        }

        panelMusic.shouldShowInfoMusic = true
        panelMusic.playAudio(ruta, musicItem)
        if (setRutas) {
          //ReplaceList temporal app nativa para evitar error mientras carga dataMusic
          panelMusic.setAudios([ruta], { dataMusic: dataMusic })
        }

        //Incluye musica en lo visto recientemente
        if (lectorLogueado) {
          var idMusic = panelMusic.getIdAudio(ruta)
          mosaico.saveBitacora(10, -1, -1, -1, idMusic, "", null)
        }

        if (setRutas) {
          that.setRutasMusic(ruta, idsMusic)
        }
      }

      panelMusic.isPlayingEwallMusic = false
    }

    this.openMusic = function (musicItem, _extra) {
      openMusic(musicItem, _extra)
    }

    this.setRutasMusic = function (ruta, idsMusic) {
      idsMusic = $.trim(idsMusic)
      if (idsMusic.length == 0) {
        return null
      }

      //Consulta rutas de lista de ids de musica
      ltotalOS
        .loadData("musica", "rutas", idsMusic, { hls: true })
        .done(function (htmlData) {
          var p = $("#proceso").html(htmlData)
          var rutas = $("#txt_rutas", p).val().split(",")
          var dataMusic = JSON.parse($("#dataMusic", p).val())

          var idx = 0

          //Calcula numero de pista (idx)
          for (var i = 0; i < rutas.length; i++) {
            if (ruta == rutas[i]) {
              idx = i
              break
            }
          }

          panelMusic.setAudios(rutas, { dataMusic: dataMusic })
          panelMusic.setIdx(idx)
        })
    }

    this.stopMusic = function () {
      panelMusic.stopAudio()
    }

    this.openMusicByID = function (idMusic, _extra) {
      ltotalOS
        .loadData("musica", "rutas", idMusic, "")
        .done(function (htmlData) {
          var p = $("#proceso").html(htmlData)
          var ruta = $("#txt_rutas", p).val().split(",")[0]
          var isCollection = $("#isCollection", p).val() == "true"

          if (isCollection) {
            var item = document.createElement("div")
            item.className = "cell 10_" + idMusic + " cvLD"
            item.style.display = "inline-block"

            var sb = panelSocial.selectedBook
            if (sb) {
              sb.cerrar()
            }

            panelSocial
              .clickSobreItem(item, "musica", panelSocial.mosaico)
              .done(function () {
                setTimeout(function () {
                  $(".cell.cvLD").eq(0).trigger("click")
                  if (_extra && _extra.stopMusic) {
                    panelSocial.stopMusic()
                  }
                }, 1000)
              })
          } else {
            panelSocial.openMusic(ruta)
            if (_extra && _extra.stopMusic) {
              panelSocial.stopMusic()
            }
          }
        })
    }

    this.decodeMosaicLink = function (link) {
      var lObj = {
        tipoItem: -1,
        idItem: -1,
        dataLink: [],
        extraClass: "",
        tipoPatron: 0,
      }

      var ptrnNN = link.match(/^\w+(_-?\w+)+$/)
      if (ptrnNN) {
        lObj.dataLink = link.split("_")
        lObj.tipoItem = lObj.dataLink[0]
        lObj.idItem = lObj.dataLink[1]
        lObj.tipoPatron = 1
      }

      var ptrnComplex = link.split("__")
      if (ptrnComplex.length > 1) {
        lObj.extraClass = link.replace(/__/g, " ")

        lObj.dataLink = lObj.extraClass.match(/^\d+_-?\d+/)[0].split("_")
        lObj.tipoItem = lObj.dataLink[0]
        lObj.idItem = lObj.dataLink[1]

        lObj.extraClass =
          $.trim(lObj.extraClass.replace(/^\d+_-?\d+/, "")) +
          " x_extralabels_1 x_startvisible_1"

        lObj.tipoPatron = 2
      }

      return lObj
    }

    this.openMosaicLink = function (link, _extra) {
      var mosa = panelSocial.mosaico
      if (_extra && _extra.mosaic) {
        mosa = _extra.mosaic
      }

      var linkObj = panelSocial.decodeMosaicLink(link)

      var tipoItem = linkObj.tipoItem
      var idItem = linkObj.idItem
      var extraClass = linkObj.extraClass
      var dataLink = linkObj.dataLink
      var tipoPatron = linkObj.tipoPatron
      var extraParams = {}

      if (tipoPatron == 2) {
        extraParams.noBanner = true
      }

      if (_extra) {
        if (_extra.noBanner) {
          extraParams.noBanner = true
        }

        if (_extra.backNavig == false) {
          extraParams.backNavig = false
        }

        if (_extra.doCache == false) {
          extraParams.doCache = false
        }
      }

      if (tipoItem == -1) {
        consola("No se puede procesar la direccion: " + link)
        return null
      }

      if (tipoItem == 1) {
        var item = document.createElement("div")
        item.className = "cell 1_" + idItem + " " + extraClass

        if (tipoPatron == 1 && dataLink.length > 3) {
          item.className = "cell 4_" + idItem + "," + dataLink[2] + " openbook"
          extraParams.numePagina = dataLink[3]
        }

        panelSocial.clickSobreItem(item, "libros", mosa, extraParams)
      }
      if (tipoItem == 3) {
        idItem = link.replace(/^3_/, "").replace(/_/g, ",")

        if (extraClass.length == 0) {
          extraClass = "x_extralabels_1"
        }

        var item = document.createElement("div")
        item.className = "cell 3_" + idItem + " " + extraClass
        panelSocial.clickSobreItem(item, "libros", mosa, extraParams)
      }
      if (tipoItem == 4) {
        var coord1 = dataLink.slice(4, 7).join(",")
        var coord2 = dataLink.slice(7, 10).join(",")

        extraParams.numePagina = parseInt(dataLink[3])
        extraParams.txtCoord = coord1 + "_" + coord2

        panelSocial.openBook(1, idItem, dataLink[2], extraParams)
      }
      if (tipoItem == 6) {
        panelSocial.processIdsImages([idItem], idItem)
      }
      if (tipoItem == 8) {
        idItem = link.replace(/^8_/, "").replace("_", ",")
        var item = document.createElement("div")
        item.className = "cell 8_" + idItem + " " + extraClass
        panelSocial.clickSobreItem(item, "libros", mosa, extraParams)
      }
      if (tipoItem == 10) {
        panelSocial.openMusicByID(idItem)
      }
      if (tipoItem == 14) {
        var item = document.createElement("div")
        item.className = "cell 14_" + idItem + " " + extraClass
        panelSocial.clickSobreItem(item, "libros", mosa, extraParams)
      }
      if (tipoItem == 15) {
        panelSocial.openBookPersoByIDRec(idItem)
      }
      if (tipoItem == 16) {
        if (idItem == 0) {
          var item = document.createElement("div")
          item.className = "cell diccionarios_0 x_extralabels_1"
          panelSocial.clickSobreItem(item, "libros", mosa, extraParams)
        }
        if (idItem > 0) {
          panelSocial.openDiccTotal(null, null, {
            idWord: idItem,
            casoRela: 1,
            openInTab: true,
          })
        }
      }
      if (tipoItem == 23) {
        var item = document.createElement("div")
        item.className = "cell 23_" + idItem + " " + extraClass
        panelSocial.clickSobreItem(item, "libros", mosa, extraParams)
      }
      if (tipoItem == 24) {
        var item = document.createElement("div")
        item.className = "cell 24_" + idItem + " " + extraClass
        panelSocial.clickSobreItem(item, "libros", mosa, extraParams)
      }
      if (tipoItem == 32) {
        panelSocial.openBookNotas(32, idItem)
      }
      if (tipoItem == 38) {
        var item = document.createElement("div")
        item.className = "cell 38_" + idItem + " " + extraClass
        panelSocial.clickSobreItem(item, "libros", mosa, extraParams)
      }
      if (tipoItem == 47) {
        idItem = link.replace(/^47_/, "").replace(/_/g, ",")
        var item = document.createElement("div")
        item.className = "cell 47_" + idItem + " " + extraClass
        panelSocial.clickSobreItem(item, "libros", mosa, extraParams)
      }
      if (tipoItem == 50) {
        var item = document.createElement("div")
        item.className = "cell 50_" + idItem + " " + extraClass
        panelSocial.clickSobreItem(item, "libros", mosa, extraParams)
      }
      if (tipoItem == 51) {
        var item = document.createElement("div")
        item.className = "cell 51_" + idItem + " " + extraClass
        panelSocial.clickSobreItem(item, "libros", mosa, extraParams)
      }
      if (tipoItem == "scrns") {
        panelSocial.screenSaverPrevStep(idItem)
      }
      /*
        if (tipoItem == 'foto') {
            var item = document.createElement('div');
            item.className = 'cell 6_0,2 cvLD';
            panelSocial.clickSobreItem(item, 'libros', mosa, {"extra_labels":1, "noBanner":true, "fotografia":1, "queryArt":1});
        }
        */
    }

    this.showBookRelatedContent = function (idLibro) {
      var url = "/ltotal/inicio/utils/ut_50.jsp"
      panelSocial.doPost(url, { idLibro: idLibro }).done(function (_d) {
        var proc = $("#proceso").html(_d)
        var relatedItems = proc.children()

        var modal = that.openModalTxtViewer(relatedItems, {})
        var toolsTop = $(".toolsTop", modal.getContain())
        toolsTop
          .prepend(
            '</div><div class="title_container">Contenidos relacionados</div>',
          )
          .css({ "margin-top": "14px" })

        var cont = modal.getContain()
        var $cont = $(cont)
        $cont.addClass("book_html_related_content")
        $cont.css({ "background-color": "#0B1C2B" })

        if (isTouch) {
          $cont.css({ height: "100%", width: "100%", top: 0, left: 0 })
        } else {
          $cont.css({
            width: "80%",
            left: "10%",
            height: "70%",
            top: "15%",
            "border-radius": "15px",
          })
        }

        var floatContent = $(".contentHtml", cont)
        floatContent.css({
          width: "90%",
          "margin-left": "5%",
          "margin-top": "2px",
        })
        if (isTouch) {
          floatContent.css({
            width: "100%",
            "margin-left": 0,
            height: "94%",
            "margin-top": "30px",
          })
        }

        var floatClose = $(".closeModalViewer", cont)
        floatClose.css({ right: "10px", "background-position": "-110px 0" })
        $(".boxScroll", cont).remove()

        relatedItems.each(function () {
          this.onclick = function () {
            var itemData = this.className.split(/\s+/)[1].split(/_/)
            var item = document.createElement("div")
            item.className =
              "cell " +
              itemData[1] +
              "_" +
              itemData[2] +
              " cvLD x_" +
              itemData[5] +
              "_1"

            var labels = { extra_labels: 1, noBanner: true, startvisible: 1 }
            labels[itemData[5]] = 1
            panelSocial.clickSobreItem(
              item,
              "libros",
              panelSocial.mosaico,
              labels,
            )
            modal.cerrar()
          }
        })
      })
    }

    this.openModalTxtViewer = function (_html, _setts) {
      var modalConfig = {
        hostDiv: bodyDiv,
        widthV: "30%",
        heightV: "auto",
        bgColor: "rgb(245, 239, 220)",
        scrollSyc: true,
        claseScroll: "scrollModalNotas",
        clickClose: function () {
          if (that.isContainMusicInFloatTextViewer()) {
            if (panelMusic.inBigEwall) {
              panelMusic.cerrarInBigEwall()
              return null
            }

            panelMusic.resetearAudio()
          }

          floatTextViewer = null

          if (_setts && _setts.fnAfterClose) {
            _setts.fnAfterClose()
          }
        },
      }

      $.extend(modalConfig, _setts)

      if (floatTextViewer) {
        floatTextViewer.destroy()
      }

      floatTextViewer = new ModalViewerLT(modalConfig)

      floatTextViewer.addContent(_html)

      if (isSmartPhone) {
        $(floatTextViewer.getContain()).css({
          width: "100%",
          left: "0",
          top: "0",
          right: "",
          height: "100%",
          "border-radius": "0",
          border: "none",
        })
      }

      return floatTextViewer
    }

    function initPanelMusic() {
      if (!panelMusic) {
        panelMusic = new PanelMusic({
          hostDiv: panelSocial.bodyDiv,
          appendMode: "append",
          musicaElement: elementoAudio,
          loadedMusic: function (_idMusic) {
            //Estadistica de musica en interfaz eDesk
            ltotalOS.statistics(87, _idMusic)
          },
          minimizarModalViewer: function () {
            if (floatTextViewer) {
              that.closeMasInfoItem()
            }
          },
        })
      }
    }

    this.getPanelMusic = function () {
      initPanelMusic()
      return panelMusic
    }

    this.openBookPersoByIDRec = function (_idRec) {
      var url = "/ltotal/inicio/utils/ut_48.jsp"
      var params = { caso: "2", id_nota: _idRec }

      return panelSocial.doPost(url, params).done(function (_d) {
        var proc = $("#proceso").html(_d)
        var id_proy = parseInt($(".hdn_id_perso", proc).val())

        panelSocial
          .getSeccionLibroByIDNota(32, id_proy, _idRec)
          .then(function (_nsec) {
            panelSocial.openBook(32, id_proy, -1, { numeSeccion: _nsec })
          })
      })
    }

    function openBookNotas(_tipoLibro, _id_item) {
      llector.loadColors()
      if (lectorLogueado) {
        var s = ""
        if (_tipoLibro == 17) {
          s = "notas"
        }
        if (_tipoLibro == 27) {
          s = "proyectos"
        }
        if (_tipoLibro == 32) {
          s = "personajes"
        }

        var extraParams = SycCredentials

        ltotalOS
          .loadData(s, "lec_bitac", _id_item, extraParams)
          .done(function (_d) {
            _d = $.trim(_d)
            if (_d.length > 0) {
              var proc = $("#proceso").html(_d)
              _d = $(".lec_bitac", proc).val().split(",")

              var idNote = _d[0]
              var npag = _d[1]
              var fecha = _d[2]
              var numePagePercent = _d[3]

              if (_tipoLibro == 17) {
                var extra = {
                  numeSeccion: 1,
                  fechaVisto: fecha,
                  numePaginaSeccion: npag,
                  numePaginaPercent: numePagePercent,
                }
                that.openBook(17, _id_item, -1, extra)
              } else {
                that
                  .getSeccionLibroByIDNota(_tipoLibro, _id_item, idNote)
                  .then(function (_nsec) {
                    var extra = {
                      numeSeccion: _nsec,
                      fechaVisto: fecha,
                    }

                    if (_tipoLibro == 27 || _tipoLibro == 32) {
                      extra.numePaginaSeccion = npag
                      extra.numePaginaPercent = numePagePercent
                    }

                    that.openBook(_tipoLibro, _id_item, -1, extra)
                  })
              }
            } else {
              that.openBook(_tipoLibro, _id_item, -1)
            }
          })
      } else {
        that.openBook(_tipoLibro, _id_item, -1)
      }
    }

    this.openBookNotas = function (_tipoLibro, _id_item) {
      openBookNotas(_tipoLibro, _id_item)
    }

    this.getSeccionLibroByIDNota = function (_tipoLibro, _idLibro, _idNote) {
      var extraParams = {
        tipoLibro: _tipoLibro,
        modoLibro: 0,
      }

      jQuery.extend(extraParams, SycCredentials)

      //Consulta del indice del libro

      var classNote = ""
      if (_tipoLibro == 27) {
        classNote = ".id_nota_" + _idNote
      }
      if (_tipoLibro == 32) {
        classNote = ".id_rec_" + _idNote
      }

      return ltotalOS
        .loadData("libros", "paginas", _idLibro + "," + -1, extraParams)
        .then(function (_d) {
          //Obtiene el numero de seccion
          var numSecc = -1
          var items = $.parseHTML(_d)[0]
          var item = $(classNote, items)[0]
          if (item) {
            numSecc = item.className.match(/nsec_\d+/)[0].split("_")[1]
          }

          return numSecc
        })
    }

    this.init = function (opts) {}

    this.setBackgroundColor = function (color) {}

    this.stopAudio = function () {
      if ($(playerMusic).hasClass("pauseBtn")) {
        panelMusic.stopAudio()
      } else {
        panelMusic.startAudio()
      }
    }

    this.ewallMusic = function (_callerID) {
      initPanelMusic()

      var goAndPlay = function () {
        panelMusic.resetIdx()
        panelMusic.shouldShowInfoMusic = false
        panelMusic.playAudio(audiosEwall[0])
        panelMusic.setAudios(audiosEwall, { dataMusic: dataMusicEwall })
        panelMusic.isPlayingEwallMusic = true
      }

      var checkAndGo = function () {
        if (!executeNative) {
          //Activa el audio con un silencio (iOS)
          elementoAudio.pause()
          elementoAudio.src = "/testLtotal/recursos/silence1sg.mp3"
          elementoAudio.play()
        }

        ltotalUtils.initEwallAudios().done(goAndPlay)
      }

      if (!panelMusic.getContain().parentNode) {
        panelMusic.minimizedMode()
        panelMusic.placeContainer()
      }

      if (_callerID == "MiniIconMusic" || _callerID == "MosaicBooks") {
        if (panelMusic.isPlayingEwallMusic) {
          if (panelMusic.isPlayingMusic()) {
            panelMusic.stopAudio()
          } else {
            panelMusic.startAudio()
          }
        } else {
          checkAndGo()
        }
      }

      if (_callerID == "ScreenSaver") {
        if (!panelMusic.isPlayingMusic()) {
          checkAndGo()
        }
      }
    }

    this.screenSaver = function (_opts) {
      var withMusic = false
      var extraParams = ""

      if (_opts) {
        if (_opts.withMusic) {
          withMusic = true
        }
        if (_opts.withFoto) {
          extraParams += "&artMode=NatureArt"
        }
        if (_opts.withArt) {
          extraParams += "&artMode=PureArt"
        }
        if (_opts.combinedArt) {
          extraParams += "&artMode=CombinedArt"
        }
        if (_opts.withFrases) {
          extraParams += "&withFrases=1"
        }
        if (_opts.autorArt) {
          extraParams += "&artMode=AutorArt&idAutorArt=" + _opts.idAutorArt
        }
        if (_opts.bookArtText) {
          extraParams +=
            "&artMode=BookArtText&tipoBookArtText=" +
            _opts.tipoBookArtText +
            "&idBookArtText=" +
            _opts.idBookArtText
        }
        if (_opts.arteAnotado) {
          extraParams += "&artMode=ArteAnotado"
        }
        if (_opts.idListaExpo) {
          extraParams += "&id_lista=" + _opts.idListaExpo
        }
      }

      var iframeURL =
        "/ltotal/big_ewall/index.html?p=1&calcAspectRatio=1" + extraParams

      panelSocial.createIFRAME({
        hostDiv: bodyDiv,
        id: "iframeArte",
        url: iframeURL,
        close: function () {
          panelSocial.cancelFullscreen()

          if (withMusic && panelMusic) {
            //Reversa los cambios hechos al contenedor de musica en el show big_ewall
            var musCont = $(panelMusic.getContain())
            musCont.css({ display: "" })
            musCont.css({ "z-index": "" })

            panelMusic.inBigEwall = false
            panelMusic.cerrar()
          }
        },
      })

      if (withMusic) {
        panelSocial.ewallMusic("ScreenSaver")
      }

      panelSocial.setNativeMainViewBGColor(0, 0, 0)
    }

    this.screenSaverPrevStep = function (_idItem) {
      var html =
        '\
            <p style="margin-top:30px; text-align:center;">Contrainteligencia artificial</p>\
            <p style="margin-top:30px;">El azar es el enemigo de la inteligencia artificial, ahora en la biblioteca del libro total ponemos a disposición de los lectores una nueva oferta de Contrainteligencia Artificial, una mezcla irrepetible de música, fotografía, arte y frases célebres.</p>\
            <div class="btn_play" style="margin:30px auto 0 auto; width:100%; height:46px; border-radius:23px; text-align:center; line-height:46px; color:white; background-color:#0873F5;">Reproducir</div>\
            '

      var veil = document.createElement("div")
      $(veil).css({
        position: "absolute",
        width: "100%",
        height: "100%",
        top: 0,
        left: 0,
        "background-color": "rgba(0, 0, 0, 0.7)",
      })
      $(bodyDiv).append(veil)

      var sets = {
        scrollSyc: false,
        fnAfterClose: function () {
          $(veil).remove()
        },
      }

      var modal = panelSocial.openModalTxtViewer(html, sets)
      var cont = modal.getContain()
      var $cont = $(cont)
      var $content = $(".contentHtml", cont)

      $cont.css({ "background-color": "white" })
      $content.css({ cursor: "pointer" })

      if (!isSmartPhone) {
        var lft = ($(window).width() - 400) / 2
        var top = ($(window).height() - 500) / 2
        $cont.css({
          width: "400px",
          height: "500px",
          left: lft + "px",
          top: top + "px",
        })
      }

      $content[0].onclick = function () {
        var item = document.createElement("div")
        item.className = "cell screensaver_" + _idItem
        panelSocial.clickSobreItem(item, "libros", panelSocial.mosaico, {})

        modal.cerrar()
        $(veil).remove()
      }
    }

    this.show = function () {
      mosaico.show()
    }

    this.hide = function () {
      mosaico.hide()
    }

    this.getIDCliente = function () {
      return idCliente
    }

    this.executeNative = function (_cmdObj) {
      try {
        return ltotalUtils.executeNative(_cmdObj)
      } catch (e) {
        return false
      }
    }

    this.nativeMessage = function (_msg) {
      //Aqui van los objetos que necesitan los mensajes nativos
      if (panelMusic) {
        panelMusic.nativeMessage(_msg)
      }

      if (typeof globito !== "undefined") {
        globito.nativeMessage(_msg)
      }

      var modulo = _msg.Module
      var action = _msg.Action

      if (modulo == "KeyChain" && action == "Retrieve") {
        var correo = _msg.UserName
        var clave = _msg.Password
        isLogged(correo, clave)
      }

      if (modulo == "App" && action == "Orientation") {
        var rs = _msg.ResultString.toLowerCase()
        if (
          (rs.indexOf("portrait") > -1 || rs.indexOf("landscape") > -1) &&
          rs != orientationNative
        ) {
          orientationNative = rs
          setTimeout(panelSocial.mosaico.rePaint, 300)
        }
      }

      if (modulo == "App" && action == "AndroidBack") {
        if (!panelSocial.mosaico.getBackNavigation()) {
          panelSocial.moveTaskToBackApp()
        }
      }

      if (modulo == "Connectivity") {
        if (action == "OnCurrentConnectivityChanged") {
          ltotalOS.isConnected =
            _msg.IsConnected.toLowerCase() == "true" ? true : false
        }
      }

      if (modulo == "OfflineApp" && action == "RepaintFluid") {
        panelSocial.mosaico.repaintFluid()
      }

      if (modulo == "Consola") {
        consola(action)
      }
    }

    this.capabilitiesCallback = function (_msg) {
      this.nativeCapabilitiesTxt = _msg
    }

    this.shareCallback = function (_msg) {}

    this.moveTaskToBackApp = function () {
      if (executeNative) {
        var cmdObj = { Module: "App", Action: "MoveTaskToBackApp" }
        var cmdNat = that.executeNative(cmdObj)
      }
    }

    this.showDownloads = function () {
      //var cmdObj = { 'Module': 'OfflineApp', 'Action': 'ShowDownloads' };
      //that.executeNative(cmdObj);

      panelSocial.mosaico.downloadsMosaic()
    }

    this.downloadedEpubCallback = function (_msg) {
      mosaicBanner.paintOfflineBook(parseInt(JSON.parse(_msg).status))
    }

    this.isThisADownloadedBook = function (_idTrad) {
      if (executeNative) {
        var cmdObj = {
          Module: "OfflineApp",
          Action: "FindEpub",
          Parameters: ["" + _idTrad],
          Callback: "panelSocial.downloadedEpubCallback",
        }
        var cmdNat = panelSocial.executeNative(cmdObj)
      }
    }

    this.hasOfflineBooks = function () {
      return (
        executeNative &&
        panelSocial.nativeCapabilitiesTxt.indexOf("OfflineApp") > -1
      )
    }

    this.offLineAppContentRelated = function (_msg) {
      var msgObj = JSON.parse(_msg)

      panelSocial.mosaico.resetCache()
      panelSocial.mosaico.resetBackNavigation()

      if (msgObj.related_type == "book") {
        panelSocial.openMosaicLink(msgObj.id_item, {
          noBanner: true,
          backNavig: false,
          doCache: false,
        })
      }

      if (msgObj.related_type == "search") {
        panelSocial.mosaico.buscarLT(msgObj.id_item, { backNavig: false })
      }
    }

    this.offLineAppDictionary = function (_msg) {
      var msgObj = JSON.parse(_msg)
      panelSocial.openDiccTotal(msgObj.word, null, {
        openInTab: true,
        fromOffLineApp: true,
      })
    }

    this.getLaunchCounter = function () {
      if (executeNative) {
        var cmdObj = {
          Module: "App",
          Action: "GetLaunchCounter",
          Callback: "panelSocial.getLaunchCounterCallback",
        }
        var cmdNat = that.executeNative(cmdObj)
      }
    }

    this.getLaunchCounterCallback = function (_msg) {
      var cb = JSON.parse(_msg)
      var lCounter = parseInt(cb.launchCounter)
      if (lCounter == 1) {
        panelSocial.mosaico.showAyuda()
      }

      if (lCounter == 4) {
        panelSocial.mosaico.showRatingApp()
      }
    }

    this.destroyShareModal = function () {
      if (shareGiftAdmObject && shareGiftAdmObject.getModalViewer()) {
        shareGiftAdmObject.getModalViewer().destroy()
        shareGiftAdmObject = null
      }
    }

    this.clearAudioData = function (_boxComponent) {
      if ($(_boxComponent).hasClass("boxViewerTXT")) {
        $(_boxComponent)[0].that.clearAudioData()
      }
    }

    //Deteccion de la seleccion de texto
    this.checkSelection = function (_ev) {
      var sel = rangy.getSelection()
      var nodo = sel.focusNode

      if (nodo && $(nodo.parentNode).hasClass("menuBtn")) {
        //Para que se puede ejecutar la funcion del boton
        return null
      }

      var container = $(nodo).parents(".selecTXT")[0]
      if (container) {
        container.selecTXTFunc(_ev)
      } else {
        setTimeout(panelSocial.closeContextualMenu, 200)
      }
    }

    this.setNativeMainViewBGColor = function (r, g, b) {
      if (
        executeNative &&
        panelSocial.nativeCapabilitiesTxt.indexOf("SetMainViewBGColor") > -1
      ) {
        var cmdObj = {
          Module: "App",
          Action: "SetMainViewBGColor",
          Parameters: [r + "", g + "", b + ""],
        }
        var cmdNat = panelSocial.executeNative(cmdObj)
      }
    }

    this.saveNativeCredentials = function (correo, clave) {
      if (executeNativeCredentials) {
        correo = correo.toLowerCase()
        clave = clave.replace(/"/g, '\\"')
        var cmdObj = {
          Module: "KeyChain",
          Action: "Update",
          Parameters: ["", correo, clave],
        }
        var cmdNat = panelSocial.executeNative(cmdObj)
      }
    }

    this.getNativeCredentials = function () {
      if (executeNativeCredentials) {
        var cmdObj = { Module: "KeyChain", Action: "Retrieve" }
        var cmdNat = that.executeNative(cmdObj)
      }
    }

    this.deleteNativeCredentials = function () {
      if (executeNativeCredentials) {
        var cmdObj = { Module: "KeyChain", Action: "Delete" }
        var cmdNat = that.executeNative(cmdObj)
      }
    }

    this.getNativeOrientation = function () {
      return orientationNative
    }

    var isLogged = function (correo, clave) {
      var moreParams = {}
      if (correo && clave) {
        moreParams.correo = encodeURIComponent(correo)
        moreParams.clave = encodeURIComponent(clave)
      }

      SycCredentials = {
        ku: $("#Valor2").val(),
        ki: $("#Valor1").val(),
        kp: $("#Valor3").val(),
      }

      var loginParams = jQuery.extend(moreParams, SycCredentials)
      ltotalOS.isLogged(loginParams).done(function (_lec) {
        if (_lec) {
          lectorLogueado = _lec

          that.textZoomVal = ltotalOS.getPreferenciaLector("textZoomVal", 1)
          that.textColor = ltotalOS.getPreferenciaLector("textColor", "clear")
          that.tipoLetra = ltotalOS.getPreferenciaLector("tipoLetra", 1)
          that.mosaicSize = ltotalOS.getPreferenciaLector("mosaicSize", 0)

          //Restablece tamano de texto
          if (that.textZoomVal != 1) {
            var zoomOff = parseFloat((that.textZoomVal - 1).toFixed(1))
            that.textZoomVal = 1
            setTimeout(function () {
              that.zoomText(zoomOff, false)
            }, 300)
          }
        } else {
          //Inicia el zoom y el alto de linea
          setTimeout(function () {
            that.zoomText(-0.1, false)
            that.zoomText(0.1, false)
          }, 300)
        }
        loginReady = true
      })
    }

    //Detecta capacidades nativas
    if (executeNative) {
      var cmdObj = {
        Module: "App",
        Action: "Capabilities",
        Callback: "panelSocial.capabilitiesCallback",
      }
      var cmdNat = that.executeNative(cmdObj)
    }

    var ev = isTouch ? "selectionchange" : "mouseup"
    document.addEventListener(ev, that.checkSelection, false)
  }

  function MosaicBooks(opts) {
    //'use strict';
    var pilarSelected,
      txtPilarArte,
      txtPilarMusica,
      txtPilarLibros,
      pilarSearch,
      pilarArte,
      pilarMusica,
      pilarLibros,
      iconSearch,
      iconSearchClose,
      searchLT,
      boxSearchMsg,
      boxSearchMos,
      boxSearchClean,
      buttonSearch,
      servicio,
      boxBottomFooter,
      boxTopHeader,
      boxBread,
      boxPilars,
      boxLogo,
      boxTabs,
      gridBoxSmall,
      userMosaic,
      closeMosaic,
      backMosaic,
      gridBox,
      boxMosaic,
      boxMosaicFull,
      proceso,
      boxHoverLabelMosaic,
      btnHoverEraseBitac,
      btnHoverEraseFavorite,
      btnHoverEraseFotoPromoLibro,
      btnHoverEraseRegaloLibro,
      boxMenu,
      categsMenuBox,
      boxBtnRegister,
      boxBtnLogin,
      boxBtnMyAccount,
      boxBtnConfig,
      boxBtnContacto,
      boxBtnCrearNota,
      boxBtnMisNotas,
      boxBtnFavoritos,
      boxBtnHistorial,
      boxBtnAyuda,
      boxBtnFreqQuestions,
      boxBtnDescargas,
      footerBtnHome,
      footerBtnDescargas,
      footerBtnGuia,
      footerBtnBiblio,
      bodyDiv = panelSocial.bodyDiv,
      mosaico = this,
      that = this,
      settings = $.extend({}, opts)

    var timerDestroyHoverLabel,
      timerTouchingItem,
      isTouchingItem = false
    var timerAnimBanner = null
    var itemsToLoad = []
    var labelJustClicked = false

    var isSmartPhone = ltotalOS.isSmartPhone
    var isTablet = ltotalOS.isTablet
    var isTouch = isSmartPhone || isTablet
    var platf = navigator.userAgent.toLowerCase()

    var executeNative = panelSocial.executeNative("TEST")
    var executeNativePlatform = panelSocial.executeNative("PLATFORM")

    var tabManager = null
    var searchWords = ""
    var searchTXTWords = ""
    var loginAttempts = 0

    var mosaicCache = [],
      mosaicNavigation = [],
      lastPilarItemSelected,
      lastServiceSelected,
      lastItemSelected

    this.mainFrame = document.createElement("div")
    this.mainFrame.setAttribute("class", "containMosaic active")

    $(panelSocial.bodyDiv).click(function (ev) {
      if (
        !$(ev.target).is(
          ".boxMenu, .categsMenuBox, .userMosaic, .boxMenuButton, .boxMenuLabel, .boxMenuIcon, .categsMenuScrollPart",
        )
      ) {
        hideMenu()
        hideCategsMenu()
      }
    })

    proceso = document.createElement("div")
    proceso.setAttribute("class", "proceso")
    $(proceso).css("display", "none")
    $(that.mainFrame).append(proceso)

    boxMosaic = document.createElement("div")
    boxMosaic.setAttribute("class", "boxMosaic")
    $(this.mainFrame).append(boxMosaic)

    gridBox = document.createElement("div")
    gridBox.setAttribute("class", "gridBox")
    $(boxMosaic).append(gridBox)

    backMosaic = document.createElement("div")
    backMosaic.setAttribute("class", "backMosaic")
    backMosaic.onclick = function () {
      that.getBackNavigation()
    }

    closeMosaic = document.createElement("div")
    closeMosaic.setAttribute("class", "closeMosaic")
    closeMosaic.onclick = function () {
      that.cerrar()
    }

    $(this.mainFrame).fadeTo(250, 1)

    function goHome() {
      that.clickSobrePilar("libros")

      if (executeNative) {
        var cmdObj = { Module: "OfflineApp", Action: "GoHome" }
        var cmdNat = panelSocial.executeNative(cmdObj)
      }
    }

    function detectDeviceResolution() {
      var rsnClass = ltotalOS.detectDeviceResolution()
      isSmartPhone = ltotalOS.isSmartPhone
      isTablet = ltotalOS.isTablet
      isTouch = isSmartPhone || isTablet
      panelSocial.setTabletVars()

      removeClassRegex(/ltr_[a-z]*/g, document.body)
      removeClassRegex(/ltr_[a-z]*/g, panelSocial.bodyDiv)
      removeClassRegex(/ltr_[a-z]*/g, that.mainFrame)
      removeClassRegex(/ltr_[a-z]*/g, boxMosaic)
      $(document.body).addClass(rsnClass)
      $(panelSocial.bodyDiv).addClass(rsnClass)
      $(that.mainFrame).addClass(rsnClass)
      $(boxMosaic).addClass(rsnClass)
    }

    function generateMenus() {
      if (!settings.modePilars) {
        return null
      }

      $([boxTopHeader, boxBottomFooter]).remove()
      $(boxBread).remove()
      $(boxPilars).remove()

      boxTopHeader = document.createElement("div")
      boxTopHeader.setAttribute("class", "boxTopHeader")

      boxBread = document.createElement("div")
      boxBread.setAttribute("class", "boxBread")
      $(that.mainFrame).prepend(boxBread)

      boxPilars = document.createElement("div")
      boxPilars.setAttribute("class", "boxPilars")

      boxLogo = document.createElement("div")
      boxLogo.setAttribute("class", "boxLogo")

      if (!boxTabs) {
        $(boxTabs).remove()
        boxTabs = document.createElement("div")
        boxTabs.setAttribute("class", "boxTabs")
        $(boxBread).after(boxTabs)
      }

      //Libros
      pilarLibros = document.createElement("div")
      pilarLibros.setAttribute(
        "class",
        "pilarlibros pilarBtn pilarlibros_0 t_item_1",
      )
      pilarLibros.pilarID = "pilarlibros_0"

      txtPilarLibros = document.createElement("div")
      txtPilarLibros.setAttribute("class", "txtPilarLibros txtpilar")
      txtPilarLibros.innerHTML = "LIBROS"
      $(pilarLibros).append(txtPilarLibros)

      //Musica
      pilarMusica = document.createElement("div")
      pilarMusica.setAttribute(
        "class",
        "pilarmusica pilarBtn pilarmusica_0 t_item_10",
      )
      pilarMusica.pilarID = "pilarmusica_0"

      txtPilarMusica = document.createElement("div")
      txtPilarMusica.setAttribute("class", "txtPilarmusica txtpilar")
      txtPilarMusica.innerHTML = "MÚSICA"
      $(pilarMusica).append(txtPilarMusica)

      //Arte
      pilarArte = document.createElement("div")
      pilarArte.setAttribute("class", "pilararte pilarBtn pilararte_0 t_item_6")
      pilarArte.pilarID = "pilararte_0"

      txtPilarArte = document.createElement("div")
      txtPilarArte.setAttribute("class", "txtPilarArte txtpilar")
      txtPilarArte.innerHTML = "ARTE"
      $(pilarArte).append(txtPilarArte)

      //Buscar
      pilarSearch = document.createElement("div")
      pilarSearch.setAttribute(
        "class",
        "pilarSearch pilarbuscar pilarBtn pilarSearch_0",
      )
      pilarSearch.pilarID = "pilarSearch_0"

      if (isTouch) {
        //Input del buscador
        if (!searchLT) {
          searchLT = document.createElement("input")
          searchLT.setAttribute("placeholder", "Expresión a buscar")
          iconSearch = document.createElement("div")
        }
        $(pilarSearch).append(iconSearch)
      } else {
        searchLT = document.createElement("input")
        searchLT.setAttribute("placeholder", "BUSCAR")
        iconSearch = document.createElement("div")
        makeRoundButton(pilarSearch)
        $(".squared", pilarSearch).append([searchLT, iconSearch])
      }
      searchLT.setAttribute("type", "text")
      searchLT.setAttribute("class", "searchLT")
      iconSearch.setAttribute("class", "iconSearch")

      //Mensaje de resultados de busqueda
      $(boxSearchMsg).remove()
      boxSearchMsg = document.createElement("div")
      boxSearchMsg.setAttribute("class", "boxSearchMsg")
      $(boxTabs).after(boxSearchMsg)

      //Menu de opciones
      userMosaic = document.createElement("div")
      userMosaic.setAttribute("class", "userMosaic")
      userMosaic.addEventListener(
        isTouch && !ltotalOS.forcedTabletMode ? "touchstart" : "click",
        function (_ev) {
          _ev.stopPropagation()

          hideCategsMenu()
          $(boxMenu).css({ "z-index": "1" })
          $(boxMenu).slideToggle()
        },
        false,
      )

      //Caja del menu
      $(boxMenu).remove()
      boxMenu = document.createElement("div")
      boxMenu.className = "boxMenu"
      $(boxMenu).css({ display: "none" })
      $(that.mainFrame).append(boxMenu)

      //Registrate
      boxBtnRegister = document.createElement("div")
      boxBtnRegister.className = "boxMenuButton loginShowReg boxBtnRegister"
      boxBtnRegister.innerHTML =
        '<div class="boxMenuIcon regist"></div><div class="boxMenuLabel">Crear cuenta</div>'
      boxBtnRegister.addEventListener(
        isTouch && !ltotalOS.forcedTabletMode ? "touchstart" : "click",
        that.btnRegisterClick,
        false,
      )

      //Recuadro para mostar los libros a pantalla completa
      if (!boxMosaicFull) {
        boxMosaicFull = document.createElement("div")
        boxMosaicFull.setAttribute("class", "boxMosaicFull")
        $(boxMosaicFull).css({ display: "none" })
        $(bodyDiv).append(boxMosaicFull)
      }

      //Ordena los pilares y menu
      if (isSmartPhone || isTablet) {
        $(userMosaic).css({ display: "" })
        $(boxBread).append([
          userMosaic,
          boxLogo,
          backMosaic,
          pilarSearch,
          closeMosaic,
        ])
        $(boxMosaic).after(boxTopHeader)
        $(boxTopHeader).append([boxBread, boxPilars])
        $(boxPilars).append([pilarLibros, pilarMusica, pilarArte])
        $(boxMosaic).after(boxSearchMsg)

        //Caja del buscador
        if (!boxSearchMos) {
          boxSearchMos = document.createElement("div")
          boxSearchMos.setAttribute("class", "boxSearchMos")

          iconSearchClose = document.createElement("div")
          iconSearchClose.setAttribute("class", "iconSearchClose")
          iconSearchClose.onclick = deActivateSearch

          buttonSearch = document.createElement("div")
          buttonSearch.setAttribute("class", "buttonSearch")
          $(boxSearchMos).append(buttonSearch)
          buttonSearch.onclick = buscarLT

          boxSearchClean = document.createElement("div")
          boxSearchClean.setAttribute("class", "boxSearchClean")
          $(boxSearchMos).append(boxSearchClean)
          boxSearchClean.onclick = function (_ev) {
            _ev.stopPropagation()
            $(".autocomplete-suggestions").hide()
            $(searchLT).val("")
          }

          $(boxSearchMos).append(searchLT)
          $(boxSearchMos).append(iconSearchClose)
          $(that.mainFrame).append(boxSearchMos)
        }
      } else {
        $(".suggest_home_box").remove()
        $(".autocomplete-suggestions").remove()

        $(boxSearchMsg).css({ "margin-top": "10px" })

        closeMosaic.innerHTML = "SALIR"

        makeRoundButton(userMosaic)
        $(".squared", userMosaic)[0].innerHTML = "MENÚ"

        $(boxBread).append([
          boxLogo,
          userMosaic,
          backMosaic,
          pilarLibros,
          pilarMusica,
          pilarArte,
          pilarSearch,
          closeMosaic,
        ])
      }

      if (settings.withLogin) {
        //Boton de Login
        boxBtnLogin = document.createElement("div")
        boxBtnLogin.className = "boxMenuButton boxBtnLogin"
        boxBtnLogin.addEventListener(
          isTouch && !ltotalOS.forcedTabletMode ? "touchstart" : "click",
          that.btnLoginClick,
          false,
        )
        $(boxMenu).append(boxBtnLogin)
      }

      //Mis Favoritos
      boxBtnFavoritos = document.createElement("div")
      boxBtnFavoritos.innerHTML =
        '<div class="boxMenuIcon fav"></div><div class="boxMenuLabel">Mis favoritos</div>'
      boxBtnFavoritos.className = "boxMenuButton boxBtnFavoritos"
      boxBtnFavoritos.onclick = function () {
        hideMenu()
        var item = document.createElement("div")
        item.className = "cell 44_0 cvLD"
        panelSocial.clickSobreItem(item, "libros", that)
      }

      //Mis Descargas
      boxBtnDescargas = document.createElement("div")
      boxBtnDescargas.innerHTML =
        '<div class="boxMenuIcon download"></div><div class="boxMenuLabel">Mis descargas</div>'
      boxBtnDescargas.className = "boxMenuButton boxBtnDescargas"
      boxBtnDescargas.onclick = function () {
        hideMenu()
        panelSocial.showDownloads()
      }

      //Mis Historial
      boxBtnHistorial = document.createElement("div")
      boxBtnHistorial.innerHTML =
        '<div class="boxMenuIcon hist"></div><div class="boxMenuLabel">Mi historial</div>'
      boxBtnHistorial.className = "boxMenuButton boxBtnHistorial"
      boxBtnHistorial.onclick = function () {
        hideMenu()
        var item = document.createElement("div")
        item.className = "cell 18_0 cvLD"
        panelSocial.clickSobreItem(item, "libros", that)
      }

      //Crear Nota
      boxBtnCrearNota = document.createElement("div")
      boxBtnCrearNota.innerHTML =
        '<div class="boxMenuIcon newnote"></div><div class="boxMenuLabel">Crear nota</div>'
      boxBtnCrearNota.className = "boxMenuButton boxBtnCrearNota"
      boxBtnCrearNota.onclick = function () {
        hideMenu()
        var extra = { idProy: 0, toBook: false }
        panelSocial.editNote(17, 0, extra)
      }

      //Mis Notas
      boxBtnMisNotas = document.createElement("div")
      boxBtnMisNotas.innerHTML =
        '<div class="boxMenuIcon notes"></div><div class="boxMenuLabel">Mis notas</div>'
      boxBtnMisNotas.className = "boxMenuButton boxBtnMisNotas"
      boxBtnMisNotas.onclick = function () {
        hideMenu()
        panelSocial.openBookNotas(27, 0)
      }

      //Mi Cuenta
      boxBtnMyAccount = document.createElement("div")
      boxBtnMyAccount.innerHTML =
        '<div class="boxMenuIcon cuenta"></div><div class="boxMenuLabel">Editar cuenta</div>'
      boxBtnMyAccount.className = "boxMenuButton boxBtnMyAccount"
      boxBtnMyAccount.onclick = function () {
        hideMenu()
        llector.editBio("null")
      }

      //Configuracion
      boxBtnConfig = document.createElement("div")
      boxBtnConfig.innerHTML =
        '<div class="boxMenuIcon config"></div><div class="boxMenuLabel">Configuración</div>'
      boxBtnConfig.className = "boxMenuButton boxBtnConfig"
      boxBtnConfig.onclick = function () {
        hideMenu()
        panelSocial.showConfig()
      }

      //Contactenos
      boxBtnContacto = document.createElement("div")
      boxBtnContacto.className = "boxMenuButton boxBtnContacto"
      boxBtnContacto.innerHTML =
        '<div class="boxMenuIcon contact"></div><div class="boxMenuLabel">Contáctenos</div>'
      boxBtnContacto.onclick = function () {
        if (isSmartPhone) {
          that.showContactenosPreview()
        } else {
          that.showContactenos()
        }
      }
      $(boxMenu).append(boxBtnContacto)

      //Ayuda
      boxBtnAyuda = document.createElement("div")
      boxBtnAyuda.className = "boxMenuButton boxBtnAyuda"
      boxBtnAyuda.innerHTML =
        '<div class="boxMenuIcon guia"></div><div class="boxMenuLabel">Guía de uso</div>'
      boxBtnAyuda.onclick = function () {
        that.showAyuda()
      }
      $(boxMenu).append(boxBtnAyuda)

      //Preguntas frecuentes
      boxBtnFreqQuestions = document.createElement("div")
      boxBtnFreqQuestions.className = "boxMenuButton boxBtnFreqQuestions"
      boxBtnFreqQuestions.innerHTML =
        '<div class="boxMenuIcon preg"></div><div class="boxMenuLabel">Preguntas frecuentes</div>'
      boxBtnFreqQuestions.onclick = function () {
        that.showFrequentQuestions()
      }
      $(boxMenu).append(boxBtnFreqQuestions)

      //Comandos de la busqueda
      iconSearch.onclick = isSmartPhone || isTablet ? activateSearch : buscarLT

      $(searchLT).focus(function () {
        //Autocompletar
        if (!searchLT.autocomp) {
          $(searchLT).devbridgeAutocomplete({
            serviceUrl: "/ltotal/inicio/utils/ut_46.jsp",
            minChars: 2,
            deferRequestBy: 80,
            maxHeight: 500,
            triggerSelectOnValidInput: false,
            onSelect: function (suggestion) {
              var mosa = panelSocial.mosaico
              var doOpenItem = false

              var tipoItem = suggestion.item_type
              var idItem = suggestion.item_id

              //NOTA!!!
              //Para este proceso se debe buscar la forma que se unifique con
              //panelSocial.openMosaicLink
              //OJOO con tipoItem == 3 con x_extralabels_1

              if (tipoItem == 1) {
                var item = document.createElement("div")
                item.className = "cell 1_" + idItem
                panelSocial.clickSobreItem(item, "libros", mosa, null)
                doOpenItem = true
              }
              if (tipoItem == 3) {
                var item = document.createElement("div")
                item.className =
                  "cell 3_" + idItem.replace(/_/g, ",") + " x_extralabels_1"
                panelSocial.clickSobreItem(item, "libros", mosa, null)
                doOpenItem = true
              }
              if (tipoItem == 4) {
                var item = document.createElement("div")
                item.className = "cell 4_" + idItem.replace("_", ",")
                $(item).css({
                  "background-image": "url(" + suggestion.cover + ")",
                })
                panelSocial.clickSobreItem(item, "libros", mosa, null)
                doOpenItem = true
              }
              if (tipoItem == 8) {
                var item = document.createElement("div")
                item.className = "cell 8_" + idItem.replace("_", ",")
                panelSocial.clickSobreItem(item, "libros", mosa, null)
                doOpenItem = true
              }
              if (tipoItem == 10) {
                panelSocial.openMusicByID(idItem)
                doOpenItem = true
              }
              if (tipoItem == 14) {
                var item = document.createElement("div")
                item.className = "cell 14_" + idItem + " x_showfiltrogenero_1"
                panelSocial.clickSobreItem(item, "libros", mosa, null)
                doOpenItem = true
              }
              if (tipoItem == 16) {
                var pubDomain = suggestion.value3 == 1 ? true : false
                panelSocial.openDiccTotal(null, idItem, {
                  openInTab: true,
                  diccAlfabetico: true,
                  publicDomain: pubDomain,
                })
                doOpenItem = true
              }
              if (tipoItem == 23) {
                var item = document.createElement("div")
                item.className = "cell 23_-2" + " x_showqueriesmenu_1"
                panelSocial.clickSobreItem(item, "libros", mosa, null)
                doOpenItem = true
              }
              if (tipoItem == 24) {
                var item = document.createElement("div")
                item.className = "cell 24_" + idItem
                panelSocial.clickSobreItem(item, "libros", mosa, null)
                doOpenItem = true
              }
              if (tipoItem == 32) {
                var item = document.createElement("div")
                item.className = "cell 32_" + idItem
                panelSocial.clickSobreItem(item, "libros", mosa, null)
                doOpenItem = true
              }
              if (tipoItem == 45) {
                panelSocial.openDiccTotal(suggestion.value, null, {
                  openInTab: true,
                })
                doOpenItem = true
              }
              if (tipoItem == 47) {
                var item = document.createElement("div")
                item.className = "cell 47_" + idItem.replace(/_/g, ",")
                panelSocial.clickSobreItem(item, "libros", mosa, null)
                doOpenItem = true
              }
              if (tipoItem == 50) {
                var item = document.createElement("div")
                item.className = "cell 50_" + idItem
                panelSocial.clickSobreItem(item, "libros", mosa, null)
                doOpenItem = true
              }
              if (tipoItem == 51) {
                var item = document.createElement("div")
                item.className = "cell 51_" + idItem
                panelSocial.clickSobreItem(item, "libros", mosa, null)
                doOpenItem = true
              }
              if (tipoItem == "mydownld") {
                var classFormat = suggestion.format
                  ? " format_" + suggestion.format
                  : " format_epub"
                var item = document.createElement("div")
                item.className = "cell mydownld_" + idItem + classFormat
                panelSocial.clickSobreItem(item, "libros", mosa, null)
                doOpenItem = true
              }

              if (doOpenItem) {
                $(searchLT).blur()
                if (isSmartPhone || isTablet) {
                  deActivateSearch()
                }
              } else {
                buscarLT(suggestion.value)
              }
            },
            beforeRender: function (container, suggestions) {
              //You may manipulate suggestions DOM before it is displayed
              setTimeout(function () {
                //Asegura el scrollTop este en 0 cuando hay nueva busqueda
                if (container[0].valor != searchLT.value) {
                  container[0].valor = searchLT.value
                  container[0].scrollTop = 0
                }
              }, 300)
            },
            leftRelativeParent: true,
            extraWidth: 300,
            showHomePanel: {
              msg: "Recuerda que no podemos publicar libros protegidos por derechos de autor. Todos los contenidos son libres o autorizados para la difusión en la biblioteca.",
              clase: "suggest_home_box",
            },
          })
          searchLT.autocomp = true
        }
      })

      searchLT.onkeyup = function (event) {
        if (event.which == 13) {
          buscarLT()
        }
      }

      boxLogo.onclick = goHome
    }

    function generateFooterMenu() {
      boxBottomFooter = document.createElement("div")
      boxBottomFooter.setAttribute("class", "boxBottomFooter")
      $(that.mainFrame).append(boxBottomFooter)

      footerBtnHome = document.createElement("div")
      footerBtnHome.innerHTML =
        '<div class="footerBtn home"></div><div class="footerLabel">Inicio</div>'
      footerBtnHome.className = "boxFooterButton"
      footerBtnHome.style = "margin-left: 0"
      footerBtnHome.addEventListener("touchstart", function (_ev) {
        if ($(backMosaic).is(":visible") || $(".cells_extended")[0]) {
          goHome()
        } else {
          gridBoxSmall.scrollTo({ top: 0, behavior: "smooth" })
        }
      })

      footerBtnDescargas = document.createElement("div")
      footerBtnDescargas.innerHTML =
        '<div class="footerBtn download"></div><div class="footerLabel">Descargas</div>'
      footerBtnDescargas.className = "boxFooterButton"
      footerBtnDescargas.addEventListener(
        "touchstart",
        panelSocial.showDownloads,
      )

      footerBtnGuia = document.createElement("div")
      footerBtnGuia.innerHTML =
        '<div class="footerBtn guia"></div><div class="footerLabel">Guía de uso</div>'
      footerBtnGuia.className = "boxFooterButton"
      footerBtnGuia.addEventListener("touchstart", that.showAyuda)

      footerBtnBiblio = document.createElement("div")
      footerBtnBiblio.innerHTML =
        '<div class="footerBtn biblio"></div><div class="footerLabel">Mi biblioteca</div>'
      footerBtnBiblio.className = "boxFooterButton"
      footerBtnBiblio.addEventListener("touchstart", function () {
        var item = document.createElement("div")
        item.className = "cell 24_mibliblio x_showmisdescargas_1"
        panelSocial.clickSobreItem(item, "libros", panelSocial.mosaico, {})
      })

      $(boxBottomFooter).append([
        footerBtnHome,
        footerBtnDescargas,
        footerBtnGuia,
        footerBtnBiblio,
      ])
    }

    function hideMenu() {
      $(boxMenu).css({ "z-index": "" })
      if ($(boxMenu).is(":visible")) {
        $(boxMenu).slideToggle()
      }
    }

    function showTopHeader(_modo) {
      if (_modo == "hide" && !$(boxTopHeader).hasClass("ontop")) {
        $(gridBox.labelAtTop).css({ visibility: "hidden" })
        $(boxTopHeader)
          .addClass("ontop")
          .animate({ top: "-150px" }, 400, function () {
            if (gridBox.labelAtTop) {
              LPPutLabelAtTop(gridBox.labelAtTop.label)
            }
          })

        $(boxBottomFooter).animate({ bottom: "-60px" }, 400)
      }

      if (_modo == "show" && $(boxTopHeader).hasClass("ontop")) {
        $(gridBox.labelAtTop).css({ visibility: "hidden" })
        $(boxTopHeader)
          .removeClass("ontop")
          .animate({ top: "0px" }, 400, function () {
            if (gridBox.labelAtTop) {
              LPPutLabelAtTop(gridBox.labelAtTop.label)
            }
          })

        $(boxBottomFooter).animate({ bottom: "0px" }, 400)
      }
    }

    function focusItem(_elem, _txtIN, _cont) {
      var $elem = $(_elem)
      _elem.setAttribute("placeholder", _txtIN)
      $elem.focusin(function () {
        _elem.setAttribute("placeholder", "")
      })
      $elem.focusout(function () {
        _elem.setAttribute("placeholder", _txtIN)
      })

      if (_cont) {
        _elem.onkeyup = function (ev) {
          executeEnter(ev, function () {
            $(".loginInitSes, .loginReg", _cont).trigger("click")
          })
        }
      }
    }

    function saveLastNavigation() {
      var navData = null
      if (panelSocial.selectedBook) {
        var setts = panelSocial.selectedBook.settings
        var tipo = setts.tipoLibro
        var modo = setts.modoLibro
        var idLib = setts.idLibro
        var percent = setts.numePaginaPercent

        if (tipo == 1) {
          navData = [1, idLib, setts.idTrad, setts.pgFin, percent]
        }
        if (tipo == 27) {
          if (modo == 0) {
            navData = [27, idLib]
          }
          if (modo == 1) {
            navData = [17, setts.idItemFin]
          }
          if (modo == 2) {
            navData = [17, idLib]
          }
        }
        if (tipo == 32) {
          navData = [15, idLib, setts.idItemFin, percent]
        }
      } else if ($(".caratula_banner")[0]) {
        var bData = $(".caratula_banner")[0]
          .className.match(/\d+_\d+/)[0]
          .split("_")
        navData = bData
      }

      if (navData && navData.length > 0) {
        ltotalUtils.toLocalStorage("lastNavData", navData.join("_"))
      }
    }

    function placeMainBtns() {
      if (ltotalOS.forcedTabletMode && $(window).width() > 1040) {
        ltotalOS.forcedTabletMode = false
        setTimeout(that.rePaint, 200)
        return null
      }

      if (isTouch) {
        //Reduce un poco el tamaño del los botones cuando el boton de arte se sale de la pantalla
        var btnsPilares = $([pilarLibros, pilarMusica, pilarArte])
        var squared = $(".squared", btnsPilares)

        btnsPilares.css({ "margin-left": "", width: "" })
        squared.css({ width: "" })

        var pfin = pilarArte.offsetLeft + pilarArte.offsetWidth
        var ww = $(window).width()
        if (pfin > ww) {
          btnsPilares.css({ "margin-left": "0", width: "107px" })
          squared.css({ width: "71px" })
        }
      } else {
        //Ubica los 3 botones principales en escritorio
        var widthPilars = 500
        var widthBtnBack = 40
        var pini = boxLogo.offsetLeft + boxLogo.offsetWidth + widthBtnBack
        var pfin = userMosaic.offsetLeft
        var largo = pfin - pini
        var left = (largo - widthPilars) / 2 + pini

        var btnsPilares = $([pilarLibros, pilarMusica, pilarArte])
        if (left < pini) {
          //Reduce el tamaño de los botones
          btnsPilares.css({ width: "112px" })
          $(".squared", btnsPilares).css({ width: "76px" })
          $(pilarLibros).css({ "margin-left": pini + "px" })

          var artfin = pilarArte.offsetLeft + pilarArte.offsetWidth
          var deltaPfinArtfin = pfin - artfin
          if (deltaPfinArtfin < 10) {
            ltotalOS.forcedTabletMode = true
            setTimeout(that.rePaint, 200)
          }
        } else {
          //Restablece el tamaño de los botones
          btnsPilares.css({ width: "" })
          $(".squared", btnsPilares).css({ width: "" })
          $(pilarLibros).css({ "margin-left": left + "px" })
        }
      }
    }

    this.aumentarSizeMosaico = function (_caso, _extra) {
      if (_caso == 0) {
        $(panelSocial.bodyDiv).removeClass("aumented")
        $(boxMosaic).removeClass("aumented")
        $(that.mainFrame).removeClass("aumented")
      }
      if (_caso == 1) {
        $(panelSocial.bodyDiv).addClass("aumented")
        $(boxMosaic).addClass("aumented")
        $(that.mainFrame).addClass("aumented")
      }

      $(".cell.mydownld").each(function () {
        loadNativeCover(this)
      })

      repaintFluid()

      panelSocial.mosaicSize = _caso
      ltotalOS.setPreferenciaLector("mosaicSize", _caso)
    }

    this.configBtnLogin = function () {
      if (lectorLogueado) {
        $(boxBtnLogin)
          .addClass("closeSes")
          .removeClass("initSes")
          .html(
            '<div class="boxMenuIcon logout"></div><div class="boxMenuLabel">Cerrar sesión</div>',
          )

        $(boxBtnContacto).before(boxBtnMyAccount)
        $(boxMenu).prepend(boxBtnCrearNota)
        $(boxMenu).prepend(boxBtnHistorial)
        $(boxMenu).prepend(boxBtnFavoritos)
        $(boxBtnCrearNota).after(boxBtnMisNotas)
        $(boxMenu).append(boxBtnLogin)
      } else {
        $(boxBtnLogin)
          .addClass("initSes")
          .removeClass("closeSes")
          .html(
            '<div class="boxMenuIcon login"></div><div class="boxMenuLabel">Iniciar sesión</div>',
          )
        $(boxBtnLogin).before(boxBtnRegister)
        $(boxMenu).prepend(boxBtnLogin)
      }

      $(boxBtnContacto).before(boxBtnConfig)

      if (panelSocial.hasOfflineBooks()) {
        $(boxMenu).prepend(boxBtnDescargas)

        generateFooterMenu()
      }
    }

    this.btnRegisterClick = function () {
      that.showLogin.call(boxBtnRegister)
    }

    this.btnLoginClick = function () {
      that.showLogin.call(boxBtnLogin)
    }

    function showCaptcha(_cont) {
      $(".divCaptcha, .loginCaptcha", _cont).css({ display: "" })
      $(".reloadCaptcha", _cont)[0].onclick = function () {
        getCaptcha(_cont)
      }
    }

    function getCaptcha(_cont) {
      var urlCaptcha = "/ltotal/lector/captcha.jsp"
      $.post(urlCaptcha, {}).done(function (_d) {
        var proc = $("#proceso").html(_d)

        var captcha_img = $(".captcha_img", proc).text()
        $(".imgCaptcha", _cont)[0].src = "data:image/png;base64, " + captcha_img

        loginAttempts = parseInt($(".loginAttempts", proc).text())
        if (loginAttempts > 0) {
          showCaptcha(_cont)
        }
      })
    }

    this.showLogin = function () {
      var $this = $(this)

      hideMenu()
      var setts = {
        heightV: null,
        widthV: null,
        scrollSyc: false,
        bgColor: "rgb(255, 255, 255)",
        fnAfterClose: function () {
          panelSocial.setNativeMainViewBGColor(11, 28, 43)
        },
      }

      //Form iniciar sesion
      var isLogin = $this.hasClass("initSes")
      if (isLogin) {
        var HTML =
          '\
            <div class="initSesScreen">\
                <div class="loginHeader">Para hacer notas, agregar favoritos, ver el historial y acceder a otros servicios, debe crear una <span onclick="$(\'.btnCloseAlert\', alertLM.getContain()).trigger(\'click\'); $(\'.loginShowReg\').trigger(\'click\');" style="color:#0873F5; cursor:pointer;">cuenta gratis</span> como lector.</div>\
                <input type="text" class="loginField loginEmail" place="Correo" />\
                <div class="divPasswd">\
                    <input type="password" class="loginField passwdField loginPass"  place="Contraseña" />\
                    <div class="passwd_view"></div>\
                </div>\
                <div class="divCaptcha" style="display:none;"><img class="imgCaptcha" src="" /><img class="reloadCaptcha" src="/estaticosED/files/img/refresh.svg" style="cursor:pointer; width:50px; height:50px;" title="Cambiar de imagen" /></div>\
                <input type="text" autocapitalize="none" autocorrect="off" class="loginField loginCaptcha" place="Digite el texto de la imagen" style="display:none;" />\
                <div class="loginMsg"></div>\
                <div class="loginBtn loginInitSes">Iniciar sesión</div>\
                <div class="loginBtn loginShowRecClave">Restaurar contraseña</div>\
                <div class="loginBtn loginShowReg">Crear cuenta</div>\
            </div>\
            '
      }

      //Form cerrar sesion
      if ($this.hasClass("closeSes")) {
        var nLect = $.trim(lectorLogueado.nombre).split(/\s+/)[0]
        var HTML =
          '\
            <div style="width:100%;">\
                <div class="loginHeader" style="text-align:justify;">' +
          nLect +
          ',<br><br>Va a salir del espacio personal "Mi Biblioteca". Para volver a ingresar debe escribir su correo y contraseña nuevamente.</div>\
                <div class="loginBtn loginCloseSes">Cerrar sesión</div>\
            </div>\
            '
      }

      //Form cancelar cuenta
      if ($this.hasClass("killAccount")) {
        var nLect = $.trim(lectorLogueado.nombre).split(/\s+/)[0]
        var HTML =
          '\
            <div style="width:100%;">\
                <div class="loginHeader" style="text-align:justify;">' +
          nLect +
          ',<br><br>Se dispone a cancelar su cuenta en la Biblioteca El Libro Total: recuerde que sin registro, el sistema no podrá recordar sus últimas lecturas, notas personales y demás funcionalidades únicamente disponibles para los usuarios con cuenta activa. Si decide cancelarla, podrá registrarse nuevamente cuando lo desee.</div>\
                <div><div class="loginBtn loginKillAccountCancel" style="float:left; left:0;">Cancelar</div><div class="loginBtn loginKillAccount" style="float:left; left:0;">Confirmar</div></div>\
            </div>\
            '
        setts.heightV = 320
      }

      //Form registro
      var isRegistro = $this.hasClass("loginShowReg")
      if (isRegistro) {
        var HTML =
          '\
            <div class="loginShowRegScreen">\
                <div class="loginHeader">Para hacer notas, agregar favoritos, ver el historial y acceder a otros servicios, debe crear una <span style="color:#0873F5;">cuenta gratis</span> como lector.</div>\
                <input type="text"     class="loginField loginRegName" place="Nombres y apellidos" />\
                <input type="text"     class="loginField loginRegEmail" place="Correo electrónico" />\
                <input type="text"     class="loginField loginRegEmailConfirm" place="Confirmar correo electrónico" />\
                <div class="divPasswd">\
                    <input type="password" class="loginField passwdField loginRegPass" place="Contraseña" />\
                    <div class="passwd_view"></div>\
                </div>\
                <div class="divPasswd">\
                    <input type="password" class="loginField passwdField loginRegPassConfirm" place="Confirmar contraseña" />\
                    <div class="passwd_view"></div>\
                </div>\
                <div class="loginShowRegBoxPTI"><input type="checkbox" class="loginRegCheckPTI" />&nbsp;Autorizo y Acepto la  <span class="loginRegReadPTI" title="Leer Política de tratamiento de información personal">Política de tratamiento de la información</span> y el <span class="loginRegReadMGU" title="Leer Marco general de uso de la plataforma del Libro Total">Marco general de uso.</span></div>\
                <div class="loginBtn loginReg">Crear cuenta</div>\
                <div style="position:relative; width:100%; height:300px; box-sizing: border-box;"></div>\
            </div>\
            '
      }

      //Form restaurar clave
      if ($this.hasClass("loginShowRecClave")) {
        var HTML =
          '\
            <div style="width:100%;">\
                <div class="loginHeader">En los próximos minutos se le enviarán las instrucciones para restaurar su contraseña al correo electrónico.</div>\
                <input type="text" class="loginField loginRecClaveEmail" place="Correo electrónico" />\
                <div class="loginBtn loginRecClave">Enviar</div>\
            </div>\
            '
      }

      //FIN. Formularios

      var fTV = panelSocial.openModalTxtViewer(HTML, setts)
      var cont = $(fTV.getContain())

      panelSocial.setNativeMainViewBGColor(255, 255, 255)

      cont.addClass("boxLogin")
      $(".contentHtml", cont).css({ width: "90%", "margin-left": "5%" })

      if (isLogin) {
        getCaptcha(cont)
      }

      //tamano para hacer scroll form registro, div temporal en el formulario. Quitar cuando tengamo App en android puro.
      if (isRegistro) {
        $(".contentHtml", cont).css({ height: "90%" })
      }

      $(".loginField", cont).each(function () {
        focusItem(this, $(this).attr("place"), cont)
      })

      $(".passwd_view", cont).each(function () {
        this.onclick = function () {
          var btn = $(this)
          var divp = btn.parent()
          var inpt = $("input", divp)[0]
          if (inpt.type === "password") {
            inpt.type = "text"
            btn.addClass("textual")
          } else {
            inpt.type = "password"
            btn.removeClass("textual")
          }
        }
      })

      //Iniciar sesion
      $(".loginInitSes", cont).click(function () {
        var btn = this

        var correo = $(".loginEmail", cont).val().trim()
        var clave = $(".loginPass", cont).val().trim()
        var captcha = $(".loginCaptcha", cont).val().trim()

        if (correo.length == 0 || clave.length == 0) {
          return $(".loginMsg", cont)
            .css({ display: "block" })
            .text("Por favor digite su correo y contraseña.")
        }

        var datosCorreo = correo.split("@")
        if (datosCorreo.length == 1) {
          correo = correo + "@syc.com.co"
        }

        if (loginAttempts > 0 && captcha.length == 0) {
          return $(".loginMsg", cont)
            .css({ display: "block" })
            .text("Por favor digite el texto de la imagen de verificación.")
        }

        btn.innerHTML = "<em>Iniciando sesión...</em>"

        ltotalOS.login(correo, clave, captcha).done(function (_r) {
          if (_r == "EXITO") {
            panelSocial.saveNativeCredentials(correo, clave)
            saveLastNavigation()
            $(".closeModalViewer", cont).trigger("click")
            location.reload()
          }
          if (_r == "FRACASO") {
            loginAttempts++
            getCaptcha(cont)

            $(".loginMsg", cont)
              .css({ display: "block" })
              .text(
                "Por favor verifique su correo, contraseña y el código de verificación.",
              )

            btn.innerHTML = "Iniciar sesión"
          }
        })
      })

      //Cerrar sesion
      $(".loginCloseSes", cont).click(function () {
        ltotalOS.logOut().done(function () {
          panelSocial.deleteNativeCredentials()
          saveLastNavigation()
          $(".closeModalViewer", cont).trigger("click")
          location.reload()
        })
      })

      //Cancelar cuenta
      $(".loginKillAccount", cont).click(function () {
        ltotalOS.cancelRegister().done(function (d) {
          if (d == "EXITO") {
            ltotalOS.logOut().done(function () {
              panelSocial.deleteNativeCredentials()
              location.reload()
            })
          } else {
            alertLM.show(
              bodyDiv,
              "No fué posible cancelar su cuenta.<br>Por favor contáctenos para revisar su caso.",
            )
          }
        })
      })

      //Cerrar cancelar cuenta
      $(".loginKillAccountCancel", cont).click(function () {
        fTV.destroy()
      })

      //Mostrar registro de usuario
      $(".loginShowReg", cont).click(function () {
        that.showLogin.call(this)
      })

      //Leer PTI
      $(".loginRegReadPTI", cont).click(function () {
        panelPTI({ idLibro: 11425, idTrad: 11197, hostDiv: bodyDiv })
      })

      //Leer MGU
      $(".loginRegReadMGU", cont).click(function () {
        panelPTI({ idLibro: 11020, idTrad: 10735, hostDiv: bodyDiv })
      })

      //Registro de usuario
      $(".loginReg", cont).click(function () {
        var btn = this

        var nombre = $(".loginRegName", cont).val()
        var correo = $(".loginRegEmail", cont)
          .val()
          .toLowerCase()
          .replace(/\s+/g, "")
        var correoConfirm = $(".loginRegEmailConfirm", cont)
          .val()
          .toLowerCase()
          .replace(/\s+/g, "")
        var clave = $(".loginRegPass", cont).val()
        var claveConfirm = $(".loginRegPassConfirm", cont).val()

        if (
          nombre.length < 1 ||
          correo.length < 1 ||
          correoConfirm.length < 1
        ) {
          alertLM.show(bodyDiv, "Por favor llene todos los datos")
          return null
        }
        if (clave.length < 6) {
          alertLM.show(bodyDiv, "La clave debe tener 6 caracteres o más")
          return null
        }
        if (clave != claveConfirm) {
          alertLM.show(bodyDiv, "La clave y la confirmación deben ser iguales")
          return null
        }
        if (
          correo.indexOf("@") == -1 ||
          correo.indexOf(".") == -1 ||
          correoConfirm.indexOf("@") == -1 ||
          correoConfirm.indexOf(".") == -1
        ) {
          alertLM.show(bodyDiv, "Por favor verifique su correo")
          return null
        }
        if (correo != correoConfirm) {
          alertLM.show(
            bodyDiv,
            "El correo y la confirmación de correo deben ser iguales",
          )
          return null
        }
        if (!$(".loginRegCheckPTI", cont).prop("checked")) {
          alertLM.show(
            bodyDiv,
            "Para registrarse en el Libro Total, debe aceptar la política de tratamiento de datos personales.",
          )
          return null
        }

        //Integridad del correo electronico
        //Validacion con respecto a dominios conocidos mal escritos
        var correoArr = correo.split("@")
        if (correoArr.length == 2) {
          var correoOK = true
          correoArr = correoArr[1].split(/\./g)

          var badDomains = [
            "gmal",
            "gamil",
            "gmali",
            "gamail",
            "gamali",
            "gmil",
            "gamal",
            "oulook",
            "outlok",
            "yaho",
            "homail",
            "homal",
            "hotmal",
          ]
          for (var ibd = 0; ibd < badDomains.length; ibd++) {
            if (correoArr[0] == badDomains[ibd]) {
              correoOK = false
              break
            }
          }

          if (!correoOK) {
            alertLM.show(
              bodyDiv,
              "Por favor verifique su correo.<br>Es posible que parte de la dirección " +
                correoArr.join(".") +
                " esté mal escrita.",
            )
            return null
          }
        } else {
          alertLM.show(
            bodyDiv,
            'Por favor verifique su correo.<br>Sólo debe haber un (1) caracter "@".',
          )
          return null
        }

        btn.innerHTML = "<em>Creando registro...</em>"

        var extra = {
          id_cliente: panelSocial.getIDCliente(),
        }

        ltotalOS
          .register(nombre, correo, correoConfirm, clave, extra)
          .done(function (_r) {
            if (_r == "EXITO") {
              ltotalOS.login(correo, clave).done(function (_r) {
                if (_r == "EXITO") {
                  panelSocial.saveNativeCredentials(correo, clave)
                  location.reload()
                }
              })
            }
            if (_r == "NO_DISPONIBLE") {
              alertLM.show(
                bodyDiv,
                "El correo proporcionado (" + correo + ") ya está inscrito",
              )
            }
            if (_r == "CONFIRMAR_CORREO") {
              alertLM.show(
                bodyDiv,
                "El correo y la confirmación de correo deben ser iguales",
              )
            }
            if (_r == "ERROR") {
              alertLM.show(
                bodyDiv,
                "Hubo un problema en el registro.\nPor favor intente mas tarde",
              )
            }
            btn.innerHTML = "Registrarme"
          })
      })

      //Mostrar restaurar contraseña
      $(".loginShowRecClave", cont).click(function () {
        that.showLogin.call(this)
      })

      //Restaurar contraseña
      $(".loginRecClave", cont).click(function () {
        var correo = $.trim($(".loginRecClaveEmail", cont).val())

        if (
          correo.length == 0 ||
          correo.indexOf("@") == -1 ||
          correo.indexOf(".") == -1
        ) {
          alertLM.show(
            bodyDiv,
            "Por favor escriba la dirección de correo electrónico que usó para registrarse en El Libro Total",
          )
          return null
        }

        ltotalOS.remember(correo).done(function (_r) {
          if (_r == "EXITO") {
            $(".closeModalViewer", fTV.getContain()).trigger("click")
          }
          if (_r == "ERROR") {
            alertLM.show(
              bodyDiv,
              "No es posible realizar el proceso en este momento.\nPor favor intente mas tarde.",
            )
          }
        })
      })
    }

    this.showContactenosPreview = function () {
      hideMenu()

      var HTML =
        '\
        <div class="showContactenosScreen">\
        <div class="contactIcon"></div>\
            <div class="contactHeader">Por favor comparta con nosotros sus comentarios e inquietudes sobre la biblioteca del Libro Total a través del medio de su preferencia.</div>\
            <div class="contactBtn whatsapp"><div class="contactWhatsAppIcon"></div><a class="lnk_whatsapp" href="whatsapp://send?phone=573178941441&text=&source=&data=" target="_blank"></a>Vía WhatsApp</div>\
            <div class="contactBtn mail" onclick="panelSocial.mosaico.showContactenos();"><div class="contactEmailIcon"></div>Correo electrónico</div>\
        </div>'

      //https://wa.me/573178941441

      var fTV = panelSocial.openModalTxtViewer(HTML, {
        scrollSyc: false,
        bgColor: "rgb(255, 255, 255)",
      })
      $(".contentHtml", $(fTV.getContain())).css({
        width: "90%",
        "margin-left": "5%",
      })
      $(fTV.getContain()).addClass("boxContact")
    }

    this.showContactenos = function () {
      hideMenu()

      var setts = {
        heightV: null,
        widthV: null,
        scrollSyc: false,
        bgColor: "rgb(255, 255, 255)",
      }

      var savingContMsg = false

      var HTML =
        '\
            <div class="showContactenosScreen">\
                <div class="contactHeader">Por favor comparta con nosotros sus comentarios e inquietudes sobre la biblioteca del Libro Total.</div>\
                <input type="text" class="contactField contactName"   place="Su nombre" />\
                <input type="text" class="contactField contactEmail"  place="Su correo electrónico" />\
                <textarea class="contactField contactMsg"  place="Su mensaje para la biblioteca del Libro Total" style="resize:none; overflow:auto;"></textarea>\
                <div class="contactShowBoxPTI"><input type="checkbox" class="contactCheckPTI" />&nbsp;Autorizo y Acepto la  <span class="contactReadPTI" title="Leer Política de tratamiento de información personal">Política de tratamiento de la información</span> y el <span class="contactReadMGU" title="Leer Marco general de uso de la plataforma del Libro Total">Marco general de uso.</span></div>\
                <div class="contactBtn contactSend">Enviar</div>\
            </div>\
            '

      var fTV = panelSocial.openModalTxtViewer(HTML, setts)
      var cont = $(fTV.getContain())

      cont.addClass("boxContact")
      $(".contentHtml", cont).css({ width: "90%", "margin-left": "5%" })

      $(".contactField", cont).each(function () {
        focusItem(this, $(this).attr("place"), null)
      })

      //Enviar mensaje
      $(".contactSend", cont).click(function () {
        var nombre = $(".contactName", cont).val()
        var mail = $(".contactEmail", cont).val()
        var msg = $(".contactMsg", cont).val()
        var checker = $(".contactCheckPTI", cont)

        if (mail.indexOf("@") == -1 || mail.indexOf(".") == -1) {
          return alertLM.show(
            bodyDiv,
            "Por favor escriba su correo electrónico",
          )
        }

        if ($.trim(msg).length == 0) {
          return alertLM.show(bodyDiv, "Por favor escriba su mensaje")
        }

        if (!checker.prop("checked")) {
          return alertLM.show(
            bodyDiv,
            "Para enviar el mensaje, debe aceptar la política de tratamiento de datos personales",
          )
        }

        if (!savingContMsg) {
          savingContMsg = true

          ltotalOS.contact(nombre, mail, msg).done(function () {
            fTV.destroy()
          })
        }
      })

      //Leer PTI
      $(".contactReadPTI", cont).click(function () {
        panelPTI({ idLibro: 8509, idTrad: 8133, hostDiv: bodyDiv })
      })

      //Leer MGU
      $(".contactReadMGU", cont).click(function () {
        panelPTI({ idLibro: 11020, idTrad: 10735, hostDiv: bodyDiv })
      })

      if (lectorLogueado) {
        $(".contactName", cont).val(lectorLogueado.nombre)
        $(".contactEmail", cont).val(lectorLogueado.mail)
      }
    }

    this.showAyuda = function () {
      hideMenu()
      ltotalUtils.loadScript(
        panelSocial.getContextoEstaticos() + "/js/ltotal/helper.js",
      )
      ltotalUtils.loadScript(
        panelSocial.getContextoEstaticos() + "/css/ltotal/helper.css",
      )
      helper.init()
    }

    this.showRatingApp = function () {
      hideMenu()
      ltotalUtils.loadScript(
        panelSocial.getContextoEstaticos() + "/js/ltotal/rating_app.js",
      )
      ltotalUtils.loadScript(
        panelSocial.getContextoEstaticos() + "/css/ltotal/rating_app.css",
      )
      ratingApp.init()
    }

    this.showFrequentQuestions = function (_extraParams) {
      hideMenu()

      var xParams =
        _extraParams && _extraParams.txtCoord
          ? _extraParams
          : { openInIndex: true }
      panelSocial.openBook(1, 1565, 1616, xParams)
    }

    this.activateCategsMenuBtns = function () {
      $(".categsMenuBox", that.mainFrame).remove()

      categsMenuBox = $(
        '<div class="categsMenuBox" style="display:none;"></div>',
      )
      $(that.mainFrame).append(categsMenuBox)

      var categs = {
        libros:
          "Historia#Bélico#Terror#Juvenil#Infantil#Fantástico#Ciencia ficción#Filosofía#Política#Espiritualidad#Policial#Romántico#Gastronomía#Pedagogía#Biografía#Artículos#Ensayos#Cuentos#Novelas#Poesía#Teatro#Crónica#Frases",
        musica: "Culta#Folclórica#Instrumental#Rock#Ópera",
      }

      var replaceAccent = function (_str) {
        return _str
          .replace(/á/, "a")
          .replace(/é/, "e")
          .replace(/í/, "i")
          .replace(/ó/, "o")
          .replace(/ú/, "u")
          .replace(/\s/, "")
      }

      for (var property in categs) {
        if (categs.hasOwnProperty(property)) {
          var cats = categs[property].split("#")
          var catsBtns = []
          $.each(cats, function () {
            var ct = this
            var ctclass = replaceAccent(ct).toLowerCase()
            var catBtn = $(
              '<div class="categsMenuButton categ_' +
                property +
                " serv_" +
                property +
                " cat_" +
                ctclass +
                '"><div class="categ_icon"></div><div class="categ_label">' +
                ct +
                "</div></div>",
            )[0]
            catsBtns.push(catBtn)

            catBtn.onclick = function () {
              var ctxt = $(this).text().toLowerCase()
              if ($(this).hasClass("serv_libros")) {
                var item = document.createElement("div")
                item.className = "cell 14_" + replaceAccent(ctxt) + " cvLD"
                panelSocial.clickSobreItem(item, "libros", that, {
                  extra_labels: 1,
                  list_detail_genero: 1,
                })
              }

              if ($(this).hasClass("serv_musica")) {
                var idsGens = {
                  Culta: 551,
                  Folclórica: 441,
                  Instrumental: 511,
                  Rock: 520,
                  Ópera: 473,
                }
                var nombGen = $(this).text()
                var idGen = idsGens[nombGen]

                var item = document.createElement("div")
                item.className = "cell 38_" + idGen + " cvLD"
                panelSocial.clickSobreItem(item, "musica", that, {
                  extra_labels: 1,
                  listlabels: 1,
                })
              }
            }
          })

          categsMenuBox[0][property] = catsBtns
        }
      }

      //Botones particulares Libros
      var confrontadosBtn = $(
        '<div class="categsMenuButton categ_libros cat_confrontados"><div class="categ_icon"></div><div class="categ_label">Confrontados a otros idiomas</div></div>',
      )
      categsMenuBox[0]["libros"].unshift(confrontadosBtn[0])
      confrontadosBtn[0].onclick = function () {
        var item = document.createElement("div")
        item.className = "cell 8_1,7 cvLD"
        panelSocial.clickSobreItem(item, "libros", that, { extra_labels: 1 })
      }

      var audioLibrosBtn = $(
        '<div class="categsMenuButton categ_libros cat_audiolibros"><div class="categ_icon"></div><div class="categ_label">Audiolibros</div></div>',
      )
      categsMenuBox[0]["libros"].unshift(audioLibrosBtn[0])
      audioLibrosBtn[0].onclick = function () {
        var item = document.createElement("div")
        item.className = "cell 23_-14 cvLD"
        panelSocial.clickSobreItem(item, "libros", that, { extra_labels: 1 })
      }

      var dicciosBtn = $(
        '<div class="categsMenuButton categ_libros cat_diccionarios"><div class="categ_icon"></div><div class="categ_label">Diccionarios</div></div>',
      )
      categsMenuBox[0]["libros"].unshift(dicciosBtn[0])
      dicciosBtn[0].onclick = function () {
        var item = document.createElement("div")
        item.className = "cell 16_0 cvLD"
        panelSocial.clickSobreItem(item, "libros", that, {
          extra_labels: 1,
          doDiccsQuery: 1,
        })
      }

      var autoresBtn = $(
        '<div class="categsMenuButton categ_libros cat_autores"><div class="categ_icon"></div><div class="categ_label">Autores</div></div>',
      )
      categsMenuBox[0]["libros"].unshift(autoresBtn[0])
      autoresBtn[0].onclick = function () {
        var item = document.createElement("div")
        item.className = "cell 3_0,1,0 cvLD"
        panelSocial.clickSobreItem(item, "libros", that, {
          extra_labels: 1,
          noBanner: true,
        })
      }

      var frasesRandomBtn = $(
        '<div class="categsMenuButton categ_libros cat_frases_random"><div class="categ_icon"></div><div class="categ_label">Frases aleatorias</div></div>',
      )
      categsMenuBox[0]["libros"].unshift(frasesRandomBtn[0])
      frasesRandomBtn[0].onclick = function () {
        panelSocial.screenSaver({ withFrases: true })
      }

      var contraInteligenceBtn = $(
        '<div class="categsMenuButton categ_libros cat_contrainteligence"><div class="categ_icon"></div><div class="categ_label">Contrainteligencia artificial</div></div>',
      )
      categsMenuBox[0]["libros"].unshift(contraInteligenceBtn[0])
      contraInteligenceBtn[0].onclick = function () {
        panelSocial.screenSaver({
          withFrases: true,
          withMusic: true,
          combinedArt: true,
        })
      }

      //Boton Noticias. Editorial
      /*
        var editorialBtn = $('<div class="categsMenuButton">NOTICIAS. EDITORIAL</div>');
        if (ltotalUtils.checkPermiso("personaje")) {
            editorialBtn.append('<div class="btn_pescar_editorial" title="Crear nueva Noticia. Editorial"></div>');
            $(".btn_pescar_editorial", editorialBtn)[0].onclick = function(_ev) {
                _ev.stopPropagation();
                hideCategsMenu();
                fisher.newLooseNote();
            }
        }
        categsMenuBox[0]["libros"].unshift(editorialBtn[0]);
        editorialBtn[0].onclick = function() { panelSocial.openBookNotas(32, 12); }
        */

      //Botones particulares Musica
      var inspLibrosBtn = $(
        '<div class="categsMenuButton categ_musica cat_insplibros"><div class="categ_icon"></div><div class="categ_label">Inspirada en libros</div></div>',
      )
      categsMenuBox[0]["musica"].unshift(inspLibrosBtn[0])
      inspLibrosBtn[0].onclick = function () {
        var item = document.createElement("div")
        item.className = "cell 10_0 cvLD"
        panelSocial.clickSobreItem(item, "libros", that, {
          extra_labels: 1,
          noBanner: true,
          insp_libros: 1,
        })
      }

      var interpretesBtn = $(
        '<div class="categsMenuButton categ_musica cat_interpretes"><div class="categ_icon"></div><div class="categ_label">Intérpretes</div></div>',
      )
      categsMenuBox[0]["musica"].unshift(interpretesBtn[0])
      interpretesBtn[0].onclick = function () {
        var item = document.createElement("div")
        item.className = "cell 3_0,13,0 cvLD"
        panelSocial.clickSobreItem(item, "libros", that, {
          extra_labels: 1,
          noBanner: true,
        })
      }

      var compositoresBtn = $(
        '<div class="categsMenuButton categ_musica cat_compositores"><div class="categ_icon"></div><div class="categ_label">Compositores</div></div>',
      )
      categsMenuBox[0]["musica"].unshift(compositoresBtn[0])
      compositoresBtn[0].onclick = function () {
        var item = document.createElement("div")
        item.className = "cell 3_0,10,0 cvLD"
        panelSocial.clickSobreItem(item, "libros", that, {
          extra_labels: 1,
          noBanner: true,
        })
      }

      var musRandomBtn = $(
        '<div class="categsMenuButton categ_musica cat_music_random"><div class="categ_icon"></div><div class="categ_label">Música aleatoria</div></div>',
      )
      categsMenuBox[0]["musica"].push(musRandomBtn[0])
      musRandomBtn[0].onclick = function () {
        panelSocial.ewallMusic("MosaicBooks")
      }

      var openArtMusic = function () {
        panelSocial.screenSaver({ withArt: true, withMusic: true })
      }
      var openFotoMusic = function () {
        panelSocial.screenSaver({ withFoto: true, withMusic: true })
      }

      var artmusRandomBtn = $(
        '<div class="categsMenuButton categ_musica cat_art_music_random"><div class="categ_icon"></div><div class="categ_label">Arte y música aleatorios</div></div>',
      )
      categsMenuBox[0]["musica"].push(artmusRandomBtn[0])
      artmusRandomBtn[0].onclick = openArtMusic

      var fotomusRandomBtn = $(
        '<div class="categsMenuButton categ_musica cat_foto_music_random"><div class="categ_icon"></div><div class="categ_label">Fotografía y música aleatorios</div></div>',
      )
      categsMenuBox[0]["musica"].push(fotomusRandomBtn[0])
      fotomusRandomBtn[0].onclick = openFotoMusic

      //Botones particulares Arte
      categsMenuBox[0]["arte"] = []

      var paisesBtn = $(
        '<div class="categsMenuButton categ_arte cat_paises"><div class="categ_icon"></div><div class="categ_label">Por países</div></div>',
      )
      categsMenuBox[0]["arte"].unshift(paisesBtn[0])
      paisesBtn[0].onclick = function () {
        var item = document.createElement("div")
        item.className = "cell 6_0,3 cvLD"
        panelSocial.clickSobreItem(item, "libros", that, {
          extra_labels: 1,
          noBanner: true,
          paises: 1,
          queryArt: 1,
        })
      }

      var fotografiaBtn = $(
        '<div class="categsMenuButton categ_arte cat_fotografia"><div class="categ_icon"></div><div class="categ_label">Fotografía</div></div>',
      )
      categsMenuBox[0]["arte"].unshift(fotografiaBtn[0])
      fotografiaBtn[0].onclick = function () {
        var item = document.createElement("div")
        item.className = "cell 6_0,2 cvLD"
        panelSocial.clickSobreItem(item, "libros", that, {
          extra_labels: 1,
          noBanner: true,
          fotografia: 1,
          queryArt: 1,
        })
      }

      var inspLibrosArtBtn = $(
        '<div class="categsMenuButton categ_arte cat_insplibrosart"><div class="categ_icon"></div><div class="categ_label">Inspirado en libros </div></div>',
      )
      categsMenuBox[0]["arte"].unshift(inspLibrosArtBtn[0])
      inspLibrosArtBtn[0].onclick = function () {
        var item = document.createElement("div")
        item.className = "cell 6_0,1 cvLD"
        panelSocial.clickSobreItem(item, "libros", that, {
          extra_labels: 1,
          noBanner: true,
          insp_libros: 1,
          queryArt: 1,
        })
      }

      var artistasBtn = $(
        '<div class="categsMenuButton categ_arte cat_artistas"><div class="categ_icon"></div><div class="categ_label">Artistas</div></div>',
      )
      categsMenuBox[0]["arte"].unshift(artistasBtn[0])
      artistasBtn[0].onclick = function () {
        var item = document.createElement("div")
        item.className = "cell 3_0,6,0 cvLD"
        panelSocial.clickSobreItem(item, "libros", that, {
          extra_labels: 1,
          noBanner: true,
        })
      }

      var artmusRandomBtn2 = artmusRandomBtn.clone()
      var fotomusRandomBtn2 = fotomusRandomBtn.clone()
      artmusRandomBtn2[0].onclick = openArtMusic
      fotomusRandomBtn2[0].onclick = openFotoMusic
      categsMenuBox[0]["arte"].push(artmusRandomBtn2[0])
      categsMenuBox[0]["arte"].push(fotomusRandomBtn2[0])

      if (ltotalUtils.checkPermiso("adminarte")) {
        var arteAnotadoBtn = $(
          '<div class="categsMenuButton categ_arte cat_arte_anotado"><div class="categ_icon"></div><div class="categ_label">Arte anotado</div></div>',
        )
        categsMenuBox[0]["arte"].push(arteAnotadoBtn[0])
        arteAnotadoBtn[0].onclick = function () {
          panelSocial.screenSaver({ arteAnotado: true })
        }
      }

      categsMenuBox.append(
        '<div class="categsMenuBoxContentScrollable"><div class="categsMenuBoxContent"></div></div>',
      )

      var toggling = false
      var currentService = ""
      categsMenuBox[0].scrolles = { libros: 0, musica: 0, arte: 0 }

      var scrollCB = function () {
        if (!toggling) {
          categsMenuBox[0].scrolles[currentService] = scrollableBox.scrollTop
          categsScroll.repaintContain()
        }
      }

      var scrollableBox = $(".categsMenuBoxContentScrollable", categsMenuBox)[0]
      var categsScroll = new ScrollSyc({
        hostDiv: categsMenuBox[0],
        scrollDiv: scrollableBox,
        claseScroll: "categsMenuScroll categsMenuScrollPart",
        position: "right",
        callback: scrollCB,
      })
      var scrollCont = categsScroll.getContain()
      $(scrollCont).find("*").addClass("categsMenuScrollPart")
      $(scrollCont).css({ top: "2%", height: "96%" })
      $(".boxScrollBtn", scrollCont).css({ "background-color": "transparent" })
      $(".scrollBtn", scrollCont).css({ "background-color": "#A7B0B7" })

      var binScrollSetts = { callback: scrollCB }
      bindScroll(scrollableBox, binScrollSetts)
      bindTouch(scrollableBox, {
        start: function (px, py) {
          $(this).stop()
        },
        move: function (dx, dy) {
          this.scrollTop += dy
        },
        end: function (DX, DY, DT) {
          if (DT < 400) {
            var st = this.scrollTop - DY * 2
            if (Math.abs(DY) > 0) {
              $(this).animate(
                { scrollTop: st },
                { duration: 500, easing: "easeOutQuart" },
              )
            }
          }
        },
      })

      categsMenuBox[0].categLabel = ""

      var btnsPilares = $([pilarLibros, pilarMusica, pilarArte])
      btnsPilares.each(function () {
        makeRoundButton(this)

        $(".squared", this).append($(".txtpilar", this))
        $(".right", this)[0].onclick = function (_ev) {
          _ev.preventDefault()
          _ev.stopPropagation()

          $(".categsMenuToggle", this.parentNode).trigger("click")
        }
      })

      btnsPilares.each(function () {
        var btn = $(this)
        var menuToggle = $('<div class="categsMenuToggle"></div>')

        $(".piece.squared", btn).append(menuToggle)

        menuToggle[0].onclick = function (_ev) {
          _ev.stopPropagation()

          var toggle = $(this)

          hideMenu()

          var categLabel = ""
          var pilarBtn = $(this).parents(".pilarBtn").eq(0)
          if (pilarBtn.hasClass("pilarlibros")) {
            categLabel = "libros"
          }
          if (pilarBtn.hasClass("pilarmusica")) {
            categLabel = "musica"
          }
          if (pilarBtn.hasClass("pilararte")) {
            categLabel = "arte"
          }
          currentService = categLabel
          $(".categsMenuBoxContent", categsMenuBox).html(
            categsMenuBox[0][categLabel],
          )

          var topCont = 0
          var leftCont = 0
          var widthCont = 0
          if (isSmartPhone) {
            topCont = 145
            widthCont = "100%"
          } else if (isTablet) {
            topCont = 135
            leftCont = boxPilars.offsetLeft
            widthCont = boxPilars.offsetWidth + 10 + "px"
          } else {
            topCont = 80
            leftCont = pilarLibros.offsetLeft
            widthCont =
              pilarArte.offsetLeft + pilarArte.offsetWidth - leftCont + "px"
          }
          categsMenuBox.css({
            top: topCont + "px",
            left: leftCont + "px",
            width: widthCont,
            height: "calc(100% - " + topCont + "px)",
          })

          $(scrollCont).css({ display: "block" })
          scrollableBox.scrollTop = categsMenuBox[0].scrolles[currentService]
          categsScroll.repaintContain()

          //La caja de las cetegorias que no crece mas de lo necesario
          var winH = $(window).height()
          var contH = winH - topCont
          var categH = 60
          var maxCategs = contH / categH
          var categsCount = categsMenuBox[0][categLabel].length
          if (categsCount < maxCategs) {
            var newH = categH * categsCount
            categsMenuBox.css({ height: newH + "px" })
          }

          $(".toggle_active", btnsPilares).removeClass("toggle_active")
          var btnParent = menuToggle.parent().parent()
          var roundeRight = $(".rounded.right", btnParent)
          roundeRight.addClass("toggle_active")
          menuToggle.addClass("toggle_active")

          if (
            categsMenuBox[0].categLabel == categLabel &&
            $(categsMenuBox).is(":visible")
          ) {
            roundeRight.removeClass("toggle_active")
            menuToggle.removeClass("toggle_active")
          }
          if (
            categsMenuBox[0].categLabel == categLabel ||
            !$(categsMenuBox).is(":visible")
          ) {
            toggling = true
            $(categsMenuBox).slideToggle(function () {
              if ($(categsMenuBox).is(":visible")) {
                scrollableBox.scrollTop =
                  categsMenuBox[0].scrolles[currentService]
                categsScroll.repaintContain()
                toggling = false
              }
            })
          }
          categsMenuBox[0].categLabel = categLabel
        }

        //Click del pilar
        $(".left, .squared", this).click(function () {
          var serv = "libros"
          var papaClass = $(this).parents(".pilarBtn")[0].className
          if (papaClass.indexOf("musica") > -1) {
            serv = "musica"
          }
          if (papaClass.indexOf("arte") > -1) {
            serv = "arte"
          }
          that.clickSobrePilar(serv)
        })
      })

      placeMainBtns()
    }

    this.makeRoundButton = function (_btn) {
      makeRoundButton(_btn)
    }

    function makeRoundButton(_btn) {
      var htmlPieces =
        '<div class="layer_rounded"><div class="piece rounded left"></div><div class="piece rounded right"></div><div class="piece squared"></div></div>'

      $(_btn).append(htmlPieces)
    }

    function hideCategsMenu(_extra) {
      var btnsPilares = $([pilarLibros, pilarMusica, pilarArte])
      $(".toggle_active", btnsPilares).removeClass("toggle_active")

      var doAnim = true
      if (_extra) {
        if (_extra.no_animate) {
          doAnim = false
        }
      }
      if ($(categsMenuBox).is(":visible")) {
        if (doAnim) {
          categsMenuBox.slideToggle()
        } else {
          categsMenuBox.css({ display: "none" })
        }
      }
    }

    function activateSearch() {
      if (!searchLT.touchbinded) {
        $(searchLT).on("touchstart", function () {
          $(this).focus()
        })
        searchLT.touchbinded = true
      }

      $(boxSearchMos).slideToggle(function () {
        boxSearchMos.isReady = true
        $(searchLT).trigger("touchstart")
      })

      if (ltotalOS.isIOS) {
        $(searchLT).trigger("touchstart")
      }
    }

    function deActivateSearch() {
      $(".autocomplete-suggestions").hide()
      $(".suggest_home_box").hide()
      $(boxSearchMos).slideToggle(function () {
        boxSearchMos.isReady = false
      })
    }

    this.buscarLT = function (_wordsToSearch, _extra) {
      buscarLT(_wordsToSearch, _extra)
    }

    function buscarLT(_wordsToSearch, _extra) {
      $(searchLT).blur()
      var words = $.trim($(searchLT).val())

      if (_wordsToSearch && typeof _wordsToSearch == "string") {
        words = _wordsToSearch
      }

      if ($(boxSearchMos).is(":visible") && boxSearchMos.isReady) {
        deActivateSearch()
      }

      if (words.length > 0) {
        var extraparams = { expandRelas: 1 }
        jQuery.extend(extraparams, mosaico.SycCredentials)

        try {
          var xhr = ltotalOS.loadData("buscar", "", words, extraparams)

          searchWords = words

          $(gridBoxSmall).detach()
          LPRemoveLabelAtTop()

          deSelectPilares()

          pilarSelected = "buscar"
          servicio = "libros"

          $(boxSearchMsg).css({ display: "block" }).text("Buscando...")

          if (xhr) {
            xhr.done(function (html) {
              //Estadistica de buscador en interfaz eDesk
              ltotalOS.statistics(84, words)

              var proc = $("#proceso").html(html)
              var cellsc = $(".cell", proc).length

              filterBuscar(proc)

              var msgHTML =
                '<span class="items_counter">' + cellsc + "</span> resultados"
              if (!isSmartPhone) {
                msgHTML +=
                  ' de "' + words + '" en el catálogo general de la Biblioteca'
              }
              $(boxSearchMsg).css({ display: "block" }).html(msgHTML)
              $(boxMosaic).addClass("withSearchMsg")

              var itemc = proc.children().length

              LPWrapItems(proc[0].children)

              var labels = $(".cell_label", proc)
              labels.each(function () {
                var lbl = this
                var items = $(lbl).nextUntil(".cell_label")
                items.each(function () {
                  this.lbl = lbl
                })

                lbl.items = items
                items.detach()
                if (items.length > 30) {
                  lbl.fullItems = items
                  lbl.items = items.slice(0, 30)
                }
                $(lbl).after(lbl.items)
              })

              var backNavig = true
              if (_extra && _extra.backNavig == false) {
                backNavig = false
              }

              mosaico.createMosaic2(
                proc[0].children,
                servicio,
                pilarSearch,
                0,
                { backNav: backNavig },
              )
              mosaico.deleteMosaicCache("buscar_pilarSearch_0")
            })

            panelSocial.createLoaderItem(pilarSearch, xhr, null)
          }
        } catch (e) {}
      }
    }

    function searchTXT() {
      var label = this
      var wds = $(".wds_lbl", label).text()

      gridBoxSmall.searchTXTWords = wds
      searchTXTWords = wds

      var extra = {}

      var id_lib_exception = label.className.match(/id_lib_exception_\d+/)
      if (id_lib_exception) {
        extra.id_lib_exception = id_lib_exception[0].match(/\d+/)[0]
      }

      var id_aut_exception = label.className.match(/id_aut_exception_\d+/)
      if (id_aut_exception) {
        extra.id_aut_exception = id_aut_exception[0].match(/\d+/)[0]
      }

      jQuery.extend(extra, mosaico.SycCredentials)

      var xhr = ltotalOS.loadData("buscartexto", "txtsearch", wds, extra)
      if (xhr) {
        xhr.done(function (htmlData) {
          if (panelSocial.selectedBook && settings.modePilars) {
            return null
          }

          //Estadistica de busqueda de texto en interfaz eDesk
          ltotalOS.statistics(85, wds)

          if ($.trim(htmlData).length > 0) {
            //Actualiza el contador de resultados
            var count = 0
            var proc = $("#proceso").html(htmlData)
            $(".cell", proc).each(function () {
              count += parseInt(
                this.className.match(/counter_\d+/)[0].match(/\d+/)[0],
              )
            })
            var itemCounter = $(".items_counter", boxSearchMsg)
            itemCounter.text(parseInt(itemCounter.text()) + count)

            filterBuscar(proc)

            //Orden de los items de la seccion de libros
            var labelLibros = $(".cell_label.tipo_item_txtsearch", proc)
            var cellsArray = labelLibros.nextUntil(
              ".cell_label.tipo_item_16, .cell_label.tipo_item_51",
            )
            cellsArray.sort(function (x, y) {
              var cx = parseInt(
                x.className.match(/counter_\d+/)[0].match(/\d+/)[0],
              )
              var cy = parseInt(
                y.className.match(/counter_\d+/)[0].match(/\d+/)[0],
              )
              if (cy < cx) {
                return -1
              }
              if (cy > cx) {
                return 1
              }
              return 0
            })
            labelLibros = labelLibros.detach()
            cellsArray = cellsArray.detach()
            var restOfChildren = proc.children().detach()
            proc.append(labelLibros)
            proc.append(cellsArray)
            proc.append(restOfChildren)
            //Fin. Orden de los items de la seccion de libros

            LPWrapItems(proc.children())

            var labels = $(".cell_label", proc)
            labels.each(function () {
              var lbl = this
              var items = $(lbl).nextUntil(".cell_label")
              items.each(function () {
                this.lbl = lbl
              })

              lbl.items = items
              items.detach()
              if (items.length > 30) {
                lbl.fullItems = items
                lbl.items = items.slice(0, 30)
              }
              $(lbl).after(lbl.items)
            })

            $(label).replaceWith(proc.children())

            labels.each(function () {
              configureLabel(this)
            })
            //diagramCellLabels();

            //Trata de ajustar el último slider para que no se corte
            setTimeout(function () {
              configHorizGridBoxes()
            }, 500)
          } else {
            $(".tag_label", label).html(
              'No hay resultados para <span class="wds_lbl">"' +
                wds +
                '"</span> en las páginas de los Libros',
            )
          }
        })

        panelSocial.createLoaderItem(label, xhr, null)
      }
    }

    function filterBuscar(_proc) {
      //Filtra items de la busqueda segun reglas arbitrarias

      //El libro de la DIAN 4281 solo se ve en www.syc.com.co
      var libDian = $(".1_4281, .4_4281\\,4348", _proc)
      if (libDian[0] && location.href.indexOf("www.syc.com.co") == -1) {
        libDian.remove()
      }
    }

    function closeSearch() {
      $(boxSearchMsg).css({ display: "none" })
      $(boxMosaic).removeClass("withSearchMsg")
    }

    //Asigna etiquetas a elementos tipo Libro y Musica
    function booksHoverLabel(item) {
      if (item) {
        var $item = $(item)

        //Botones de accion contextuales

        //Borrar libro de bitacora de lectura reciente
        if ($item.hasClass("erase_bitac")) {
          createBtnEraseBitac(item)
        }

        //Borrar libro de mis favoritos
        if (item.erase_favorite) {
          createBtnEraseFavorite(item)
        }

        //Borrar foto promo libro de mis favoritos
        if (item.erase_foto_promo_libro) {
          createBtnEraseFotoPromoLibro(item)
        }

        //Borrar libro regalo de mis favoritos
        if (item.erase_regalo_libro) {
          createBtnEraseRegaloLibro(item)
        }
      }
    }

    //Asigna etiquetas a elementos tipo Imagenes
    function imagesHoverLabel(item) {
      var imgin = $(".art_thumbnail", item)[0]
      if (imgin) {
        //Borrar imagen de bitacora de lectura reciente
        if ($(item).hasClass("erase_bitac")) {
          createBtnEraseBitac(item)
        }

        //Borrar imagen de mis favoritos
        if (item.erase_favorite) {
          createBtnEraseFavorite(item)
        }
      }
    }

    // Hover de un objeto.
    function hoverElement(item) {
      if (item.hoverElementEv) {
        return null
      }

      var cellid = getCellID(item)

      var tipo_item = cellid[0]
      var id_item = cellid[1]

      var proyValido = tipo_item == 27 && id_item > 0

      var preZoom = function () {
        if (that.hoveredMosaicElement != item) {
          destroyHoverLabel(that.hoveredMosaicElement)
        }
        clearTimeout(timerTouchingItem)
        timerTouchingItem = setTimeout(zoomItem, 800)
      }

      var zoomItem = function () {
        if ($(item).parent().hasClass("zoomed_item")) {
          return null
        }

        that.hoveredMosaicElement = item

        var w = item.parentNode.offsetWidth
        var l = parseInt($(item).parent().css("left"))
        var r = l + w
        item.parentNode.leftMosa = l + "px"

        var offsetw = (0.8 * w) / 2
        var lf = l - offsetw
        var rf = r + offsetw
        if (lf < 0) {
          l = l + offsetw
          $(item)
            .parent()
            .animate({ left: l + "px" }, 200)
        }
        if (rf > gridBoxSmall.offsetWidth) {
          l = l - offsetw
          $(item)
            .parent()
            .animate({ left: l + "px" }, 200)
        }
        $(item).parent().css({
          transition: "transform .2s",
          transform: "scale(1.8)",
          "z-index": "1",
        })
        $(item).parent().prepend('<div class="caratula_back_cont"></div>')
        $(item).parent().addClass("zoomed_item")

        if (isTouch) {
          $(item).parent()[0].justZoomed = true
        }
      }

      var reduceItem = function (e) {
        var isEraseBtn = $(e.relatedTarget).is(
          ".erase_bitac_btn, .erase_favorite_btn, .erase_foto_promo_libro_btn, .erase_regalo_libro_btn",
        )
        if (!isEraseBtn) {
          destroyHoverLabel(item)
        }
      }

      if (
        tipo_item == 1 ||
        tipo_item == 3 ||
        tipo_item == 4 ||
        tipo_item == 10 ||
        tipo_item == 17 ||
        proyValido ||
        tipo_item == 32 ||
        tipo_item == 45 ||
        tipo_item == 51 ||
        tipo_item == "mydownld"
      ) {
        if (isTouch) {
          bindTouch(item, bindTouchHandleHoverLabel(item, "BOOK", zoomItem))
        } else {
          item.onmouseover = function () {
            booksHoverLabel(item)
            //preZoom();
          }
          item.onmouseout = function (e) {
            //reduceItem(e);
          }
        }
      }

      if (tipo_item == 6) {
        if (isTouch) {
          bindTouch(item, bindTouchHandleHoverLabel(item, "IMAGE", zoomItem))
        } else {
          item.onmouseover = function () {
            imagesHoverLabel(item)
            //preZoom();
          }
          item.onmouseout = function (e) {
            //reduceItem(e);
          }
        }
      }

      item.hoverElementEv = true
    }

    function createBtnEraseBitacLabel(_label, _tipo) {
      var elemBtcLabel = document.createElement("div")
      $(elemBtcLabel).addClass("erase_label_bitac_btn")

      var recienMsg = {
        1: "todos los libros",
        6: "todas las imágenes",
        10: "todas las piezas musicales",
        45: "todas las palabras",
        51: "todos los videos",
      }

      elemBtcLabel.title = "Eliminar " + recienMsg[_tipo] + " recientes"

      $(".erase_label_bitac_btn", _label).remove()
      $(_label).prepend(elemBtcLabel)

      elemBtcLabel.onclick = function (ev) {
        if (
          _label.items.length == 1 &&
          _label.items[0].className.indexOf("minibookhelp") > -1
        ) {
          return
        }

        ev.preventDefault()
        ev.stopPropagation()

        var dialogo = new DialogueLM({
          show: true,
          ModoBtn: true,
          btnClose: true,
          btnCancelar: "Cancelar",
          btnAceptar: "Aceptar",
          texto: "¿Desea eliminar " + recienMsg[_tipo] + " recientes?",
          fnAceptar: function () {
            if (_tipo == 45) {
              _tipo = 16
            }

            $.each(_label.items, function () {
              if ($(this).hasClass("mydownld")) {
                var idDld = getCellID(this)[1]
                var docID = idDld
                var accion = "DeleteRecentBook"
                if (!$(this).hasClass("format_epub")) {
                  docID = idDld.replace("pdf", "")
                  accion = "DeleteRecentPDFDocumento"
                }

                var cmdObj = {
                  Module: "OfflineApp",
                  Action: accion,
                  Parameters: ["" + docID],
                }
                panelSocial.executeNative(cmdObj)
              }
            })

            var url = "/ltotal/lector/borrar_bitacora.jsp"
            var queryURL = ltotalOS.getPostURL(url)
            var params = {
              idLibro: "-1",
              idTrad: "-1",
              tipo_comp: _tipo,
              palabra: "",
              ltotalurl: url,
              caso: "2",
            }
            jQuery.extend(params, that.SycCredentials)
            params = $.trim(decodeURIComponent($.param(params)))
            $.post(queryURL, params).done(function () {
              reloadLabel(_label)
            })
          },
          fnCancelar: function () {},
        })

        if (isSmartPhone) {
          $(".boxDialogue", dialogo.getContain()).css({
            width: "100%",
            padding: "20px 0px 0px",
          })
        }
      }
    }

    function destroyHoverLabel(parent) {
      //$(boxHoverLabelMosaic).detach();
      clearTimeout(timerTouchingItem)

      if ($(parent).parent().hasClass("zoomed_item")) {
        var cssObj = { transform: "", "z-index": "" }
        if (parent && parent.parentNode && parent.parentNode.leftMosa) {
          cssObj.left = parent.parentNode.leftMosa
        }
        $(parent).parent().css(cssObj)
        $(".caratula_back_cont", $(parent).parent()).remove()
        $(parent).parent().removeClass("zoomed_item")
        $(parent).parent()[0].justZoomed = false

        //setTimeout(function() {
        //if (!panelSocial.selectedBook) {
        //    that.createMosaic(null);
        //}
        //}, 300);
      }
    }

    this.destroyHoverLabel = function (parent) {
      destroyHoverLabel(parent)
    }

    function createBtnEraseBitac(item) {
      if (!btnHoverEraseBitac) {
        btnHoverEraseBitac = document.createElement("div")
        $(btnHoverEraseBitac).addClass("erase_bitac_btn")
        btnHoverEraseBitac.title = "Eliminar de mis lecturas recientes"

        btnHoverEraseBitac.onclick = deleteBitacora
      }
      $(item).append(btnHoverEraseBitac)
    }

    function createBtnEraseFavorite(item) {
      if (!btnHoverEraseFavorite) {
        btnHoverEraseFavorite = document.createElement("div")
        $(btnHoverEraseFavorite).addClass("erase_favorite_btn")
        btnHoverEraseFavorite.title = "Eliminar de mis favoritos"

        btnHoverEraseFavorite.onclick = deleteFavorite
      }
      $(item).append(btnHoverEraseFavorite)
    }

    function createBtnEraseFotoPromoLibro(item) {
      if (!btnHoverEraseFotoPromoLibro) {
        btnHoverEraseFotoPromoLibro = document.createElement("div")
        $(btnHoverEraseFotoPromoLibro).addClass("erase_foto_promo_libro_btn")
        btnHoverEraseFotoPromoLibro.title = "Eliminar de mis favoritos"

        btnHoverEraseFotoPromoLibro.onclick = deleteFotoPromoLibro
      }
      $(item).append(btnHoverEraseFotoPromoLibro)
    }

    function createBtnEraseRegaloLibro(item) {
      if (!btnHoverEraseRegaloLibro) {
        btnHoverEraseRegaloLibro = document.createElement("div")
        $(btnHoverEraseRegaloLibro).addClass("erase_regalo_libro_btn")
        btnHoverEraseRegaloLibro.title = "Eliminar de mis favoritos"

        btnHoverEraseRegaloLibro.onclick = deleteRegaloLibro
      }
      $(item).append(btnHoverEraseRegaloLibro)
    }

    function bindTouchHandleHoverLabel(item, elem, zoomItem) {
      return {
        start: function (px, py, ev) {
          if (isTouchingItem) {
            return null
          }

          clearTimeout(timerTouchingItem)
          isTouchingItem = true

          if (that.hoveredMosaicElement != item) {
            destroyHoverLabel(that.hoveredMosaicElement)
          }

          timerTouchingItem = setTimeout(function () {
            if (isTouchingItem) {
              clearTimeout(timerDestroyHoverLabel)

              ev.preventDefault()
              ev.stopPropagation()

              if (elem == "BOOK") {
                booksHoverLabel(item)
              }

              if (elem == "IMAGE") {
                imagesHoverLabel(item)
              }

              //zoomItem();
            }
          }, 800)
        },
        move: function (dx, dy) {
          clearTimeout(timerTouchingItem)
        },
        end: function (DX, DY, DT, ev) {
          isTouchingItem = false
          setTimeout(function () {
            destroyHoverLabel(item)
          }, 200)
        },
      }
    }

    function createCaratulaBanner(_bnnr, _opts) {
      var general = true

      if (!_bnnr || !$(_bnnr).hasClass("caratula_banner")) {
        return null
      }

      if ($(_bnnr).hasClass("banner_destacados")) {
        mosaicBanner.createMosaicBannerDestacados(_bnnr, _opts)
        general = false
      }
      if (general) {
        mosaicBanner.createMosaicBanner(_bnnr, _opts, gridBox, that)
      }
    }

    function createCaratulaDashboard(_dash, _opts) {
      ltotalUtils.loadScript("/estaticosED/files/js/ltotal/panelDashboard.js")

      panelDashboard.createMosaicDashboard(_dash, _opts ? _opts : {})
    }

    this.setMosaicCache = function (_opts) {
      //Cachea el estado del mosaico
      if (lastPilarItemSelected) {
        if (
          gridBoxSmall.hasChildNodes() &&
          !$(gridBoxSmall).hasClass("no_cache")
        ) {
          var cacheExcept = { libros_dashboard_dashboard_x_dashgen_1: true }
          var st = gridBoxSmall.scrollTopValue
          var html = $(gridBoxSmall).detach()
          if (!cacheExcept[lastPilarItemSelected]) {
            mosaicCache[lastPilarItemSelected] = [html, st]
          }

          if (_opts.backNav) {
            that.setBackNavigation()
          }
        }

        if ($(gridBoxSmall).hasClass("no_cache")) {
          $(gridBoxSmall).remove()
        }
      }
    }

    this.getMosaicCache = function (_pilar, _item) {
      var itemID = getCellID(_item).join("_")
      var xParms = _item.className.match(/x_\w+_\w+/g)
      $.each(xParms, function () {
        itemID += "_" + this
      })

      var cache = mosaicCache[_pilar + "_" + itemID]
      return cache
    }

    this.deleteMosaicCache = function (_idItem) {
      var cache = mosaicCache[_idItem]
      if (cache) {
        /*if (typeof cache[0] == "object" && cache[0].hasClass("gridBoxSmall")) {
                cache[0].remove();
            }*/
        delete mosaicCache[_idItem]
      }
    }

    this.setBackNavigation = function () {
      //Controla que no se repita el mismo item seguido en la hitoria
      if (mosaicNavigation.length > 0) {
        var last = mosaicNavigation[mosaicNavigation.length - 1]
        if (last[0] == lastPilarItemSelected) {
          return null
        }
      }

      mosaicNavigation.push([
        lastPilarItemSelected,
        lastServiceSelected,
        lastItemSelected,
      ])
      $(backMosaic).css({ display: "block" })

      history.pushState(1, null, null)

      if (settings.backNavigationFunc) {
        settings.backNavigationFunc()
      }
    }

    function doBackNavigation() {
      LPRemoveLabelAtTop()

      var last = mosaicNavigation.pop()
      if (last) {
        var cacheAddr = last[0]

        if (cacheAddr == "item_palabra_flex") {
          goHome()
          return true
        }

        pilarSelected = cacheAddr.split("_")[0]
        servicio = last[1]
        var item = last[2]

        var cache = mosaicCache[cacheAddr]
        if (cache) {
          var html = cache[0]
          var mosaicTop = cache[1]
          mosaico.createMosaic2(html, servicio, item, mosaicTop, {
            backNav: false,
          })

          configHorizGridBoxes()
        }

        if (mosaicNavigation.length == 0) {
          if (settings.endBackNavigationFunc) {
            settings.endBackNavigationFunc()
          }
        }

        return true
      }
      return false
    }

    this.getBackNavigation = function () {
      if (!settings.modePilars) {
        return doBackNavigation()
      }

      //Cuando se esta visualizando un libro en escritorio, restaura el ultimo mosaico
      var gridB = $(".gridBox", boxMosaic)[0]
      if (!gridB) {
        restoreLastMosaic()
        return true
      }

      //modalviewer
      var mdLT = $(".modalViewerLT", panelSocial.bodyDiv)
      if (mdLT[0]) {
        history.pushState(1, null, null)
        $(".closeModalViewer", mdLT).trigger("click")
        return true
      }

      //Cerrar visor de imagenes
      var bvi = $(".boxViewerImg", panelSocial.bodyDiv)
      if (bvi[0]) {
        $(".closeViewer", bvi).trigger("click")
        return true
      }

      //diccionario
      var dicctotal = $("#dicc_total")
      if (dicctotal[0]) {
        $(".control.close", dicctotal).trigger("click")
        return true
      }

      if (isTouch && $(boxMosaicFull).is(":visible")) {
        //Morphology
        var korpuz = panelSocial.selectedBook.corpus
        if (korpuz && korpuz.activated) {
          korpuz.close()
          return true
        }

        $(boxMosaicFull).css({ display: "none" }).empty()
        $(boxTabs).css({ display: "none" }).empty()
        restoreLastMosaic()
        history.pushState(1, null, null)
        return true
      }

      var last = doBackNavigation()
      if (last) {
        deSelectPilares()
        $(".pilar" + pilarSelected, boxBread).addClass("pilarSelec")
        $(".pilar" + pilarSelected, boxPilars).addClass("pilarSelec")

        if (mosaicNavigation.length == 0) {
          resetBackNavigation()
        }

        return true
      }

      return false
    }

    this.resetCache = function () {
      resetCache()
    }

    function resetCache() {
      mosaicCache = []
    }

    this.resetBackNavigation = function () {
      resetBackNavigation()
    }

    function resetBackNavigation() {
      mosaicNavigation = []
      $(backMosaic).css({ display: "" })
    }

    this.getSearchWords = function () {
      $(searchLT).val(searchWords)
      return searchWords
    }

    this.getSearchTXTWords = function () {
      return gridBoxSmall.searchTXTWords
    }

    function shuffleArray(a) {
      var j, x
      for (var i = a.length; i; --i) {
        j = Math.floor(Math.random() * i)
        x = a[i - 1]
        a[i - 1] = a[j]
        a[j] = x
      }
      return a
    }

    function diagramCellLabels() {
      if (!gridBoxSmall) {
        return
      }

      gridBoxSmall.cell_labels = []
      $(".cell_label", gridBoxSmall).each(function (il, la) {
        gridBoxSmall.cell_labels.push(la)
        if (il == 0) {
          var papaModal = $(la).parents(".modalViewerLT")[0]
          var mt0 = isTouch ? 130 : 0
          if (papaModal) {
            mt0 = 0
          }
          $(la).css({ "margin-top": mt0 + "px" })
        } else {
          var prevItem = la.previousSibling
          if (
            $(la).is(".banners_banners, .mibliblio_0") ||
            $(prevItem).is(
              ".mibibliocell, .randombtncell, .horiGridBox, .caratula_banner",
            )
          ) {
            $(la).css({ "margin-top": "50px" })
          } else {
            $(la).css({ "margin-top": "" })
          }
        }

        //Margen Top de la primera linea de items
        if (
          !$(la).is(
            ".21_0, .banners_banners, .mibliblio_0, .24_1010, .24_66, .cells_semihidden",
          ) &&
          la.items &&
          la.items.length > 0
        ) {
          $(la.itemsTop).css({ "margin-top": "" })
          la.itemsTop = []

          //NOTA!!!!!! OJO!!!!
          //Utilizar gridBox.NIPAL y gridBox.NIDASH para alinear las palabras y los dashboards!!
          //-----------------------------------------------!!!!!!
          var nItems = gridBox.NI
          //if ($(la).hasClass("dashboard_0")) { nItems = gridBox.NIDASH; }

          for (var idx = 1; idx <= la.items.length; idx++) {
            if (idx <= nItems) {
              var itt = la.items[idx - 1]
              $(itt).css({ "margin-top": "20px" })
              la.itemsTop.push(itt)
            }
            if (idx > nItems) {
              break
            }
          }
        }
      })
    }

    function loadDataCellLabel(_label) {
      if ($(_label).hasClass("autotxtsearch")) {
        $(_label).removeClass("autotxtsearch")
        searchTXT.call(_label)
        return
      }

      if (!$(_label).hasClass("load_items")) {
        return
      }
      $(_label).removeClass("load_items")

      var data = getLabelID(_label)
      var tipo_item = data[0]
      var id_item = data[1]

      if (tipo_item == "mydownld") {
        var cmdObj = {
          Module: "OfflineApp",
          Action: "DownloadedBooks",
          Callback: "panelSocial.mosaico.downloadsMosaicCallback",
        }
        return panelSocial.executeNative(cmdObj)
      }

      var parentNode = _label.parentNode

      //Concatena parametros extra codificados con el patron /x_\w+_\w+/g
      var extraparams = { expandRelas: 1 }

      if ($(_label).hasClass("extra_labels")) {
        extraparams.extra_labels = 1
      }

      var extraData = _label.className.match(/x_\w+_\w+/g)
      if (extraData != null) {
        $.each(extraData, function () {
          var xd = this.replace("x_", "").split("_")
          extraparams[xd[0]] = xd[1]
        })
      }
      jQuery.extend(extraparams, mosaico.SycCredentials)

      try {
        var xhr = ltotalOS
          .loadData(servicio, tipo_item, id_item, extraparams)
          .done(function (htmlData) {
            var proc = $("#proceso").html(htmlData)

            var cells = $(".cell", proc).detach()
            var rec_novedad = $(".rec_novedad", proc).detach()

            if (cells.length == 0) {
              cells = $(".item_to_load", proc)
                .removeClass("item_to_load")
                .detach()
            }

            var labelVivo = true
            if (cells.length == 0) {
              labelVivo = false
            }

            //Elimina nuevos rotulos
            var newLabels = $(".cell_label", proc)
            if ($(_label).hasClass("kill_extra_cell_labels")) {
              newLabels.remove()
              newLabels = null
            }

            //Reemplaza rotulo por el nuevo
            if ($(_label).hasClass("replace_with_new_label") && labelVivo) {
              var newLink = newLabels[0].className.match(/link_.+_link/)
              if (newLink) {
                $(_label).addClass(newLink[0])
              }

              $(".tag_label", _label).html($(".tag_label", newLabels[0]).html())

              newLabels.remove()
              newLabels = null
            }

            if (newLabels) {
              newLabels
                .each(function () {
                  this.items = $(this).nextUntil(".cell_label").detach()
                })
                .detach()
            }

            //Cache del aleatorio de los items
            if ($(_label).hasClass("shuffle_items") && cells.length > 0) {
              shuffleArray(cells)
            }

            //Simula un "label" o "slider" infinito multiplicando los items originales
            if ($(_label).hasClass("multiply_infinite") && cells.length >= 10) {
              var origCells = cells.clone()
              for (var im = 1; im <= 20; im++) {
                cells = cells.add(origCells.clone())
              }
            }

            //Post-procesa items
            if (tipo_item == 18) {
              cells.addClass("erase_bitac")
              createBtnEraseBitacLabel(_label, id_item)

              if (panelSocial.hasOfflineBooks() && id_item == 1) {
                $(_label).addClass("mydownld")
                _label.itemsMixDownloads = cells
                cells = $()

                var cmdObj = {
                  Module: "OfflineApp",
                  Action: "RecentBooks",
                  Callback: "panelSocial.mosaico.recentBooksDownloadedCallback",
                }
                panelSocial.executeNative(cmdObj)
              }
            }

            if (tipo_item == 44) {
              cells.each(function () {
                //Los libros foto_promo y regalo_libro estan en la seccion de Mis Favoritos
                var cfp = hasClassRegex(/foto_promo_libro_\d+/, this)
                if (cfp) {
                  this.erase_foto_promo_libro = true
                }

                var crl = hasClassRegex(/regalo_libro_\d+/, this)
                if (crl) {
                  this.erase_regalo_libro = true
                }

                if (!cfp && !crl && !$(this).hasClass("lib_priv")) {
                  this.erase_favorite = true
                }
              })
            }

            $(_label)
              .removeClass("counter_0")
              .addClass("counter_" + cells.length)

            LPWrapItems(cells)
            cells.each(function () {
              this.lbl = _label
            })

            if (cells.length > 30) {
              _label.fullItems = cells
              cells = cells.slice(0, 30)
            }
            _label.items = cells

            $(_label).append(rec_novedad)
            $(_label).after(cells)

            //Adjunta nuevos rotulos
            if (newLabels && newLabels.length > 0) {
              newLabels.each(function () {
                //$(this).after(this.items);
                cells.last().after(this)
              })
              LPWrapItems(newLabels)
            }

            configureLabel(_label)
            diagramCellLabels()
            preloadItems(cells[0])

            if ($(_label).is(".banners_banners")) {
              mosaico.activateLabelAnim(_label)
            }
          })
        panelSocial.createLoaderItem(_label, xhr, {
          timeOutFN: function () {
            $(_label).addClass("load_items")
          },
        })
      } catch (e) {
        $(_label).addClass("load_items")
      }
    }

    function LPWrapItemCaratula(_item, _itemClase) {
      var div = document.createElement("div")
      div.className = _item.className
      div.style.display = "block"
      $(div).append($(_item).children())
      _item.className = _itemClase
      _item.appendChild(div)
    }

    function LPCountCounters(_items) {
      var counter = 0
      $.each(_items, function () {
        var c = this
        if (c) {
          var cClass = c.className.match(/counter_\d+/)
          if (cClass && cClass[0]) {
            counter += parseInt(cClass[0].match(/\d+/)[0])
          }
        }
      })
      return counter
    }

    function LPRemoveLabelAtTop() {
      $(gridBox.labelAtTop).remove()
      gridBox.labelAtTop = null
    }

    function LPPutLabelAtTop(_label) {
      LPRemoveLabelAtTop()

      var gBSmallParent =
        _label.parentNode && _label.parentNode.parentNode ? true : false

      //Solo pone labels si esta desplegado y el label tiene padre
      if (!$(_label).hasClass("cells_semihidden") && gBSmallParent) {
        gridBox.labelAtTop = $(_label).clone()[0]
        gridBox.labelAtTop.label = _label

        var topHeaderTop = $(boxTopHeader).hasClass("ontop")
        var mt0 = isTouch && !topHeaderTop ? 130 : 0
        if (isTouch && $(boxSearchMsg).is(":visible") && topHeaderTop) {
          mt0 += 22
        }

        $(gridBox.labelAtTop).css({
          position: "absolute",
          visibility: "visible",
          top: mt0 + "px",
          "margin-top": "0",
        })

        gridBox.labelAtTop.onclick = function () {
          $(_label).trigger("click")
        }

        //Boton de borrar Historial
        $(".erase_label_bitac_btn", gridBox.labelAtTop).click(function (_ev) {
          _ev.stopPropagation()
          $(".erase_label_bitac_btn", _label).trigger("click")
        })

        $(gridBox).parent().append(gridBox.labelAtTop)

        gridBox.labelAtTop.items = _label.items
      }
    }

    function LPShowLabelCounter() {
      var label = this
      var $label = $(label)
      var isLabelFlex = $label.is(".21_0")
      $label.removeClass("has_more_cells")

      var gbh = gridBox.offsetHeight
      var gbsh = gridBoxSmall.scrollHeight
      var counterDelta = 0
      var items = label.fullItems ? label.fullItems : label.items
      var NI = gridBox.NI
      var isLabelPaldic = $label.is(".18_45, .44_45")
      if (isLabelPaldic) {
        NI = gridBox.NIPAL
      }

      var sl = label.hGrid ? label.hGrid[0].scrollLeft : 0
      var st = gridBoxSmall.scrollTop
      var iw = items[0].offsetWidth + parseInt($(items[0]).css("margin-left"))
      var xh = isSmartPhone ? 80 : 70
      var ih = items[0].offsetHeight + xh

      //Calcula el valor del contador
      if ($label.hasClass("txtsearch")) {
        //Cuenta los contadores de cada item (paginas y palabras busqueda texto)
        var nItems = items.slice(0, NI)
        var counter = LPCountCounters(items)
        var counterN = LPCountCounters(nItems)
        counterDelta = counter - counterN

        //Descuenta segun el scroll horizontal
        if (counterDelta > 0) {
          $label.addClass("has_more_cells")

          //Descuenta segun el scroll horizontal
          if ($label.hasClass("cells_semihidden")) {
            var off = Math.ceil(sl / iw)
            nItems = items.slice(0, NI + off)
            counterN = LPCountCounters(nItems)
            counterDelta = counter - counterN
          } else {
            //Descuenta segun el scroll vertical
            if ($label.hasClass("cells_extended")) {
              var NIY = parseInt(gbh / ih) - 1
              var NIT = NI * NIY
              var ROUT = parseInt(st / ih)
              var NIOUT = NI * ROUT
              var NIOFF = NIOUT + NIT
              var itemsOff = items.slice(0, NIOFF)
              var nItemsOff = LPCountCounters(itemsOff)
              counterDelta = counter - nItemsOff

              //console.log("st " + st + " NIY " + NIY + " NIT " + NIT + " ROUT " + ROUT);
            } else {
              counterDelta = 0
            }
          }
        }
      } else {
        var counter = items.length
        counterDelta = counter - NI

        if (counterDelta > 0) {
          $label.addClass("has_more_cells")

          //Descuenta segun el scroll horizontal
          if ($label.hasClass("cells_semihidden")) {
            var off = sl / iw
            counterDelta -= off
          } else {
            //Descuenta segun el scroll vertical
            if ($label.hasClass("cells_extended")) {
              var off = NI * parseInt(st / ih)
              counterDelta = counter - off
            } else {
              counterDelta = 0
            }
          }
        }
      }

      var tag_folder = $(".tag_folder", label)
      var tag_see_more = $(".tag_see_more", label)
      var tag_see_more_top = gridBox.labelAtTop
        ? $(".tag_see_more", gridBox.labelAtTop)
        : $("<div></div>")

      if ($label.hasClass("has_more_cells")) {
        tag_folder.css({ visibility: "" })
      } else {
        tag_folder.css({ visibility: "hidden" })
      }

      var cds = parseInt(("" + counterDelta).split(".")[0])
      if (cds > 0) {
        $label.addClass("has_more_cells")
        tag_see_more.css({ visibility: "" })

        var tagTxt = isSmartPhone ? cds + " más" : "Ver " + cds + " más"
        tag_see_more.text(tagTxt)

        if ($label.hasClass("cells_extended") && gridBox.labelAtTop) {
          tag_see_more_top.css({ visibility: "" }).text(tagTxt)
        }
      } else {
        tag_see_more.css({ visibility: "hidden" })

        if ($label.hasClass("cells_extended") && gridBox.labelAtTop) {
          tag_see_more_top.css({ visibility: "hidden" })
        }
      }

      if (isLabelFlex && $.trim($(".tag_label", label).text()).length == 0) {
        tag_see_more.css({ visibility: "hidden" })
        tag_see_more_top.css({ visibility: "hidden" })
      }
    }

    function LPClickFlexWord() {
      var cellid = getCellID(this)
      var tItem = cellid[0]
      var idItem = cellid[1]

      var elem = this
      var papa = elem.parentNode
      var thisLabel = papa.lbl
      $(thisLabel.cellSelected).removeClass("cell_selected")
      $(elem).addClass("cell_selected")
      thisLabel.cellSelected = elem

      //Repliega el label
      if (!$(thisLabel).hasClass("cells_semihidden")) {
        $(thisLabel).trigger("click")

        setTimeout(function () {
          $(thisLabel).next()[0].scrollLeft =
            papa.offsetLeft - $(window).width() / 2 // + (papa.offsetWidth);
        }, 200)
      }

      var horiGrid = $(thisLabel).next()
      var elemsToRemove = horiGrid.nextUntil()

      var extraparams = {}
      var extraData = elem.className.match(/x_\w+_\w+/g)
      $.each(extraData, function () {
        var xd = this.replace("x_", "").split("_")
        extraparams[xd[0]] = xd[1]
      })
      var xhr = ltotalOS.loadData("libros", tItem, idItem, extraparams)
      if (xhr) {
        panelSocial.createLoaderItem(this, xhr, null)

        xhr.done(function (htmlData) {
          var proc = $("#proceso").html(htmlData)

          LPWrapItems(proc.children())

          var labels = $(".cell_label", proc)
          labels.each(function () {
            var lbl = this
            var items = $(lbl).nextUntil(".cell_label")
            items.each(function () {
              this.lbl = lbl
            })

            lbl.items = items
            items.detach()
            if (items.length > 30) {
              lbl.fullItems = items
              lbl.items = items.slice(0, 30)
            }
            $(lbl).after(lbl.items)
          })

          horiGrid.after(proc.children())
          elemsToRemove.remove()

          labels.each(function () {
            configureLabel(this)
          })

          gridBoxSmall.scrollTo(0, thisLabel.offsetTop)

          if (mosaicNavigation.length == 0) {
            mosaicNavigation.push([
              "item_palabra_flex",
              lastServiceSelected,
              "item_palabra_flex",
            ])
            $(backMosaic).css({ display: "block" })
            history.pushState(1, null, null)
          }

          ltotalOS.timeStats({ sumSegs: 3 })
        })
      }

      //Estadistica de clicks a las pildoras de Generos y Tematicas
      var filtroID = elem.className.match(
        /x_(filtrogenero|audiolibsgenero)_\d+/,
      )
      filtroID =
        filtroID && filtroID[0] ? " " + filtroID[0].replace("x_", "") : ""
      ltotalOS.statistics(89, tItem + "_" + idItem + filtroID)
    }

    function LPWrapItems(_items) {
      $.each(_items, function () {
        var item = this
        var $item = $(item)
        if ($item.hasClass("cell_palabra_flex")) {
          LPWrapItemCaratula(item, "caratula_palabra_flex")
          $(".cell", item)[0].onclick = LPClickFlexWord

          var nc = $item.text().length
          var px = nc < 18 ? 12 : 10
          var wx = nc * px < 280 ? nc * px : 280
          $item.css({ width: wx + "px" })
        } else {
          if ($item.hasClass("cell")) {
            item.onclick = function () {
              panelSocial.clickSobreItem(this, servicio, mosaico)
            }

            hoverElement(item)
          }
        }

        if (!item.observed) {
          if ($item.hasClass("cell_label")) {
            labelsObserver.observe(item)
          } else {
            itemsObserver.observe(item)
          }
          item.observed = true
        }
      })
    }

    this.LPWrapItems = function (_items) {
      LPWrapItems(_items)
    }

    function postProcPortadas(es) {
      var esAnotador = ltotalUtils.checkPermiso("anotador,grupoinvestigacion")
      var rnd =
        !isTouch && esAnotador
          ? "?v=" + ("" + Math.random()).replace(".", "")
          : ""

      for (var i = 0; i < es.length; i++) {
        var e = es[i]
        var $e = $(e)

        $(".label", e).each(function () {
          var labelName = $(this).attr("labelname")
          $e.attr(labelName, $(this).detach()[0].value)
        })

        var cara = $(".caraSlider", e).remove()
        if (cara[0]) {
          $e.css({ "background-image": "url(" + cara.attr("src") + rnd + ")" })
        }

        $(".art_thumbnail", e).css({ width: "", height: "", margin: "" })

        //Contadores
        var counter = e.className.match(/counter_\d+/)
        if (counter) {
          var count_tag = document.createElement("div")
          count_tag.className = "tag_counter"
          count_tag.innerHTML = counter[0].match(/\d+/)[0]
          $e.append(count_tag)
        }

        //Cinta de recuerdo para los libros foto_promo
        if (hasClassRegex(/foto_promo_libro_\d+/, e)) {
          var rutaTape = ltotalOS.replaceRepoDir(
            "/testLtotal/CARATULAS/generic_covers/tapes/recuerdo_tape.png",
          )
          $(e).append(
            '<img class="recuerdo_tape" style="position:absolute; width:70%; height:40%; left:30%; top:60%;" src="' +
              rutaTape +
              '" />',
          )
        }

        //Cinta de regalo para los libros regalados
        if (hasClassRegex(/regalo_libro_\d+/, e)) {
          var rutaTape = ltotalOS.replaceRepoDir(
            "/testLtotal/CARATULAS/generic_covers/tapes/regalo_tape.png",
          )
          $(e).append(
            '<img class="regalo_tape" style="position:absolute; width:70%; height:40%; left:30%; top:60%;" src="' +
              rutaTape +
              '" />',
          )
        }

        if ($e.attr("label_cell_info")) {
          $(e.parentNode.lbl).addClass("label_cell_info")
          createBoxCellInfo($e)
        }

        if (!esAnotador) {
          $(".nopublico", e).remove()
        }
      }
    }

    function createBoxCellInfo(_e) {
      var tipo_item = getCellID(_e[0])[0]

      if ($(".boxCellInfo", _e)[0]) {
        return null
      }

      _e.append('<div class="boxCellInfo"></div>')
      var b = $(".boxCellInfo", _e)

      var formatAutor = function (_a) {
        var autor = _a
        var autorD = autor.split(",")
        if (autorD.length == 2) {
          var aa = $.trim(autorD[0])
          var nn = $.trim(autorD[1])
          autor = nn + " " + aa
        }
        return autor
      }

      var procRawName = function () {
        var autor = formatAutor(getLabel("label_autor_raw"))

        var papa = _e[0].lbl
        if (hasClassRegex(/x_librosautor_1/, papa)) {
          autor = $(".tag_label", papa)
            .text()
            .replace(/Libros\s+de\s+/, "")
        }

        b.append('<div class="bci_data">' + autor + "</div>")
      }

      var getLabel = function (_l) {
        return _e.attr(_l) ? _e.attr(_l) : ""
      }

      var procLabel = function (_l, _xc, _extra) {
        if (_l.length > 0) {
          b.append(
            '<div class="bci_data' +
              _xc +
              '">' +
              getTxtLabel(_extra, getLabel(_l)) +
              "</div>",
          )
        }
      }

      var getTxtLabel = function (_obj, _label) {
        var txtLabel = _label
        if (_obj && _obj.txtLabel) {
          txtLabel =
            _obj.txtAdd == "prepend"
              ? _obj.txtLabel + _label
              : _label + _obj.txtLabel
        }

        return txtLabel
      }

      if (tipo_item == 1 || tipo_item == 4) {
        procRawName()

        if ($(_e[0].lbl).hasClass("label_versiones")) {
          var labelTrad = "",
            txtIdioma = ""
          if (getLabel("label_autor") !== getLabel("label_traductor")) {
            txtIdioma = "Trad. al "
            labelTrad = "label_traductor"
          }

          procLabel("label_idioma", " odd", {
            txtLabel: txtIdioma,
            txtAdd: "prepend",
          })
          procLabel(labelTrad, "")
        } else {
          procLabel("label_genero", " odd")
          procLabel("label_year", " small")
        }
      }

      if (tipo_item == "mydownld") {
        procLabel("label_titulo", "")

        if (getLabel("label_titulo") != getLabel("label_autor_raw")) {
          procLabel("label_autor_raw", "")
        }
        procLabel("label_genero", " odd")
      }

      if (
        tipo_item == 3 ||
        tipo_item == 6 ||
        tipo_item == 10 ||
        tipo_item == 51
      ) {
        procRawName()
        procLabel("label_year", " odd")
      }

      if (tipo_item == 16) {
        procLabel("label_year", "")
      }

      if (tipo_item == 17 || tipo_item == 27) {
        var ar = getLabel("label_autor_rela")
        if (ar.length > 0) {
          b.append('<div class="bci_data">Relacionado a</div>')
          b.append('<div class="bci_data">' + formatAutor(ar) + "</div>")
        }
      }
    }

    function deSelectPilares() {
      closeSearch()

      $(".bookTab.active", boxTabs).removeClass("active")
      $(".pilarSelec", boxBread).removeClass("pilarSelec")
      $(".pilarSelec", boxPilars).removeClass("pilarSelec")
    }

    function restoreLastMosaic() {
      var rePaint = false
      if (panelSocial.settings.doARepaint) {
        rePaint = true
        panelSocial.settings.doARepaint = false
      }

      var cache = mosaicCache[lastPilarItemSelected]
      if (cache) {
        var html = cache[0]
        var mosaicTop = cache[1]
        mosaico.createMosaic2(
          html,
          lastServiceSelected,
          lastItemSelected,
          mosaicTop,
          { backNav: false, rePaint: rePaint },
        )

        configHorizGridBoxes()
      }
    }

    function configHoriGridBoxButtons(hGrid) {
      if (!isTouch) {
        if (!gridBox.horBtnLeft) {
          var clickHorizontalButtons = function () {
            var thGrid = this.hGrid
            var gsw = gridBox.offsetWidth
            var off = $(this).hasClass("btn_right") ? gsw : gsw * -1
            var sl = thGrid.scrollLeft + off

            $(thGrid).stop()
            $(thGrid).animate({ scrollLeft: sl }, 400, function () {
              checkHoriGridButtons(thGrid)
            })
          }

          var horBtnLeft = document.createElement("div")
          horBtnLeft.className = "horiz_btn btn_left"
          horBtnLeft.onclick = clickHorizontalButtons

          var horBtnRight = document.createElement("div")
          horBtnRight.className = "horiz_btn btn_right"
          horBtnRight.onclick = clickHorizontalButtons

          gridBox.horBtnLeft = horBtnLeft
          gridBox.horBtnRight = horBtnRight
        }

        hGrid.addEventListener(
          "mouseover",
          function (_ev) {
            var thGrid = $(_ev.target).hasClass("horiGridBox")
              ? _ev.target
              : $(_ev.target).parents(".horiGridBox")[0]

            var btnL = gridBox.horBtnLeft
            var btnR = gridBox.horBtnRight
            btnL.hGrid = thGrid
            btnR.hGrid = thGrid

            var topOff = $(thGrid.lbl).is(
              ".21_0, .banners_banners, .mibliblio_0, .25_32",
            )
              ? 30
              : 56
            var topBtn =
              thGrid.offsetTop -
              gridBoxSmall.scrollTop +
              thGrid.offsetHeight / 2 -
              topOff
            var btns = $([btnL, btnR])
            btns.detach()
            btns.css({ top: topBtn + "px" })

            checkHoriGridButtons(thGrid)
          },
          false,
        )
      }
    }

    function checkHoriGridButtons(hGrid) {
      var btnL = gridBox.horBtnLeft
      var btnR = gridBox.horBtnRight
      var sl = hGrid.scrollLeft
      var gsw = gridBox.offsetWidth
      var offRight = sl + gsw

      if (offRight >= hGrid.scrollWidth) {
        $(btnR).detach()
      } else {
        $(gridBoxSmall).append(btnR)
      }

      if (sl == 0) {
        $(btnL).detach()
      } else {
        $(gridBoxSmall).append(btnL)
      }
    }

    function configHoriGridBox(horiGrid) {
      var innerGrid = horiGrid[0].innerGrid

      innerGrid.css({ width: "" })

      var hGrid = innerGrid.parent()
      var lastItem = innerGrid.children().last()
      var limt = parseInt(lastItem.css("margin-top"))
      var hGridW = lastItem[0].offsetLeft + lastItem[0].offsetWidth + 30
      var hGridH = lastItem[0].offsetHeight + limt
      var hGridHori = hGridH
      if (
        !lastItem.is(
          ".caratula_palabra_flex, .caratula_banner, .mibibliocell, .randombtncell",
        )
      ) {
        hGridH += limt * 3

        if ($(panelSocial.bodyDiv).hasClass("aumented")) {
          hGridH += 16
        }
      }
      if ($(lastItem[0].lbl).is(".18_1")) {
        hGridW += $(panelSocial.bodyDiv).hasClass("aumented") ? 60 : 30
      }
      if ($(lastItem[0].lbl).is(".25_32, .pais_0")) {
        hGridH = hGridHori + 15
      }

      hGridH += 12

      horiGrid.css({ height: hGridH + "px" })
      innerGrid.css({ width: hGridW + "px" })
    }

    function configHorizGridBoxes() {
      $(".horiGridBox", gridBoxSmall).each(function () {
        configHoriGridBox($(this))
      })
    }

    function createHoriGridBox(label) {
      var $label = $(label)

      if ($label.hasClass("cells_semihidden")) {
        var hGrid = $(
          '<div class="horiGridBox"><div class="horiGridBoxInner"></div></div>',
        )
        $label.after(hGrid)

        if (label.fullItems) {
          $(label.fullItems).detach()
        }

        var innerGrid = $(".horiGridBoxInner", hGrid)
        innerGrid.html(label.items)

        hGrid[0].innerGrid = innerGrid
        hGrid[0].lbl = label
        label.hGrid = hGrid

        if (platf.indexOf("android") == -1) {
          horiBoxesObserver.observe(hGrid[0])
        }

        configHoriGridBox(hGrid)

        hGrid[0].addEventListener(
          "scroll",
          function () {
            if ($(this.lbl).is(".banners_banners")) {
              if (!this.lbl.olAnimated) {
                that.activateLabelAnim(this.lbl, { timeout: 600 })
              }
            }

            LPShowLabelCounter.call(label)
          },
          false,
        )

        configHoriGridBoxButtons(hGrid[0])
      }
    }

    function configureLinkLabel(label) {
      var link = label.className.match(/link_.+_link/)
      if (link && ltotalUtils.checkPermiso("anotador")) {
        link = link[0].replace("link_", "").replace("_link", "")

        //Adjunta boton para compartir link del rotulo
        if (!$(".tag_share", label)[0]) {
          var tagFolder = $(".tag_folder", label)
          tagFolder.before('<div class="tag_share" title="' + link + '"></div>')
          var tagLabel = $(".tag_label", label)

          var titleLabel =
            (link.split("__").length > 1
              ? "Compartir "
              : "Compartir colección de ") + tagLabel.text()

          var tagShare = $(".tag_share", label)
          tagShare[0].onclick = function (_ev) {
            _ev.stopPropagation()

            var shareOptions = {
              tipoItem: "mlnk",
              idItem: -1,
              nombItem: titleLabel,
              mlnk: link,
              clickClose: function () {
                panelSocial.destroyShareModal()
              },
            }

            panelSocial.shareGift(shareOptions)
          }
        }
      }
    }

    function configureLabel(label) {
      var $label = $(label)

      //Pone clase cells_semihidden al cell_label que tiene mas de una linea de items
      label.items = $label.nextUntil(".cell_label")

      var lItemsCount = label.items.length

      if (
        lItemsCount == 0 &&
        !$label.hasClass("load_items") &&
        !$label.hasClass("txtsearch") &&
        !label.itemsMixDownloads
      ) {
        $label.remove()
      }

      if (lItemsCount == 0) {
        return
      }

      $label.addClass("cells_semihidden")
      if ($label.hasClass("start_visible")) {
        $label.removeClass("cells_semihidden")
      }

      if ($label.hasClass("counter_0")) {
        $label
          .removeClass("counter_0")
          .addClass("counter_" + label.items.length)
      }

      //Adjunta boton indicador de pliegue
      if (!$(".tag_folder", $label)[0]) {
        $label.append('<div class="tag_folder"></div>')
        $label.append('<div class="tag_see_more"></div>')
      }

      if ($label.hasClass("mydownld_1")) {
        $(".tag_folder, .tag_see_more, .tag_doc", label).remove()
        $label.append(
          '<div class="tag_doc" style="float: right; width: 30px; height: 100%; background-image: url(\'/estaticosED/files/img/folder.png\'); background-size: 100% 100%; margin-right: 10px;"></div>',
        )

        $(".tag_doc", label)[0].onclick = function (_ev) {
          _ev.stopPropagation()

          var cmdObj = { Module: "OfflineApp", Action: "ShowDocuments" }
          panelSocial.executeNative(cmdObj)
        }
      }

      configureLinkLabel(label)
      createHoriGridBox(label)
      LPShowLabelCounter.call(label)

      label.onclick = clickLabel

      if ($label.is(".mydownld_1.start_visible")) {
        label.onclick = function () {}
      }
    }

    function clickLabel() {
      var label = $(this)

      var deltaScroll = new Date().getTime() - gridBoxSmall.scrollTime
      if (deltaScroll < 400) {
        gridBoxSmall.scrollTop = gridBoxSmall.scrollTop + 2
        return null
      }

      LPRemoveLabelAtTop()

      var stoff = isTouch && !$(boxTopHeader).hasClass("ontop") ? 130 : 0

      if (label[0].fullItems) {
        label[0].items = label[0].fullItems.slice(0, 30)

        if (label.hasClass("cells_semihidden")) {
          label.addClass("cells_extended")
          label.removeClass("cells_semihidden")
          label.css({ visibility: "hidden" })
          setTimeout(function () {
            LPPutLabelAtTop(label[0])
          }, 200)

          gridBoxSmall.items = $(gridBoxSmall).children()
          $(gridBoxSmall).empty()
          $(gridBoxSmall).append(label)
          label.after(label[0].items)

          gridBoxSmall.scrollTop = 0
          gridBoxSmall.labelExtented = true
        } else {
          label.removeClass("cells_extended")
          label.addClass("cells_semihidden")
          label.css({ visibility: "" })

          if (label[0].hGrid) {
            $(gridBoxSmall).empty()
            $(gridBoxSmall).append(gridBoxSmall.items)

            label[0].hGrid[0].innerGrid.html(label[0].items)

            gridBoxSmall.scrollTop = label[0].offsetTop - 100 - stoff
          } else {
            label.removeClass("start_visible")
            configureLabel(label[0])
          }
          gridBoxSmall.labelExtented = false
        }
      } else {
        if (label[0].items.length <= gridBox.NI) {
          return null
        }

        if (label.hasClass("cells_semihidden")) {
          label.removeClass("cells_semihidden")

          label.next().remove()
          label.after(label[0].items)

          gridBoxSmall.scrollTop = label[0].offsetTop - stoff
        } else {
          label.addClass("cells_semihidden")

          createHoriGridBox(label[0])

          var deltaTop = gridBoxSmall.scrollTop - label[0].offsetTop
          if (deltaTop > 0) {
            gridBoxSmall.scrollTop = label[0].offsetTop
          }
        }
      }

      setTimeout(function () {
        LPShowLabelCounter.call(label[0])
      }, 200)

      diagramCellLabels()
      labelJustClicked = true
    }

    var nativeCovers = {}
    var nativeCoversQ = {}
    function loadNativeCover(_bookElem) {
      var _bookID = getCellID(_bookElem)[1]
      var docID = _bookID
      var accion = "CoverBook"

      if (!$(_bookElem).hasClass("format_epub")) {
        docID = _bookID.replace("pdf", "")
        accion = "CoverPDFDocumento"
      }

      if (nativeCovers[_bookID]) {
        that.coverBookCallback(nativeCovers[_bookID])
      } else {
        if (!nativeCoversQ[_bookID]) {
          nativeCoversQ[_bookID] = true
          var cmdObj = {
            Module: "OfflineApp",
            Action: accion,
            Parameters: [docID],
            Callback: "panelSocial.mosaico.coverBookCallback",
          }
          panelSocial.executeNative(cmdObj)
        }
      }
    }

    function loadPortadas() {
      var extraparams = { hls: true }
      jQuery.extend(extraparams, mosaico.SycCredentials)

      var postItemsToLoad = itemsToLoad.slice(0)
      itemsToLoad = []

      if (postItemsToLoad.length > 0) {
        ltotalOS.loadPortada(postItemsToLoad, extraparams).done(function (es) {
          postProcPortadas(es)
        })
      }
    }

    function preloadItems(it) {
      for (var id = 0; id <= gridBox.NI * 2; id++) {
        if (it) {
          var $it = $(it)
          if (
            !$it.is(
              ".cell_label, .horiGridBox, .caratula_banner, .horiz_btn, .btn_right, .mydownld",
            )
          ) {
            var childrenCount = $it.children().length
            if (childrenCount == 0 && !it.loading) {
              it.loading = true
              itemsToLoad.push(it)
            }
          }
          if ($it.hasClass("mydownld") && !$it.hasClass("cvLD")) {
            loadNativeCover(it)
          }
          it = it.nextSibling
        }
      }

      if (itemsToLoad.length > 0) {
        loadPortadas()
      }
    }

    function preloadLabels(label) {
      var labelsLength = gridBoxSmall.cell_labels.length
      for (var il = 0; il < labelsLength; il++) {
        if (label == gridBoxSmall.cell_labels[il]) {
          var ilni = il + 1
          var ilnf = ilni + 1
          for (var iln = ilni; iln < ilnf && iln < labelsLength; iln++) {
            loadDataCellLabel(gridBoxSmall.cell_labels[iln])
          }
          break
        }
      }
    }

    function onEntryLabels(entry) {
      $.each(entry, function () {
        var item = this.target
        var $item = $(item)
        if (this.isIntersecting) {
          loadDataCellLabel(item)
          preloadLabels(item)

          //if (gridBox.labelAtTop && gridBox.labelAtTop.label == item) {
          //LPRemoveLabelAtTop();
          //}

          diagramCellLabels()
        } else {
          var offT = gridBoxSmall.scrollTop - item.offsetTop
          if (
            offT > 0 &&
            !$item.hasClass("counter_0") &&
            $item.hasClass("cells_extended")
          ) {
            LPPutLabelAtTop(item)
          }
        }
      })
    }

    function onEntryItems(entry) {
      $.each(entry, function () {
        var item = this.target
        var $item = $(item)

        if (this.isIntersecting) {
          try {
            ltotalUtils.checkConnection(null, {
              callback: function () {
                if ($item.hasClass("mydownld")) {
                  loadNativeCover(item)
                }
              },
            })

            var items = item.lbl.items
            var fullItems = item.lbl.fullItems
            if (fullItems && fullItems.length > items.length) {
              var itemMinus = items[items.length - 10]
              var itemLast = items[items.length - 1]
              if (item == itemMinus || item == itemLast) {
                var newItems = []
                var newi = items.length
                var newif = newi + 30
                for (var ifi = newi; ifi < newif; ifi++) {
                  if (ifi == fullItems.length) {
                    break
                  }

                  var newIt = fullItems[ifi]
                  newItems.push(newIt)
                  item.lbl.items.push(newIt)
                }
                $(itemLast).after(newItems)

                if ($item.parent().hasClass("horiGridBoxInner")) {
                  configHoriGridBox($item.parent().parent())
                }
              }
            }

            if ($item.hasClass("caratula_banner")) {
              createCaratulaBanner(item, {})
              createCaratulaBanner(item.nextSibling, {})
              return
            }

            if ($item.hasClass("caratula_dashboard")) {
              createCaratulaDashboard(item, {})
              return
            }

            $(".erase_bitac_btn, .erase_favorite_btn", item).remove()

            var childrenCount = $item.children().length
            if (childrenCount == 0 && !item.loading) {
              item.loading = true
              itemsToLoad.push(item)
            }

            //Precarga de items
            preloadItems(item)

            if ($item.hasClass("mydownld")) {
              loadNativeCover(item)
            }

            if (
              item.parentNode == gridBoxSmall &&
              $(item.lbl).hasClass("cells_extended")
            ) {
              //if (item == items[items.length-1]) {
              //var deltaTop = gridBoxSmall.scrollTop - item.offsetTop;
              //if (deltaTop > 0) {
              LPPutLabelAtTop(item.lbl)
              //}
              //}
            }
          } catch (e) {}
        } else {
          /*if (item.parentNode == gridBoxSmall && gridBox.labelAtTop) {
                    var items = item.lbl.items;
                    if (gridBox.labelAtTop.label == item.lbl && item == items[items.length-1]) {
                        var deltaTop = gridBoxSmall.scrollTop - item.offsetTop;
                        if (deltaTop > 0) {
                            LPRemoveLabelAtTop();
                        }
                    }
                }*/
        }
      })
    }

    function onEntryhoriBoxes(entry) {
      $.each(entry, function () {
        var item = this.target
        var $item = $(item)
        if (this.isIntersecting) {
          $item.html(item.innerGrid)
          configHoriGridBox($item)

          LPShowLabelCounter.call(item.lbl)
        } else {
          item.innerGrid.detach()
        }
      })
    }

    var labelsObserver = new IntersectionObserver(onEntryLabels, {
      threshold: 1.0,
    })
    var itemsObserver = new IntersectionObserver(onEntryItems, {
      threshold: 0,
    })
    var horiBoxesObserver = new IntersectionObserver(onEntryhoriBoxes, {
      threshold: 0,
    })

    this.createMosaic2 = function (data, _servicio, item, mosaicTop, _opts) {
      var configGridBoxSmall = function () {
        $(boxMosaic).append(gridBox)

        gridBox.labelAtTop = null

        $(gridBox).focus()
      }

      var configLabels = function () {
        gridBoxSmall.cell_labels = []
        var labels = $(".cell_label", gridBoxSmall)
        labels.each(function () {
          var label = this
          gridBoxSmall.cell_labels.push(label)
          label.itemParent = item
          configureLabel(label)
        })
      }

      var saveCache = true
      if (_opts && _opts.saveCache == false) {
        saveCache = false
      }

      if (data != null) {
        servicio = _servicio
        mosaico.setMosaicCache({ backNav: _opts.backNav })

        var itemID = item.pilarID ? item.pilarID : getCellID(item).join("_")
        var xParms = item.className.match(/x_\w+_\w+/g)
        $.each(xParms, function () {
          itemID += "_" + this
        })

        lastPilarItemSelected = pilarSelected + "_" + itemID
        lastServiceSelected = servicio
        lastItemSelected = item
      }

      var mosaChild = $(boxMosaic).children()
      panelSocial.clearAudioData(mosaChild)
      mosaChild.detach()

      if (item && !$(item).hasClass("pilarSearch")) {
        closeSearch()
      }

      if (
        data != null &&
        typeof data == "object" &&
        data.hasClass &&
        data.hasClass("gridBoxSmall")
      ) {
        gridBoxSmall = data[0]
        $(gridBox).prepend(gridBoxSmall)
        configGridBoxSmall()

        if (gridBoxSmall.labelExtented && _opts && _opts.backNav == true) {
          setTimeout(function () {
            $(gridBoxSmall.parentNode.nextElementSibling).trigger("click")
            gridBoxSmall.scrollTop = 0
          }, 100)
        }
      }

      if (
        data != null &&
        (typeof data == "string" ||
          getObjectType(data).toUpperCase() == "HTMLCOLLECTION")
      ) {
        gridBoxSmall = document.createElement("div")
        gridBoxSmall.setAttribute("class", "gridBoxSmall")
        gridBoxSmall.cell_labels = []
        gridBoxSmall.scrollTopValue = 0
        gridBoxSmall.lastScrollTopValue = 0
        $(gridBox).prepend(gridBoxSmall)

        gridBoxSmall.addEventListener(
          "scroll",
          function () {
            var st = gridBoxSmall.scrollTop
            gridBoxSmall.scrollTime = new Date().getTime()
            gridBoxSmall.scrollTopValue = st

            if (gridBoxSmall.bnnr) {
              mosaicBanner.posVerMenos(gridBoxSmall.bnnr, gridBox, isTouch)
            }

            var lblx = $(".cell_label", gridBoxSmall)[0]
            if ($(lblx).hasClass("cells_extended")) {
              LPShowLabelCounter.call(lblx)
            }

            $([gridBox.horBtnLeft, gridBox.horBtnRight]).detach()

            if (isTouch && !$(boxTopHeader).is(":animated")) {
              var lst = gridBoxSmall.lastScrollTopValue
              if (st > 60 && st > lst + 5 && !labelJustClicked) {
                showTopHeader("hide")
              }
              if (st < 60 || st < lst - 5) {
                showTopHeader("show")
              }
            }

            gridBoxSmall.lastScrollTopValue = st
            labelJustClicked = false
          },
          false,
        )

        configGridBoxSmall()
        $(gridBoxSmall).html(data)
        gridBoxSmall.items = $(gridBoxSmall).children()

        configLabels()
        preloadLabels(gridBoxSmall.cell_labels[0])

        if (!saveCache) {
          $(gridBoxSmall).addClass("no_cache")
        }
      }

      if (isTouch) {
        showTopHeader("show")
      }

      if (mosaicTop == null || mosaicTop == undefined) {
        mosaicTop = 0
      }

      gridBoxSmall.scrollTop = mosaicTop

      if (settings.modePilars) {
        panelSocial.selectedBook = null
      }
    }

    this.clickSobrePilar = function (pilar, _fncb) {
      var basicFilters = []
      var itemPilar = null
      var service = pilar

      if (pilar == "libros") {
        itemPilar = pilarLibros

        basicFilters = [
          ["23", "-2", "Audiolibros", "shuffle_items replace_with_new_label"],
          ["nuevos", "0", "Agregados recientemente", "shuffle_items"],
          ["24", "11", "Recomendados", "shuffle_items replace_with_new_label"],
          [
            "librostotales",
            "0",
            "Libros enriquecidos",
            "shuffle_items replace_with_new_label",
          ],
          ["25", "32", "Notas curiosas", "shuffle_items"],
          [
            "confrontados",
            "0",
            "Confrontados a otros idiomas",
            "replace_with_new_label",
          ],
          ["autoresclasicos", "0", "Autores clásicos", "shuffle_items"],
        ]

        var tematicas = [
          ["14", "767", "Infantil"],
          ["14", "25", "Cuento"],
          ["14", "1", "Novela"],
          ["14", "24", "Poesía"],
          ["14", "103", "Teatro"],
          ["14", "2037", "Estudios literarios"],
          ["14", "761", "Fantástico"],
          ["14", "136", "Filosofía"],
          ["14", "132", "Biografía"],
          ["14", "1079", "Irónico"],
          ["14", "1805", "Sentimientos"],
          ["14", "736", "Ensayo"],
          ["14", "990", "Familia"],
          ["14", "796", "Amor"],
          ["14", "1777", "Histórico"],
          ["14", "800", "Animales"],
          ["14", "1771", "Drama"],
          ["14", "768", "Juvenil"],
          ["14", "1374", "Crítica Social"],
          ["14", "1829", "Memorias"],
          ["14", "1140", "Mujer"],
          ["14", "1139", "Muerte"],
          ["14", "1117", "Matrimonio"],
          ["14", "2014", "Cuento de hadas"],
          ["14", "737", "Crónica"],
          ["14", "1770", "Costumbrista"],
          ["14", "1773", "Fábula"],
          ["14", "1128", "Misterio"],
          ["14", "1815", "Personajes históricos"],
          ["14", "1877", "Existencial"],
          ["14", "779", "Viajes"],
          ["14", "1806", "Sobrenatural"],
          ["14", "1778", "Microcuento"],
          ["14", "795", "Amistad"],
          ["14", "780", "Naturaleza"],
          ["14", "1670", "Final inesperado"],
          ["14", "143", "Política"],
          ["14", "751", "Aventura"],
          ["14", "2112", "Infortunios"],
          ["14", "1125", "Militares"],
          ["14", "1253", "Valores Humanos"],
          ["14", "1830", "Relaciones de pareja"],
          ["14", "774", "Policial"],
          ["14", "1797", "Nostalgia"],
          ["14", "1227", "Sátira"],
          ["14", "818", "Asesinatos"],
          ["14", "968", "Engaños"],
          ["14", "1186", "Pobreza"],
          ["14", "901", "Crimen"],
          ["14", "1779", "Mitos y Leyendas"],
          ["14", "1847", "Psicológico"],
          ["14", "1065", "Infidelidad"],
          ["14", "1063", "Indígenas"],
          ["14", "1257", "Venganza"],
          ["14", "1614", "Príncipes y Princesas"],
          ["14", "967", "Enfermedades"],
          ["14", "1689", "Tristeza"],
          ["14", "991", "Fantasmas"],
          ["14", "1957", "Mitología"],
          ["14", "934", "Detectives"],
          ["14", "1225", "Sueños"],
          ["14", "1926", "Amores Imposibles"],
          ["14", "1309", "Brujas y Hechiceros"],
          ["14", "1783", "Terror"],
          ["14", "140", "Religión"],
          ["14", "775", "Romántico"],
          ["14", "133", "Frases y aforismos"],
          ["14", "1018", "Gastronomía"],
          ["14", "773", "Pedagogía"],
        ]
        $.each(tematicas, function () {
          this.push("shuffle_items x_hidefiltrogenero_1 replace_with_new_label")
        })

        basicFilters = basicFilters.concat(tematicas)
        basicFilters = basicFilters.concat([
          ["pais", "0", "Libros por países"],
          [
            "masleidos",
            "0",
            "Libros más leídos hoy",
            "shuffle_items replace_with_new_label",
          ],
          [
            "diccionarios",
            "0",
            "Diccionarios",
            "x_extralabels_1 replace_with_new_label",
          ],
        ])

        if (ltotalUtils.checkPermiso("anotador")) {
          basicFilters.splice(4, 0, ["25", "27", "Grupos de investigación"])
        }
      }

      if (pilar == "musica") {
        itemPilar = pilarMusica

        basicFilters = [
          //["37", "0", 'Géneros musicales'],
          ["24", "1010", "Contrainteligencia artificial"],
          ["libros", "10", "Música inspirada en libros", "shuffle_items"],
          ["38", "551", "Culta", "shuffle_items replace_with_new_label"],
          ["38", "441", "Folclórica", "shuffle_items replace_with_new_label"],
          ["38", "511", "Instrumental", "shuffle_items replace_with_new_label"],
          ["38", "520", "Rock", "shuffle_items replace_with_new_label"],
          ["38", "408", "Pop", "shuffle_items replace_with_new_label"],
          ["autor", "0", "Compositores"],
          ["masescuchada", "0", "Música más escuchada hoy", "shuffle_items"],
          ["nueva", "0", "Música nueva"],
          ["pais", "0", "Música por países"],
          //['instrumentos', 'Instrumentos']
        ]
      }

      if (pilar == "arte") {
        service = "imagenes"
        itemPilar = pilarArte

        basicFilters = [
          ["24", "66", "Contrainteligencia artificial"],
          ["ewall", "0", "Arte más visto"], //Arte Universal
          ["libros", "6", "Arte inspirado en libros", "shuffle_items"],
          ["fotografia", "0", "Fotografía", "shuffle_items"],
          ["pais", "0", "Arte por países"],
          ["autor", "0", "Artistas"],
          ["nuevas", "0", "Nuevas imágenes"],
        ]

        if (ltotalUtils.checkPermiso("anotador,anotador_imagen")) {
          basicFilters.push(["42", "0", "Técnicas artísticas"])
        }
      }

      var htmlFilters = ""
      $.each(basicFilters, function (i, e) {
        var extraClass = e[3] ? " " + e[3] : ""
        htmlFilters +=
          '<div class="cell_label load_items ' +
          e[0] +
          "_" +
          e[1] +
          " counter_0" +
          extraClass +
          '"><div class="tag_label">' +
          e[2] +
          "</div></div>"
      })

      var t_item = itemPilar.className.match(/t_item_\d+/)[0].match(/\d+/)[0]

      var extraparams = {
        expandRelas: 1,
        id_cliente: panelSocial.getIDCliente(),
      }
      if (panelSocial.hasOfflineBooks()) {
        extraparams.show_mis_descargas = 1
      }

      jQuery.extend(extraparams, mosaico.SycCredentials)

      try {
        var xhr = ltotalOS.loadData("", "24", t_item, extraparams)

        deSelectPilares()
        resetBackNavigation()

        pilarSelected = pilar

        servicio = service

        $(itemPilar).addClass("pilarSelec")

        if (xhr) {
          xhr.done(function (_htmldata) {
            var proc = $("#proceso").html(_htmldata + htmlFilters)

            LPWrapItems(proc[0].children)

            var miBibLabel = $(".mibliblio_0", proc)
            miBibLabel.nextUntil(".cell_label").each(function () {
              this.lbl = miBibLabel[0]
            })

            $(gridBox).empty()

            var mosaicTop = 0
            mosaico.createMosaic2(
              proc[0].children,
              servicio,
              itemPilar,
              mosaicTop,
              { backNav: false },
            )

            /*var label_concurso = $(".cell.31_0", mosaico.getContain())[0];
                    if (label_concurso) {
                        ltotalUtils.loadScript("/estaticosED/files/js/ltotal/concurso.js");
                        ltotalUtils.loadScript("/estaticosED/files/css/ltotal/concurso.css");
                    }*/

            if (panelSocial.hasOfflineBooks() && itemPilar == pilarLibros) {
              if (lectorLogueado) {
                if (!$(".cell_label.18_1")[0]) {
                  var cmdObj = {
                    Module: "OfflineApp",
                    Action: "RecentBooks",
                    Callback:
                      "panelSocial.mosaico.recentBooksDownloadedCallback2",
                  }
                  panelSocial.executeNative(cmdObj)
                }
              } else {
                var cmdObj = {
                  Module: "OfflineApp",
                  Action: "DownloadedBooks",
                  Callback: "panelSocial.mosaico.downloadsMosaicCallback2",
                }
                panelSocial.executeNative(cmdObj)
              }
            }

            if (_fncb) {
              _fncb()
            }
          })
        }
      } catch (e) {}
    }

    this.activateLabelAnim = function (_label, _opts) {
      var res = ltotalOS.deviceResolution
      if (res.indexOf("ltr_phone") > -1) {
        ltotalUtils.checkConnection()

        clearTimeout(timerAnimBanner)

        timerAnimBanner = setTimeout(
          function () {
            var carban = $(".caratula_banner", _label.hGrid).eq(0)
            var wc = parseInt(carban.css("width"))
            var mlc = parseFloat(carban.css("margin-left"))
            var netw = wc + mlc

            var olRela = _label.hGrid[0].scrollLeft / netw
            var olRelaRound = Math.round(olRela)
            var epsilon = olRela - olRelaRound

            var steps =
              epsilon < 0 && Math.abs(epsilon) > 0.05
                ? olRelaRound
                : olRelaRound + 1
            var lPos = steps * netw

            //Corrige posición en pantallas de ancho impar en px.
            var gbsw = gridBoxSmall.offsetWidth
            if (gbsw % 2 > 0) {
              if (!_label.hGrid[0].slFactor) {
                _label.hGrid[0].slFactor = 1
              }

              lPos = lPos + 0.5 * _label.hGrid[0].slFactor
              _label.hGrid[0].slFactor = _label.hGrid[0].slFactor * -1
            }

            if (!isNaN(steps) && _label.hGrid[0].innerGrid[0].parentNode) {
              _label.olAnimated = true
              $(_label.hGrid).animate({ scrollLeft: lPos }, 400, function () {
                setTimeout(function () {
                  _label.olAnimated = false
                  that.activateLabelAnim(_label)
                }, 100)
              })
            } else {
              that.activateLabelAnim(_label)
            }
          },
          _opts && _opts.timeout ? _opts.timeout : 4000,
        )
      }
    }

    this.getCSSRule = function (rule) {
      var cssRule = null
      $.each(document.styleSheets, function () {
        if (this.href) {
          $.each(this.cssRules, function () {
            if (this.style && this.selectorText && this.selectorText == rule) {
              cssRule = this
            }
          })
        }
      })
      return cssRule
    }

    this.configHMarginItems = function () {
      var res = ltotalOS.deviceResolution
      var isComputer = res.indexOf("ltr_computer") > -1
      var isPhone = res.indexOf("ltr_phone") > -1
      var gbw = gridBox.offsetWidth
      var isAumented = $(panelSocial.bodyDiv).hasClass("aumented")
      var aumented = isAumented ? ".aumented" : ""

      var getMarginItems = function (_rule) {
        var iw = parseInt(_rule.style["width"])
        var ni = isComputer ? Math.floor(gbw / iw) - 1 : Math.floor(gbw / iw)
        var itemsL = ni * iw
        var gap = gbw - itemsL
        var im = gap / (ni + 1)

        if (ni > 3 && im < 20) {
          ni--
          itemsL = ni * iw
          gap = gbw - itemsL
          im = gap / (ni + 1)
        }

        if (ni >= 10) {
          ni = 9
          itemsL = ni * iw
          gap = gbw - itemsL
          im = gap / (ni + 1)
        }

        return { ni: ni, im: im }
      }

      //Items
      var cssCell = isPhone
        ? ".contentViewer.ltr_phone" + aumented + " .cell"
        : ".contentViewer" + aumented + " .cell"
      var ruleCell = that.getCSSRule(cssCell)
      var dataCell = getMarginItems(ruleCell)
      gridBox.NI = dataCell.ni
      ruleCell.style["margin-left"] = dataCell.im + "px"

      //Items horizontales
      var cssCellHori = isPhone
        ? ".contentViewer.ltr_phone" + aumented + " .horiGridBoxInner .cell"
        : ".contentViewer .horiGridBoxInner .cell"
      var ruleCellHori = that.getCSSRule(cssCellHori)
      var marginHori = dataCell.im - 5 > 2 ? dataCell.im - 5 : 2
      ruleCellHori.style["margin-left"] = marginHori + "px"

      //Palabras
      var cssPaldic = isPhone
        ? ".contentViewer.ltr_phone.ltr_port .cell.paldic"
        : ".contentViewer .cell.paldic"
      var rulePaldic = that.getCSSRule(cssPaldic)
      var dataPaldic = getMarginItems(rulePaldic)
      gridBox.NIPAL = dataPaldic.ni
      rulePaldic.style["margin-left"] = dataPaldic.im + "px"

      //Dashboards
      var cssDash = ".boxMosaic .caratula_dashboard"
      var ruleDash = that.getCSSRule(cssDash)
      var dataDash = getMarginItems(ruleDash)
      gridBox.NIDASH = dataDash.ni
      ruleDash.style["margin-left"] = dataDash.im + "px"

      //Banners
      if (res.indexOf("ltr_phone ltr_port") > -1) {
        var navAg = navigator.userAgent.toLowerCase()
        var isIOS = navAg.indexOf("ipad") != -1 || navAg.indexOf("iphone") != -1

        var bnrW = isIOS ? 360 : 352
        var bnrM = (gbw - bnrW) / 2

        var ruleBnr = that.getCSSRule(
          ".contentViewer.ltr_phone.ltr_port .banner_destacados",
        )
        ruleBnr.style["width"] = bnrW + "px"
        ruleBnr.style["margin-left"] = bnrM + "px"
      }
    }

    this.getPilarSelected = function () {
      return pilarSelected
    }

    //Guarda la bitacora de ultima lectura de un libro
    this.saveBitacora = function (
      _tipoLibro,
      _idLibro,
      _idTrad,
      _pgFin,
      _idItemFin,
      palabra,
      _numePaginaPercent,
      _extra,
    ) {
      var doSave =
        _tipoLibro == 1 ||
        _tipoLibro == 6 ||
        _tipoLibro == 10 ||
        _tipoLibro == 16 ||
        _tipoLibro == 17 ||
        _tipoLibro == 27 ||
        _tipoLibro == 32 ||
        _tipoLibro == 51
      if (
        (_tipoLibro == 1 && _pgFin < 1) ||
        (_tipoLibro == 1 && _idLibro == 1565) || //NOTA! ID quemado
        (_tipoLibro == 17 && _idItemFin == 0) ||
        (_tipoLibro == 27 && _idLibro == 0) ||
        (_tipoLibro == 27 && _idItemFin == 0) ||
        (_tipoLibro == 32 && _idItemFin == 0) ||
        (_tipoLibro == 32 && _idLibro == 12) //NOTA! ID quemado
      ) {
        doSave = false
      }

      if (!ltotalOS.isConnected) {
        doSave = false
      }

      if (doSave) {
        var url = "/ltotal/lector/save_bitacora.jsp"
        var queryURL = ltotalOS.getPostURL(url)
        var params = {
          idLibro: _idLibro,
          idTrad: _idTrad,
          pagina: _pgFin,
          tipo_comp: _tipoLibro,
          id_comp: _idItemFin,
          palabra: palabra,
          ltotalurl: url,
          numePaginaPercent: _numePaginaPercent,
        }

        if (_extra) {
          if (_extra.ignorePos) {
            params.ignorePos = true
          }
        }

        jQuery.extend(params, that.SycCredentials)
        params = $.trim(decodeURIComponent($.param(params)))
        $.post(queryURL, params).done(function () {
          _tipoLibro == 16 ? (_tipoLibro = 45) : _tipoLibro

          var idItemBitac =
            _tipoLibro == 1
              ? "4_" + _idLibro + "," + _idTrad
              : _tipoLibro + "_" + _idLibro
          if (_tipoLibro == 6 || _tipoLibro == 10) {
            idItemBitac = _tipoLibro + "_" + _idItemFin
          }
          if (_tipoLibro == 45) {
            idItemBitac = palabra
          }

          resetLabel(18, _tipoLibro, {
            createLabel: true,
            createItem: true,
            idItemBitac: idItemBitac,
          })
        })
      }
    }

    //Elimina Recientes
    function deleteBitacora(_ev) {
      _ev.stopPropagation()

      var item = $(this).parent()
      var celldata = getCellID(item)

      var tipo = celldata[0]
      var id = celldata[1].split(",")

      var idL = id[0]
      var idT = id[1]
      var palabra = ""

      if (tipo == 4) {
        tipo = 1
      }

      if (tipo == 45) {
        var cellCoverText = $(".word_cover_text", item)
        palabra = $.trim(cellCoverText[0].innerHTML.replace(/\s+/, " "))
        tipo = 16
      }

      if (!idT) {
        idT = -1
      }

      if (tipo == "mydownld") {
        if ($(item[0].lbl).hasClass("mydownld_1")) {
          var dialogo = new DialogueLM({
            show: true,
            ModoBtn: true,
            btnClose: true,
            btnCancelar: "Cancelar",
            btnAceptar: "Aceptar",
            texto:
              '¿Desea eliminar "' +
              item.attr("label_titulo") +
              '" de este dispositivo?',
            fnAceptar: function () {
              var _bookID = id[0]
              var docID = _bookID
              var accion = "DeleteBook"
              if (!item.hasClass("format_epub")) {
                docID = _bookID.replace("pdf", "")
                accion = "DeletePDFDocumento"
              }

              var cmdObj = {
                Module: "OfflineApp",
                Action: accion,
                Parameters: ["" + docID],
              }
              panelSocial.executeNative(cmdObj)
              refreshLabelCounters(item)
            },
            fnCancelar: function () {},
          })
        } else {
          var _bookID = id[0]
          var docID = _bookID
          var accion = "DeleteRecentBook"
          if (!item.hasClass("format_epub")) {
            docID = _bookID.replace("pdf", "")
            accion = "DeleteRecentPDFDocumento"
          }

          var cmdObj = {
            Module: "OfflineApp",
            Action: accion,
            Parameters: ["" + docID],
          }
          panelSocial.executeNative(cmdObj)
          refreshLabelCounters(item)
        }

        return null
      }

      var url = "/ltotal/lector/borrar_bitacora.jsp"
      var queryURL = ltotalOS.getPostURL(url)
      var params = {
        idLibro: idL,
        idTrad: idT,
        tipo_comp: tipo,
        palabra: palabra,
        ltotalurl: url,
        caso: "1",
      }
      jQuery.extend(params, that.SycCredentials)
      params = $.trim(decodeURIComponent($.param(params)))
      $.post(queryURL, params).done(function () {
        refreshLabelCounters(item)
      })
    }

    //Refresca labels de lecturas recientes (18) y favoritos (44)
    function resetLabel(_tipoSeccion, _tipoItem, _extra) {
      var getTipoItem = function (_tipo) {
        return _tipo == 1 || _tipo == 17 || _tipo == 27 || _tipo == 32
          ? 1
          : _tipo
      }

      var tipItem = getTipoItem(_tipoItem)
      var labelID = _tipoSeccion + "_" + tipItem

      var idItemBitac = null
      var createLabel = false
      var createItem = false

      if (_extra) {
        if (_extra.labelID) {
          labelID = _extra.labelID
        }
        if (_extra.createLabel) {
          createLabel = true
        }
        if (_extra.createItem) {
          createItem = true
        }
        if (_extra.idItemBitac) {
          idItemBitac = _extra.idItemBitac
        }
      }

      //Resetea labels
      var labels = buscaLabels()
      $.each(labels, function () {
        var lbl = this
        var $lbl = $(lbl)
        if ($lbl.hasClass(labelID)) {
          if ($lbl.hasClass("banners_banners")) {
            if (lbl.fullItems) {
              shuffleArray(lbl.fullItems)
              lbl.items = lbl.fullItems.slice(0, 30)
            } else {
              shuffleArray(lbl.items)
            }
            $lbl.next()[0].innerGrid.html(lbl.items)
          } else {
            var items = lbl.fullItems ? lbl.fullItems : lbl.items
            var itemFound = null
            var pariente = null
            var idx = 0

            removeClassRegex(/counter_\d+/, lbl)

            if (
              items.length > 0 &&
              items[0].className.indexOf("minibookhelp") > -1
            ) {
              pariente = items[0].parentNode
              $(items[0]).remove()
              items.splice(0, 1)
            }

            if (items.each) {
              items.each(function (i, e) {
                if (
                  $(this).hasClass(idItemBitac) ||
                  (_tipoItem == 45 && $(this).text() == idItemBitac)
                ) {
                  itemFound = this
                  idx = i
                }
              })
            }

            if (itemFound) {
              pariente = itemFound.parentNode
              $(items[idx]).detach()
              items.splice(idx, 1)

              if (createItem) {
                $(pariente).prepend(itemFound)
                items.splice(0, 0, itemFound)
              }
            } else {
              if (createItem && !$lbl.hasClass("load_items")) {
                var newItem = $('<div class="cell ' + idItemBitac + '"></div>')
                if (_tipoItem == 45) {
                  if (idItemBitac.split("_").length < 2) {
                    newItem = $(
                      '<div class="cell 45_-1"><div class="boxPalabra"><div class="word_cover_text paldicReci">' +
                        idItemBitac +
                        "</div></div></div>",
                    )
                  }
                  newItem.addClass("paldic")
                }

                if (_extra && _extra.extraClass) {
                  newItem.addClass(_extra.extraClass)
                }

                if (_tipoSeccion == 18 || _tipoSeccion == "mydownld") {
                  newItem.addClass("erase_bitac")
                }
                if (_tipoSeccion == 44) {
                  newItem[0].erase_favorite = true
                }

                LPWrapItems(newItem)
                newItem[0].lbl = lbl

                if (pariente) {
                  $(pariente).prepend(newItem)
                } else {
                  $(items[0]).before(newItem)
                }

                items.splice(0, 0, newItem[0])
              }
            }

            $lbl.addClass("counter_" + items.length)

            lbl.items = items
            if (items.length > 30) {
              lbl.fullItems = items
              lbl.items = items.slice(0, 30)
            }

            if (lbl.items.length > 0) {
              if ($lbl.next().hasClass("horiGridBox")) {
                configHoriGridBox($lbl.next())
              } else {
                $lbl.after(lbl.items)
                diagramCellLabels()
              }
            } else {
              if (lbl.hGrid) {
                lbl.hGrid.remove()
              }
              $lbl.addClass("load_items")
              $lbl.css({ display: "none" })
              setTimeout(function () {
                $lbl.css({ display: "block" })
              }, 300)
            }
          }
        }
      })

      //Crear un nuevo label de Recientes (18) al principio del mosaico pilar
      if (createLabel) {
        var PID = ""
        var labelTitle = ""
        if (tipItem == 1) {
          PID = "libros"
          labelTitle = "Continuar leyendo"
        }
        if (tipItem == 6) {
          PID = "arte"
          labelTitle = "Arte visto recientemente"
        }
        if (tipItem == 10) {
          PID = "musica"
          labelTitle = "Música escuchada recientemente"
        }
        if (labelID == "mydownld_1") {
          labelTitle = "Mis descargas"
        }
        var pilarID = "pilar" + PID
        var cacheID = PID + "_" + pilarID + "_0"

        //Busca el grid del pilar
        var gbs = null
        if ($(lastItemSelected).hasClass(pilarID)) {
          gbs = gridBoxSmall
        } else {
          for (var idCach in mosaicCache) {
            if (mosaicCache.hasOwnProperty(idCach) && idCach == cacheID) {
              gbs = mosaicCache[idCach][0][0]
              break
            }
          }
        }

        if (gbs) {
          var hayLabel = false
          $.each(gbs.cell_labels, function () {
            if ($(this).hasClass(labelID)) {
              hayLabel = true
            }
          })
          if (!hayLabel) {
            createLabelRecientes(labelID, labelTitle, gbs)
          }
        }
      }
    }

    this.resetLabel = function (_tipoSeccion, _tipoItem, _extra) {
      resetLabel(_tipoSeccion, _tipoItem, _extra)
    }

    function createLabelRecientes(labelID, labelTitle, gbs) {
      var divLabel = $(
        '<div class="cell_label load_items ' +
          labelID +
          ' counter_0"><div class="tag_label">' +
          labelTitle +
          "</div></div>",
      )

      for (var i = 0; i < gbs.cell_labels.length; i++) {
        if ($(gbs.cell_labels[i]).hasClass("mibliblio_0")) {
          LPWrapItems(divLabel)
          $(gbs.cell_labels[i + 1]).before(divLabel)

          divLabel[0].items = $()
          gbs.cell_labels.push(divLabel[0])
        }
      }
    }

    function reloadLabel(_label) {
      var labelID = getLabelID(_label).join("_")
      var labels = buscaLabels()
      $.each(labels, function () {
        var $LB = $(this)
        var LB = this
        if ($LB.hasClass(labelID)) {
          removeClassRegex(/counter_\d+/, LB)
          $(LB.items).remove()
          $(LB.fullItems).remove()
          $(LB.hGrid).remove()
          LB.items = []
          $LB.addClass("load_items counter_0")

          $LB.css({ display: "none" })
          setTimeout(function () {
            $LB.css({ display: "block" })
          }, 300)
        }
      })
    }

    this.reloadLabel = function (_label) {
      reloadLabel(_label)
    }

    //Marca un elemento como favorito
    this.doFavorite = function (tipoLibro, idLibro, idTrad, bannerFavorite) {
      if (!lectorLogueado) {
        return panelSocial.showAlertMiBiblioteca(44)
      }

      if (!idTrad) {
        idTrad = -1
      }

      var isFavoriteBook = $(bannerFavorite).hasClass("favorite") ? true : false
      var estado = isFavoriteBook ? 0 : 1

      var saveFavorito = that.saveFavorito(tipoLibro, idLibro, idTrad, estado)
      saveFavorito.done(function (d) {
        d = $.trim(d)
        if (d.indexOf("OK") > -1) {
          isFavoriteBook = estado == 0 ? false : true
          if (isFavoriteBook) {
            bannerFavorite.addClass("favorite")
          } else {
            bannerFavorite.removeClass("favorite")
          }
        }
      })
    }

    //Guarda un item como favorito
    this.saveFavorito = function (tipoItem, idItem, idTrad, estado) {
      var url = "/ltotal/lector/favoritos.jsp"
      var queryURL = ltotalOS.getPostURL(url)
      var params = {
        tipoItem: tipoItem,
        idItem: idItem,
        idTrad: idTrad,
        estado: estado,
        ltotalurl: url,
      }
      jQuery.extend(params, that.SycCredentials)
      params = $.trim(decodeURIComponent($.param(params)))
      return $.post(queryURL, params).done(function () {
        tipoItem == 16 ? (tipoItem = 45) : tipoItem

        var idItemBitac =
          tipoItem == 1 ? "4_" + idItem + "," + idTrad : tipoItem + "_" + idItem
        var createItem = estado == 1

        resetLabel(44, tipoItem, {
          createItem: createItem,
          idItemBitac: idItemBitac,
        })
      })
    }

    //Elimina el item de mis favoritos
    function deleteFavorite(_ev) {
      _ev.stopPropagation()

      var item = $(this).parent()
      var celldata = getCellID(item)

      var tipoItem = celldata[0]
      var id = celldata[1].split(",")

      var idItem = id[0]
      var idTrad = id[1]

      tipoItem == 4 ? (tipoItem = 1) : tipoItem

      tipoItem == 45 ? (tipoItem = 16) : tipoItem

      !idTrad ? (idTrad = -1) : idTrad

      var url = "/ltotal/lector/favoritos.jsp"
      var queryURL = ltotalOS.getPostURL(url)
      var params = {
        tipoItem: tipoItem,
        idItem: idItem,
        idTrad: idTrad,
        estado: 0,
        ltotalurl: url,
      }
      jQuery.extend(params, that.SycCredentials)
      params = $.trim(decodeURIComponent($.param(params)))

      $.post(queryURL, params).done(function (d) {
        d = $.trim(d)
        if (d.indexOf("OK") > -1) {
          refreshLabelCounters(item)
          if (tipoItem == 16) {
            $(
              ".tag_favorite.id_favorite_" + idItem,
              $("#dicc_total"),
            ).removeClass("favorite")
          }
        }
      })
    }

    //Guarda markador de una pagina
    this.saveBookMark = function (
      tipoLibro,
      idLibro,
      idTrad,
      paginas,
      porcentajes,
      estado,
    ) {
      var url = "/ltotal/lector/marcadores.jsp"
      var queryURL = ltotalOS.getPostURL(url)
      var params = {
        tipoLibro: tipoLibro,
        idLibro: idLibro,
        idTrad: idTrad,
        paginas: paginas,
        porcentajes: porcentajes,
        estado: estado,
        ltotalurl: url,
      }
      jQuery.extend(params, that.SycCredentials)
      params = $.trim(decodeURIComponent($.param(params)))
      return $.post(queryURL, params)
    }

    function deleteFotoPromoLibro(_ev) {
      _ev.stopPropagation()

      var item = $(this).parent()
      var id = item[0].className
        .match(/foto_promo_libro_\d+/)[0]
        .match(/\d+/)[0]

      var url = "/ltotal/inicio/edicion.jsp"
      var queryURL = ltotalOS.getPostURL(url)
      var params = { caso: 8, id_foto_promo: id, ltotalurl: url }
      jQuery.extend(params, that.SycCredentials)
      params = $.trim(decodeURIComponent($.param(params)))

      $.post(queryURL, params).done(function (d) {
        refreshLabelCounters(item)
      })
    }

    function deleteRegaloLibro(_ev) {
      _ev.stopPropagation()

      var item = $(this).parent()
      var id = item[0].className.match(/regalo_libro_\d+/)[0].match(/\d+/)[0]

      var url = "/ltotal/nuevaEntrada/regalar_libro.jsp"
      var queryURL = ltotalOS.getPostURL(url)
      var params = { caso: 2, id_compartido: id, ltotalurl: url }
      jQuery.extend(params, that.SycCredentials)
      params = $.trim(decodeURIComponent($.param(params)))

      $.post(queryURL, params).done(function (d) {
        refreshLabelCounters(item)
      })
    }

    function buscaLabels() {
      var labels = []
      labels.push.apply(labels, gridBoxSmall.cell_labels)
      for (var idCach in mosaicCache) {
        if (mosaicCache.hasOwnProperty(idCach)) {
          labels.push.apply(labels, mosaicCache[idCach][0][0].cell_labels)
        }
      }
      return labels
    }

    function refreshLabelCounters(item) {
      item.fadeOut(function () {
        var label = item[0].lbl
        var labelID = getLabelID(label).join("_")
        var itemID = getCellID(item[0]).join("_")
        postRefreshLabelCounters(labelID, itemID)
      })
    }

    function postRefreshLabelCounters(labelID, itemID) {
      //Resetea los labels
      var labels = buscaLabels()
      $.each(labels, function () {
        var LB = this
        var $LB = $(LB)
        if ($LB.hasClass(labelID)) {
          var willDeleteItem = false
          var items = LB.fullItems ? LB.fullItems : LB.items
          items.each(function (i) {
            if ($(this).hasClass("cell")) {
              if (getCellID(this).join("_") == itemID) {
                items.splice(i, 1)
                willDeleteItem = true

                $(this).remove()
              }
            }
          })

          //Ajusta contadores del label
          var cntl = LB.className.match(/counter_\d+/)[0]
          var cnt = parseInt(cntl.match(/\d+/)[0]) - (willDeleteItem ? 1 : 0)
          $LB.removeClass(cntl).addClass("counter_" + cnt)
          //Fin. Ajusta contadores del label

          //Recarga el label cuando queda vacio
          if (cnt == 0) {
            $LB.addClass("load_items")
            if (LB.hGrid) {
              LB.hGrid.remove()
            }
            $LB.css({ display: "none" })
            setTimeout(function () {
              $LB.css({ display: "block" })
            }, 300)
          } else {
            LB.items = items
            if (items.length > 30) {
              LB.fullItems = items
              LB.items = items.slice(0, 30)
            }

            if ($LB.next().hasClass("horiGridBox")) {
              configHoriGridBox($LB.next())
            } else {
              $LB.after(LB.items)
              diagramCellLabels()
            }
          }
        }
      })
    }

    this.refreshLabelCounters = function (papa) {
      refreshLabelCounters(papa)
    }

    //Descuenta el notificador numerico de un item
    this.discountNovedad = function (_tipoLibro, _idLibro, _extraClass) {
      var discount_rec = function (_cont) {
        var rec_novedad = $(".rec_novedad", _cont)
        if (rec_novedad[0]) {
          var valor = parseInt(rec_novedad.text()) - 1
          if (valor > 0) {
            rec_novedad.text(valor)
          } else {
            rec_novedad.remove()
          }
        }
      }

      var extraClass = ""
      if (_extraClass) {
        extraClass = _extraClass
      }

      for (var idCache in mosaicCache) {
        if (mosaicCache.hasOwnProperty(idCache)) {
          var gridCache = mosaicCache[idCache][0]

          $.each(gridCache[0].cell_labels, function (i, label) {
            var cl = ".cell." + _tipoLibro + "_" + _idLibro + extraClass
            var cell = $(cl, label.items)
            if (!cell[0]) {
              cell = label.items.filter(cl)
            }
            if (cell[0]) {
              discount_rec(cell)

              if (cell[0].parentNode) {
                discount_rec(cell[0].parentNode.lbl)

                if (cell[0].parentNode.lbl) {
                  //NOTA!
                  //NO es recursivo, convertir a recursivo cuando se necesite
                  discount_rec(cell[0].parentNode.lbl.itemParent)
                }
              }
            }
          })
        }
      }
    }

    function procBooksDownloaded(cellRawStr) {
      var items = []
      if (cellRawStr.length > 0) {
        var cellsRaw = cellRawStr.split("#")
        $.each(cellsRaw, function () {
          if (this.length > 0) {
            var cellData = this.split("|")

            var idLtotal =
              cellData.length > 3 ? cellData[3].replace("IDLTOTAL_", "") : ""

            var cellDiv = document.createElement("div")
            cellDiv.className =
              "cell " +
              cellData[0].replace("ID", "mydownld") +
              " " +
              cellData[1].toLowerCase() +
              " mydownld " +
              cellData[2].toLowerCase() +
              " erase_bitac" +
              " " +
              idLtotal

            items.push(cellDiv)
          }
        })
      }
      return items
    }

    function postProcBooksDownloaded(items, label) {
      items = $(items)

      LPWrapItems(items)
      $.each(items, function () {
        this.lbl = label
      })

      if (items.length > 30) {
        label.fullItems = items
        items = items.slice(0, 30)
      }
      label.items = items
      $(label).after(items)

      configureLabel(label)
      diagramCellLabels()
      preloadItems(items[0])
    }

    this.recentBooksDownloadedCallback = function (_msg) {
      var msgObj = JSON.parse(_msg)
      var cellRawStr = msgObj.bookCells

      var labelRecs = $(".cell_label.18_1")[0]
      if (labelRecs) {
        var itemsMix = procBooksDownloaded(cellRawStr)

        if (labelRecs.itemsMixDownloads) {
          var seen = {}
          $.each(labelRecs.itemsMixDownloads, function () {
            if (this.className.indexOf("minibookhelp") == -1) {
              var idLtotal = this.className.match(/4_\d+,\d+/)
              if (idLtotal) {
                seen[idLtotal[0]] = true
              }
            }
          })

          var itemsFiltered = []
          $.each(itemsMix, function () {
            var idLtotal = this.className.match(/4_\d+,\d+/)
            if (idLtotal) {
              if (!seen[idLtotal[0]]) {
                itemsFiltered.push(this)
              }
            } else {
              itemsFiltered.push(this)
            }
          })

          $.each(labelRecs.itemsMixDownloads, function () {
            if (this.className.indexOf("minibookhelp") > -1) {
              $(this).addClass("date_9999999999999")
              if (itemsMix.length == 0) {
                itemsFiltered.push(this)
              }
            } else {
              itemsFiltered.push(this)
            }
          })

          itemsFiltered.sort(function (a, b) {
            var d1 = parseInt(a.className.match(/date_\d+/)[0].match(/\d+/)[0])
            var d2 = parseInt(b.className.match(/date_\d+/)[0].match(/\d+/)[0])
            return d2 - d1
          })
        }

        postProcBooksDownloaded(itemsFiltered, labelRecs)
      }
    }

    this.recentBooksDownloadedCallback2 = function (_msg) {
      var msgObj = JSON.parse(_msg)
      var cellRawStr = msgObj.bookCells
      if (cellRawStr.length > 0) {
        createLabelRecientes("18_1", "Continuar leyendo", gridBoxSmall)
      }
    }

    this.coverBookCallback = function (_msg) {
      var msgObj = JSON.parse(_msg)
      var bookID = msgObj.bookID
      var title = msgObj.title
      var author = msgObj.author.split(",")[0]
      var tag = msgObj.tag
      var year = msgObj.year
      var imgB64 = msgObj.imageBase64
      var wc = parseInt(msgObj.w)
      var hc = parseInt(msgObj.h)
      var celldld = $(".cell.mydownld_" + bookID)

      nativeCovers[bookID] = _msg

      if (celldld[0]) {
        celldld.css({ width: "" })

        var wcell = parseInt(celldld[0].offsetWidth)
        var hcell = parseInt(celldld[0].offsetHeight)
        var cRatio = wc / hc
        var nwc = cRatio * hcell

        var maxWidth = $(panelSocial.bodyDiv).hasClass("aumented")
          ? isSmartPhone
            ? 150
            : 180
          : isSmartPhone
            ? 116
            : 135
        if (nwc > maxWidth) {
          nwc = maxWidth
        }
        var mrc = parseInt(wcell - nwc)

        celldld.addClass("cvLD")
        celldld.css({
          width: nwc + "px",
          "margin-right": mrc + "px",
          "background-image": "url('data:image/png;base64," + imgB64 + "')",
        })

        celldld.append(
          '<input type="hidden" class="label" labelname="label_cell_info" value="true"/><input type="hidden" class="label" labelname="label_titulo" value="' +
            title +
            '" /><input type="hidden" class="label" labelname="label_autor_raw" value="' +
            author +
            '"/><input type="hidden" class="label" labelname="label_genero" value="' +
            tag +
            '"/><input type="hidden" class="label" labelname="label_year" value="' +
            year +
            '"/>',
        )
        postProcPortadas([celldld[0]])
      }
    }

    this.resetLabelCallback = function (_msg) {
      var msgObj = JSON.parse(_msg)
      var bookID = msgObj.bookID
      var tipoLabel = msgObj.type
      var formato = msgObj.formato ? msgObj.formato : "format_epub"

      if (tipoLabel == "recientes_ltotal") {
        var bookID2 = msgObj.bookID2
        if (lectorLogueado) {
          that.saveBitacora(1, bookID, bookID2, 1, -1, "", 0, {
            ignorePos: true,
          })
        }
      }
      if (tipoLabel == "recientes") {
        if (lectorLogueado) {
          resetLabel(18, 1, {
            createLabel: true,
            createItem: true,
            idItemBitac: "mydownld_" + bookID,
            extraClass: "mydownld " + formato,
          })
        }
      }
      if (tipoLabel == "descargas") {
        if (lectorLogueado) {
          var labeldld = $(".cell_label.mydownld_1")[0]
          if (labeldld) {
            $(labeldld.items).remove()
            $(labeldld).addClass("load_items")
            loadDataCellLabel(labeldld)
          }
        } else {
          resetLabel("mydownld", 1, {
            createLabel: true,
            createItem: true,
            idItemBitac: "mydownld_" + bookID,
            extraClass: "mydownld " + formato,
          })
        }
      }
    }

    this.refreshLabelCountersCallback = function (_msg) {
      var msgObj = JSON.parse(_msg)
      var bookID = msgObj.bookID
      var tipoLabel = msgObj.type

      if (tipoLabel == "recientes") {
        postRefreshLabelCounters("18_1", "mydownld_" + bookID)
      }
    }

    this.downloadsMosaicCallback = function (_msg) {
      var msgObj = JSON.parse(_msg)
      var cellRawStr = msgObj.bookCells

      var labelMydownld = $(".cell_label.mydownld_1")[0]
      var items = procBooksDownloaded(cellRawStr)
      if (items.length > 0) {
        postProcBooksDownloaded(items, labelMydownld)
      } else {
        var miniBookDiv = $(
          '<div class="cell minibookhelp_mydownld_1"><img class="caraSlider" src="/testLtotal/recursos/mi_biblioteca/emtpy_row.png" /></div>',
        )
        postProcBooksDownloaded([miniBookDiv[0]], labelMydownld)

        var cmdObj = {
          Module: "OfflineApp",
          Action: "DownloadsCount",
          Callback: "panelSocial.mosaico.downloadsCountCallback",
        }
        panelSocial.executeNative(cmdObj)
      }
    }

    this.downloadsMosaicCallback2 = function (_msg) {
      var msgObj = JSON.parse(_msg)
      var cellRawStr = msgObj.bookCells

      var msgObj = JSON.parse(_msg)
      var cellRawStr = msgObj.bookCells
      if (cellRawStr.length > 0) {
        createLabelRecientes("mydownld_1", "Mis descargas", gridBoxSmall)
      }
    }

    this.downloadsCountCallback = function (_msg) {
      var msgObj = JSON.parse(_msg)
      var count = parseInt(msgObj.downloadsCount)
      if (count == 0) {
        ltotalUtils.loadScript(
          panelSocial.getContextoEstaticos() + "/css/ltotal/helper.css",
        )

        var html0 =
          '<div id="ltotal_helper" class="ltotal_helper">\
                <div class="body_helper">\
                    <div class="title_helper">MIS DESCARGAS</div>\
                    <div class="img_helper" style="background-image: url(/estaticosED/files/css/ltotal/helper_images/step_11.png);"></div>\
                    <div class="txt_helper">Aún no tienes descargas para lectura offline. Puedes cargar tus propios libros en formato EPUB o descargar los libros de la biblioteca El Libro Total. Recuerda que este contenido estará disponible sólo en este dispositivo y no en la versión de escritorio.</div>\
                    <div class="close_helper"></div>\
                </div>\
            </div>'
        var cont0 = $(html0)
        $(".close_helper", cont0)[0].onclick = function () {
          cont0.remove()
        }
        $(panelSocial.bodyDiv).append(cont0)
      }
    }

    this.downloadsMosaic = function () {
      if ($(".downloads_mosaic")[0]) {
        return null
      }

      var htmllbl =
        '<div class="cell_label mydownld_1 counter_0 load_items start_visible downloads_mosaic"><div class="tag_label">Mis descargas</div></div>'
      var proc = $("#proceso").html(htmllbl)
      LPWrapItems(proc[0].children)
      mosaico.createMosaic2(
        proc[0].children,
        "libros",
        $('<div class="cell mydownld_mydownld"></div>')[0],
        0,
        { backNav: true },
      )
    }

    this.searchBooksCallback = function (_msg) {
      var msgObj = JSON.parse(_msg)
      var autoComp = that.autoComplete

      if (msgObj.suggestions.length > 0) {
        $.each(msgObj.suggestions, function () {
          autoComp.result.suggestions.push(this)
        })
      }

      that.autoComplete.processResponse(
        autoComp.result,
        autoComp.q,
        autoComp.cacheKey,
      )
    }

    //TABS
    function getTabManager() {
      if (!tabManager) {
        var setts = {
          boxTabs: boxTabs,
          fnAfterActiveTab: function () {
            closeSearch()
            that.setMosaicCache({ backNav: false })
          },
          fnClose: function () {
            restoreLastMosaic()

            $(boxMosaicFull).css({ display: "none" })
          },
        }
        tabManager = new TabsManager(setts)
      }
      tabManager.boxBooks = isTouch ? boxMosaicFull : boxMosaic
      return tabManager
    }

    this.openObjectInTab = function (_objectViewer, _label) {
      getTabManager().setBookContent(_objectViewer, _label)
    }

    this.updateTab = function (_tabID, _nombTab) {
      getTabManager().updateBookTab(_tabID, _nombTab)
    }

    this.destroyTab = function (_tabID) {
      getTabManager().destroyBookTab(_tabID)
    }

    this.zoomTextObjectsTabs = function () {
      getTabManager().zoomTextObjects()
    }
    //FIN. TABS

    function configHTML() {
      var ih = executeNative
        ? $(window).height() + "px"
        : window.innerHeight + "px"

      $("html").css({ height: ih })

      if (isSmartPhone) {
        $(".contentViewer").css({ height: ih })
      } else {
        $(".contentViewer").css({ height: "100%" })
      }
    }

    function repaintFluid() {
      that.configHMarginItems()
      diagramCellLabels()
      configHorizGridBoxes()
      that.rePaintBanner()
    }

    this.repaintFluid = function () {
      repaintFluid()
    }

    this.rePaintBanner = function () {
      createCaratulaBanner($(".banner_ficha_item", gridBoxSmall)[0], {})
    }

    this.rePaint = function () {
      detectDeviceResolution()

      configHTML()

      var tm = getTabManager()
      if (tm.getActiveTab()) {
        tm.rePaint()
      } else {
        repaintFluid()
      }

      panelSocial.rePaintShareModal()
      panelSocial.rePaintModalViewer()
      llector.rePaint()

      generateMenus()
      placeMainBtns()
      that.configBtnLogin()
      that.activateCategsMenuBtns()

      hideCategsMenu({ no_animate: true })

      if (typeof panelVideo !== "undefined") {
        panelVideo.rePaint()
      }
    }

    this.show = function () {
      $(that.mainFrame).fadeTo(200, 1)
    }

    this.hide = function () {
      $(that.mainFrame).fadeTo(200, 0)
    }

    this.getContain = function () {
      return this.mainFrame
    }

    this.getDivContent = function () {
      return contentTxt
    }

    this.activateBtnCerrar = function () {
      $(closeMosaic).css({ display: "block" })
      $(pilarSearch).css({ width: "230px", right: "86px" })
      $(".squared", pilarSearch).css({ width: "192px" })
    }

    this.cerrar = function () {
      //NOTA
      //Esta funcion solo se usa cuando el libro total se abre en una pestana aparte desde otra aplicacion
      window.history.go(-1)
    }

    detectDeviceResolution()
    generateMenus()

    if (settings.modePilars) {
      $(window).resize(that.rePaint)

      window.addEventListener("popstate", that.getBackNavigation, false)

      window.onunload = function () {
        //Elimina registro de bloqueo de edicion del libro
        if (navigator.sendBeacon) {
          if (typeof edicion != "undefined" && edicion.libros.editorVisible) {
            var id_libro = edicion.libros.cont[0].id_libro
            var id_trad = edicion.libros.cont[0].id_trad

            var dblob = new Blob(["test"], { type: "text/plain" })
            navigator.sendBeacon(
              "/ltotal/inicio/edicion_libros.jsp?caso=8&subcaso=2&id_libro=" +
                id_libro +
                "&id_traduccion=" +
                id_trad,
              dblob,
            )
          }
        }
      }

      configHTML()
    }
  }

  //Señal de cargando
  function PanelSOCIALLoaderItem() {
    this.boxLoader = document.createElement("div")
    this.boxLoader.setAttribute("class", "boxLoader")

    var circleA = document.createElement("div")
    circleA.setAttribute("class", "circleLoad circleA")
    $(this.boxLoader).append(circleA)

    this.getContain = function () {
      return this.boxLoader
    }

    this.destroy = function () {
      $(this.boxLoader).remove()
    }
  }

  //Administrador por pestanas de libros y diccionarios abiertos (componentes)
  function TabsManager(opts) {
    var that = this

    var settings = $.extend({}, opts)

    var tabsList = {},
      tabIdx = 0

    //Area de pestanas y herramientas
    var boxTools = settings.boxTabs
    $(boxTools).addClass("TabsManager")

    //Area de visores de los contenidos
    that.boxBooks = null

    var isTouch = ltotalOS.isSmartPhone || ltotalOS.isTablet
    var executeNative = panelSocial.executeNative("TEST")

    this.setBookContent = function (_viewerText, _label) {
      $(that.boxBooks).css({ display: "" })
      reAttachChildren(_viewerText.getContain())

      tabsList["tab_" + tabIdx] = _viewerText
      _viewerText.idTab = tabIdx
      createBookTab(tabIdx, _label)
      tabIdx++
    }

    function createBookTab(_tabID, _nombTab) {
      $(boxTools).css({ display: "block" })

      var tab = document.createElement("div")
      tab.className = "bookTab tab_" + _tabID
      $(tab).html(
        '<div class="tab_label">' +
          _nombTab +
          '</div><div class="buttonClosePesta"></div>',
      )
      $(boxTools).append(tab)

      var tabLabel = $(".tab_label", tab)[0]
      tabLabel.title = _nombTab

      //Boton de cerrar una pestana
      var btnClosePesta = $(".buttonClosePesta", tab)[0]
      btnClosePesta.title = "Cerrar " + _nombTab
      btnClosePesta.onclick = cerrarPestana

      var activeTab = function (_tab) {
        $(".bookTab.active", boxTools).removeClass("active")
        $(_tab).addClass("active")

        if (typeof settings.fnAfterActiveTab == "function") {
          settings.fnAfterActiveTab()
        }
      }

      tab.onclick = function () {
        var idx = this.className.match(/tab_\d+/)[0].match(/\d+/)[0]
        var vT = tabsList["tab_" + idx]

        var reattached = reAttachChildren(vT.getContain())

        if (reattached) {
          activeTab(this)
          that.rePaint()
        }
      }
      activeTab(tab)

      $(tab).animate({ width: "180px" }, 300)
    }

    this.destroyBookTab = function (_tabID) {
      //Elimina el libro del vector
      delete tabsList["tab_" + _tabID]

      var tab = $(".tab_" + _tabID, boxTools)

      var nextTab = tab.next(".bookTab")[0]
      if (!nextTab) {
        nextTab = tab.prev(".bookTab")[0]
      }

      $(tab).animate({ width: "0" }, 200, function () {
        tab.remove()
      })

      if (nextTab) {
        $(nextTab).trigger("click")
      } else {
        cerrar()
      }
    }

    this.updateBookTab = function (_tabID, _nombTab) {
      var tab = $(".tab_" + _tabID, boxTools)
      var tabLabel = $(".tab_label", tab)
      tabLabel.text(_nombTab)
      tabLabel[0].title = _nombTab

      //Boton de cerrar una pestana
      var btnClosePesta = $(".buttonClosePesta", tab)[0]
      btnClosePesta.title = "Cerrar " + _nombTab
    }

    function reAttachChildren(_newChild) {
      var r = false
      var oldChild = $(that.boxBooks).children()

      if ($(_newChild)[0] != oldChild[0]) {
        panelSocial.clearAudioData(oldChild)
        oldChild.detach()

        $(that.boxBooks).append(_newChild)

        r = true
      }

      return r
    }

    function cerrar() {
      resetear()

      $(boxTools).css({ display: "none" })

      if (typeof settings.fnClose == "function") {
        settings.fnClose()
      }
    }

    function resetear() {
      tabsList = {}
      tabIdx = 0

      $(".bookTab", boxTools).remove()
      $(that.boxBooks).children().remove()
    }

    function cerrarPestana(_ev) {
      _ev.stopPropagation()

      var tab = $(this).parents(".bookTab")[0]
      var idx = tab.className.match(/tab_\d+/)[0].match(/\d+/)[0]

      var vT = tabsList["tab_" + idx]
      vT.cerrar()
    }

    this.getActiveTab = function () {
      return $(".bookTab.active", boxTools)[0]
    }

    this.rePaint = function () {
      var tab = that.getActiveTab()
      if (tab) {
        var idTab = tab.className.match(/tab_\d+/)[0].match(/\d+/)[0]
        var vT = tabsList["tab_" + idTab]

        var display = $(vT.getContain()).css("display")
        if (display == "none") {
          $(vT.getContain()).css({ display: "" })
        }

        var extra = isTouch && executeNative ? { forcedRepaint: true } : {}
        vT.rePaint(extra)
      }
    }

    this.zoomTextObjects = function () {
      for (var key in tabsList) {
        if (tabsList.hasOwnProperty(key)) {
          $(tabsList[key].boxViewerTXT)[0].zoomedText = true
        }
      }
    }
  }

  //////// Html内置js，全部重新做一次 Initialization
  var contentVIEWER = null
  var alertLM = null
  var audiosEwall = null
  var dataMusicEwall = null
  var executeNative = false
  var executeNativePlatform = false
  var hayDeepLink = false
  var deepLinkUrl = null
  var initScriptsLoaded = false
  var idSesion = "0DF421047363AE1F370C563BAE934432"

  window.onload = function () {
    try {
      executeNative = ltotalUtils.executeNative("TEST")
      if (executeNative) {
        executeNativePlatform = ltotalUtils.executeNative("PLATFORM")
      }
    } catch (e) {}

    // initPanelSocial();
    initLtotal()

    setTimeout(function () {
      goForScripts(1)
      goForCSSs()
    }, 1200)
  }

  function goForScripts(_c) {
    var scripts = [
      "/js/jquery-ui-1.13.3.min.js",
      "/js/jquery.jSuggest.js",
      "/js/dragger-1.0.0.js",
      "/js/filtrohtml-1.0.0.js",
      "/js/multicolumn-1.0.0.js",
      "/js/imgViewer-1.0.2.js",
      "/js/panelPTI-1.0.0.js",
      "/js/dicc_total-1.0.0.js",
      "/js/AlertLM-1.0.0.js",
      "/js/dialogueLM-1.0.1.js",
      "/js/ltotal/modalViewerLT.js",
      "/js/ltotal/jquery.autocomplete.js",
      "/js/viewerTxt-1.0.4.js",
      "/js/ltotal/viewerTxtServices-1.0.0.js",
      "/js/ltotal/globo-audiolectura-1.0.0.js",
      "/js/ltotal/llector-1.0.0.js",
      "/js/ltotal/corpus.js",
      "/js/rangy-core.js",
      "/js/diff_match_patch.js",
      "/js/ltotal/edicion.js",
      "/js/ltotal/editToolbar-1.0.0.js",
      "/js/ltotal/fisher-1.0.0.js",
      "/js/ltotal/share-1.0.0.js",
      "/js/ltotal/clipboard.min.js",
      "/js/ltotal/panelMusic-1.0.0.js",
      "/js/rangy-cssclassapplier.js",
    ]

    var xhrs = []
    for (var i = 0; i < scripts.length; i++) {
      var addr = "/estaticosED/files" + scripts[i]
      xhrs.push(ltotalUtils.loadScripts(addr, _c))
    }
    $.when.apply($, xhrs).then(
      function () {
        initScriptsLoaded = true

        rangy.init()
        alertLM = new AlertLM()

        edicion.iniciar()
      },
      function (_e) {
        if (_c < 10) {
          goForScripts(_c + 1)
        }
      },
    )
  }

  function goForCSSs() {
    var csss = [
      "/css/jquery-ui.custom.min.css",
      "/css/dicc_total-1.0.0.css",
      "/css/imgViewer-1.0.0.css",
      "/css/scrollSyc-1.0.0.css",
      "/css/PanelAlert-1.0.0.css",
      "/css/dialogueLM-1.0.1.css",
      "/css/jSuggest.css",
      "/css/ltotal/modalViewerLT.css",
      "/css/viewerTxt-1.0.4.css",
      "/css/ltotal/corpus.css",
      "/css/ltotal/viewerTxtComparado-1.0.0.css",
      "/css/ltotal/llector-1.0.0.css",
      "/css/ltotal/fisher-1.0.0.css",
      "/css/ltotal/edicion-1.0.0.css",
      "/css/ltotal/multipage-1.0.0.css",
      "/css/ltotal/editToolbar-1.0.0.css",
      "/css/ltotal/share-1.0.0.css",
      "/css/ltotal/panelMusic-1.0.0.css",
    ]

    for (var i = 0; i < csss.length; i++) {
      ltotalUtils.loadScript("/estaticosED/files" + csss[i])
    }
  }

  function initPanelSocial() {
    var ltotalOSConfig = {
      bridged: false,
      //repoDir: "https://www.syc.com.co/estaticos/repo_ltotal",
      //queryURLPrefix: "EscritorioUniversal/LtotalBridge.aspx"
      //queryURLPrefix: "http://www.ellibrototal.com"
      //queryURLPrefix: "http://test.ellibrototal.com.co"
      queryURLPrefix: "",
    }
    ltotalOS.init(ltotalOSConfig)

    var btnCerrar = $.trim(gup("btnCerrar"))

    var settings = {
      withLogin: true,
      contMusicHostDiv: ".boxBread",
      btnCerrar: btnCerrar,
    }

    panelSocial = new PanelSOCIAL(settings)
  }

  function initLtotal() {
    var isSmartPhone = ltotalOS.isSmartPhone
    var isTablet = ltotalOS.isTablet
    var isTouch = isSmartPhone || isTablet

    if (!contentVIEWER) {
      if (isSmartPhone) {
        contentVIEWER = new ContentViewer_mobile({
          name: "contentVIEWER",
          content: "",
          height: $(window).height(),
          background: "transparent",
          closeButton: false,
          title: "",
        })

        contentVIEWER.removeBtnTop("backLevel")
        contentVIEWER.removeBtnTop("backLevel_SocialApps")
        contentVIEWER.setTitle("")
        contentVIEWER.addClassContainViewer("ltotalClass")
      } else {
        contentVIEWER = new ContentViewer({
          name: "contentVIEWER",
          buttonsBar: false,
          titleBar: false,
          fixed: true,
          background: "transparent",
          closeButton: false,
        })
      }

      $(".mainContent", contentVIEWER.mainFrame).css({
        "background-color": "transparent",
      })

      $(".topBar, .bottomBar", contentVIEWER.mainFrame).remove()
      $(contentVIEWER.mainFrame).css({
        display: "block",
        width: "100%",
        height: "100%",
        "background-color": "transparent",
      })
    }

    LTotalWebAppReady()

    setTimeout(function () {
      document.body.appendChild(contentVIEWER.mainFrame)

      var extra = {}
      extra.idCliente = 1

      panelSocial.setNativeMainViewBGColor(11, 28, 43)

      $(".mainContent").css({ width: "100%", height: "100%", top: "0" })
      panelSocial.initLibroTotal(contentVIEWER, postloadCallback, extra)
    }, 150)
  }

  function postloadCallback() {
    if (initScriptsLoaded) {
      var isSmartPhone = ltotalOS.isSmartPhone
      var isTablet = ltotalOS.isTablet
      var isTouch = isSmartPhone || isTablet

      //Estadistica de visitas a la interfaz eDesk
      ltotalOS.statistics(81, navigator.userAgent.toLowerCase())

      var extraNav = { isTouch: isTouch }

      //Llama funciones despues del cargue del sistema
      var huboURL = processURL(extraNav)

      if (!huboURL) {
        huboURL = processLastNavigation(extraNav)
      }

      promoNativeApp({ isTouch: isTouch, huboURL: huboURL })

      panelSocial.getLaunchCounter()
      processDeepLink()
    } else {
      setTimeout(function () {
        postloadCallback()
      }, 800)
    }
  }

  function LTotalWebAppReady() {
    var cmdObj = { Module: "App", Action: "LTotalWebAppReady" }
    var cmdNat = panelSocial.executeNative(cmdObj)
  }

  function processDeepLink() {
    var cmdObj = {
      Module: "App",
      Action: "ProcessDeepLink",
      Callback: "processDeepLinkCallback",
    }
    var cmdNat = panelSocial.executeNative(cmdObj)
  }

  function processDeepLinkCallback(_msg) {
    var cb = JSON.parse(_msg)
    deepLinkUrl = cb.deepLinkUrl
    if ($.trim(deepLinkUrl).length > 0) {
      if (deepLinkUrl.indexOf("/ltotal/passwd.jsp") != -1) {
        return restorePassword()
      }

      hayDeepLink = true
      deepLinkUrl = deepLinkUrl
        .replace(/t_item/gi, "t")
        .replace(/id_item/gi, "d")
        .replace(/\&id_filter\=/gi, "_")
        .replace(/idLibro/gi, "t=1&d")
      processURL(null)
    }
  }

  function getIdDedicatoria() {
    var idDed = ""
    var g = gup("g")
    if ($.trim(g).length > 0) {
      idDed = g
    } else {
      var gi = gup("gi")
      if ($.trim(gi).length > 0) {
        idDed = gi
      }
    }

    return idDed
  }

  //Obtiene el valor de un parametro en la url
  function gup(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]")
    var regexS = "[\\?#&]" + name + "=([^&#]*)"
    var regex = new RegExp(regexS)
    var results =
      executeNative && hayDeepLink
        ? regex.exec(deepLinkUrl)
        : regex.exec(window.location.href)
    if (results == null) return ""
    else return results[1]
  }

  function processURL(_extra) {
    //Oculta el buscador de moviles
    $(".searchLT").blur()
    $(".boxSearchMos").hide()
    $(".autocomplete-suggestions").hide()

    var data = $.trim(gup("d")).split(/,|_/)
    var tipo = $.trim(gup("t"))

    if (tipo.length == 0) {
      tipo = $.trim(gup("c"))
    }
    if (tipo.length == 0) {
      tipo = 1
    }

    return openNavigation(tipo, data, _extra)
  }

  function processLastNavigation(_extra) {
    var r = false
    var navData = ltotalUtils.fromLocalStorage("lastNavData")
    if (navData) {
      navData = navData.split("_")
      r = openNavigation(navData.shift(), navData)

      localStorage.removeItem("lastNavData")
    }
    return r
  }

  function openNavigation(tipo, data, _extra) {
    var hayData = data.length > 0
    var idLibro = -1
    var idTrad = -1
    var numePagina = 1
    var huboURL = false

    if (tipo == 1 && hayData) {
      //Revisa si el libro es publico
      idLibro = data[0]
      idTrad = data[1]

      if (!idLibro) {
        return null
      }

      var getBookExtraData = function () {
        if (data.length > 2) {
          numePagina = data[2]
        }

        var extra = {
          numePagina: numePagina,
        }

        if (data[3]) {
          extra.numePaginaPercent = data[3]
        }

        var dedicatoria = getIdDedicatoria()
        if (dedicatoria.length > 0) {
          extra.idRegalo = dedicatoria
        }

        //Abre el libro subrayado con nota de personaje (15) relacionada
        var rel = $.trim(gup("rel"))
        if (rel.length > 0) {
          rel = rel.split("_")
          extra.idRecRela = rel[1]
          extra.npagRecRela = numePagina
          extra.idNotaRecRela = -1
        }

        var coord = $.trim(gup("txt_coord"))
        if (coord.length > 0) {
          extra.txtCoord = coord
        }

        return extra
      }

      var willOpenBook = true
      var nbk = gup("nbk")
      if (nbk.length > 0 && nbk == "1") {
        willOpenBook = false
      }

      if (willOpenBook) {
        var sb = panelSocial.selectedBook
        if (sb) {
          sb.cerrar()
        }
      }

      $.post(
        "/ltotal/inicio/utils/ut_10.jsp",
        "tipo_item=1&id_libro=" + idLibro,
        function (d) {
          var libroOK = d.indexOf("libro_ok") > -1
          if (!libroOK) {
            return null
          }

          var item = document.createElement("div")
          item.className = "cell 1_" + idLibro + " cvLD"
          item.style.display = "inline-block"

          var doOpenTries = 1
          var postProcBook = function () {
            var doOpenBook = function () {
              doOpenTries++
              var banner = $(".caratula_banner")[0]
              if (banner && banner.childElementCount > 0) {
                if (idTrad) {
                  panelSocial.openBook(1, idLibro, idTrad, getBookExtraData())
                }
              } else {
                if (doOpenTries <= 5) {
                  setTimeout(doOpenBook, 1000)
                }
              }
            }
            if (willOpenBook) {
              doOpenBook()
            }
          }

          var xhr1 = panelSocial.clickSobreItem(
            item,
            "libros",
            panelSocial.mosaico,
            getBookExtraData(),
          )
          if (xhr1) {
            xhr1.done(postProcBook)
          } else {
            postProcBook()
          }
        },
      )

      huboURL = true
    }

    if (tipo == 3 && hayData) {
      //Autor
      if (!data[1]) {
        data[1] = 1
      }

      var idAutor = parseInt(data[0])
      var tipoAutor = parseInt(data[1])
      idLibro = parseInt(data[2])
      var idIlust = parseInt(data[3])

      if (tipoAutor == 1) {
        //autor de libros
      }

      if (tipoAutor == 6) {
        //Autor de imagenes

        //Cerrar visor de imagenes
        var bvi = $(".boxViewerImg")
        if (bvi[0]) {
          $(".closeViewer").trigger("click")
        }

        $.post(
          "/ltotal/inicio/utils/ut_2.jsp",
          "id_autor=" + idAutor + "&id_libro=" + idLibro,
          function (_d) {
            var imagsIds = _d
              .replace(/\n|\r/g, "")
              .replace(/(,$|:fin)/, "")
              .split(",")
            panelSocial.processIdsImages(imagsIds, idIlust)
          },
        )
      }

      var item = document.createElement("div")
      item.className = "cell 3_" + idAutor + " cvLD"
      item.style.display = "inline-block"
      panelSocial.clickSobreItem(item, "libros", panelSocial.mosaico)

      huboURL = true
    }

    if (tipo == 4 && hayData) {
      idTrad = data[0]

      var sb = panelSocial.selectedBook
      if (sb) {
        sb.cerrar()
      }

      var url = "/ltotal/inicio/utils/ut_48.jsp"
      var params = { caso: "1", id_trad: idTrad }

      panelSocial.doPost(url, params).done(function (_data) {
        var p = $("#proceso").html(_data)
        idLibro = parseInt($(".hdn_id_lib", p).val())

        var extra = {}
        if (data.length > 1) {
          extra.numePagina = data[1]
        }
        panelSocial.openBook(1, idLibro, idTrad, extra)
      })
    }

    if (tipo == 6 && hayData) {
      var idImg = data[0]
      panelSocial.processIdsImages([idImg], idImg)
    }

    if (tipo == 10 && hayData) {
      var idMusic = data[0]

      var extraMusic = {}
      if (_extra && _extra.isTouch) {
        extraMusic.stopMusic = true
      }
      panelSocial.openMusicByID(idMusic, extraMusic)

      huboURL = true
    }

    if (tipo == 15 && hayData) {
      var sb = panelSocial.selectedBook
      if (sb) {
        sb.cerrar()
      }

      if (data.length == 1) {
        var idRec = data[0]
        panelSocial.openBookPersoByIDRec(idRec)
      } else {
        var idProy = data[0]
        var idNote = data[1]

        panelSocial
          .getSeccionLibroByIDNota(32, idProy, idNote)
          .then(function (_nsec) {
            var extra = {
              numeSeccion: _nsec,
            }

            if (data[2]) {
              extra.numePaginaPercent = data[2]
            }

            var dedicatoria = getIdDedicatoria()
            if (dedicatoria.length > 0) {
              extra.idRegalo = dedicatoria
            }

            panelSocial.openBook(32, idProy, -1, extra)
          })
      }
      huboURL = true
    }

    if (tipo == 16 && hayData) {
      var idWord = data[0]
      panelSocial.openDiccTotal(null, null, {
        idWord: idWord,
        casoRela: 1,
        openInTab: true,
      })

      huboURL = true
    }

    if (tipo == 17 && hayData) {
      var idArticle = data[0]

      if (!idArticle) {
        return null
      }

      var item = document.createElement("div")
      item.className = "cell 17_" + idArticle + " cvLD"
      item.style.display = "inline-block"
      panelSocial.clickSobreItem(item, "libros", panelSocial.mosaico)

      huboURL = true

      //NOTA!!
      //En futuro expandir para que se pueda abrir el articulo y ubicarse en la pagina y porcentaje
    }

    if (tipo == 27 && hayData) {
      var idProy = data[0]
      var idNote = "0"

      if (data[1]) {
        idNote = data[1].split(":")[0]
      }

      //var idNotePage = 0;
      //NOTA!!
      //data[1].split(":")[1] contiene el numero de pagina de la nota

      panelSocial
        .getSeccionLibroByIDNota(27, idProy, idNote)
        .then(function (_nsec) {
          if (_nsec < 0) {
            var item = document.createElement("div")
            item.className = "cell 27_" + idProy + " cvLD"
            item.style.display = "inline-block"
            return panelSocial.clickSobreItem(
              item,
              "libros",
              panelSocial.mosaico,
            )
          }

          var extra = {
            numeSeccion: _nsec,
          }

          //Abre el libro de investigacion subrayado con nota de personaje (15) relacionada
          var rel = $.trim(gup("rel"))
          var relaData = null
          if (rel.length > 0) {
            rel = rel.split("_")
            extra.idRecRela = rel[1]
            extra.npagRecRela = -1
            extra.idNotaRecRela = idNote
          }

          panelSocial.openBook(27, idProy, -1, extra)
        })

      huboURL = true
    }

    if (tipo == 32 && hayData) {
      idLibro = data[0]

      if (!idLibro) {
        return null
      }

      var item = document.createElement("div")
      item.className = "cell 32_" + idLibro + " cvLD"
      item.style.display = "inline-block"
      panelSocial.clickSobreItem(item, "libros", panelSocial.mosaico)

      huboURL = true
    }

    if (tipo == 51 && hayData) {
      var idVideo = data[0]
      if (!idVideo) {
        return null
      }

      $.post(
        "/ltotal/inicio/utils/ut_10.jsp",
        "tipo_item=51&id_video=" + idVideo,
        function (d) {
          var videoOK = d.indexOf("video_ok") > -1
          if (!videoOK) {
            return null
          }

          var item = document.createElement("div")
          item.className = "cell 51_" + idVideo + " cvLD"
          item.style.display = "inline-block"
          panelSocial.clickSobreItem(item, "videos", panelSocial.mosaico)
        },
      )

      huboURL = true
    }

    if (tipo == "phev") {
      //Abre el libro con fotografia del lector tomada como promocion en la feria
      //phev es el parametro 'ph'oto 'ev'ent
      var idFotoPromo = data[0]
      if (idFotoPromo) {
        $.post(
          "/ltotal/inicio/utils/ut_43.jsp",
          "idFotoPromo=" + idFotoPromo,
          function (d) {
            var idLib = d.match(/idLib_\d+/)[0].match(/\d+/)[0]
            var idTrad = d.match(/idTrad_\d+/)[0].match(/\d+/)[0]
            panelSocial.openBook(1, idLib, idTrad, {
              idFotoPromo: idFotoPromo,
              numePagina: 1,
            })
          },
        )
      }

      huboURL = true
    }

    if (tipo == "contacto") {
      //Abre contenedor de contactenos
      panelSocial.mosaico.showContactenos()

      huboURL = true
    }

    if (tipo == "mlnk") {
      var sb = panelSocial.selectedBook
      if (sb) {
        sb.cerrar()
      }

      var mosaicLink = gup("d")
      panelSocial.openMosaicLink(mosaicLink)
    }

    return huboURL
  }

  function getSYCCredentials() {
    var ku = $.trim(gup("ku"))
    var ki = $.trim(gup("ki"))
    var kp = $.trim(gup("kp"))

    if (ku.length > 0 && ki.length > 0 && kp.length) {
      $(document.body).append(
        '<input id="Valor1" type="hidden" value="' + ki + '" />',
      )
      $(document.body).append(
        '<input id="Valor2" type="hidden" value="' + ku + '" />',
      )
      $(document.body).append(
        '<input id="Valor3" type="hidden" value="' + kp + '" />',
      )
    }
  }

  function nativeMessage(_msg) {
    panelSocial.nativeMessage(JSON.parse(_msg))
  }

  function promoNativeApp(_extra) {
    if (_extra.isTouch && !executeNative && !_extra.huboURL) {
      var yaVisto = ltotalUtils.fromLocalStorage("promoNativeApp")
      if (!yaVisto) {
        var boxModalAPP = document.createElement("div")
        boxModalAPP.setAttribute("class", "boxModalAPP")
        $(contentVIEWER.mainFrame).append(boxModalAPP)

        var containApps = document.createElement("div")
        containApps.setAttribute("class", "containApps")

        var titleApps = document.createElement("div")
        titleApps.setAttribute("class", "titleApps")
        titleApps.innerHTML = "Para una mejor experiencia descarga nuestra app!"
        $(containApps).append(titleApps)

        var boxIOS = document.createElement("div")
        boxIOS.setAttribute("class", "boxAppSO boxIOS")
        $(containApps).append(boxIOS)
        var htmlIOS =
          "<a class='hrefIOS' href='https://itunes.apple.com/us/app/el-libro-total-biblioteca/id1298628446?mt=8'></a>"
        $(boxIOS).append(htmlIOS)

        var boxANDROID = document.createElement("div")
        boxANDROID.setAttribute("class", "boxAppSO boxANDROID")
        $(containApps).append(boxANDROID)
        var htmlANDROID =
          "<a class='hrefANDR' href='http://play.google.com/store/apps/details?id=com.syc.librototal.El_Libro_Total'></a>"
        $(boxANDROID).append(htmlANDROID)

        var modalAPP = new ModalViewerLT({
          hostDiv: boxModalAPP,
          widthV: "80%",
          leftV: "10%",
          heightV: "60%",
          topV: "15%",
          rightV: "0px",
          addClassViewer: "modalAPP",
          clickPreClose: function () {},
          clickClose: function () {
            $(".boxModalAPP").remove()
            ltotalUtils.toLocalStorage("promoNativeApp", true)
          },
        })

        modalAPP.addContent(containApps)
      }
    }
  }

  function restorePassword() {
    if (executeNative) {
      var iframeURL = deepLinkUrl + "&isIframe=1"

      panelSocial.createIFRAME({
        hostDiv: panelSocial.bodyDiv,
        id: "iframePasswd",
        url: iframeURL,
        close: function () {
          panelSocial.cancelFullscreen()
        },
      })
    }
  }

  function getAScript(_path, _url, _c) {
    var addr = _path + _url + "?v=" + _c
    var xhr = new XMLHttpRequest()
    xhr.open("GET", addr, false)

    xhr.onload = function (_e) {
      var s = _e.target.status
      if (s >= 200 && s < 300) {
        var se = document.createElement("SCRIPT")
        se.id = _url
        se.type = "text/javascript"
        se.text = xhr.responseText
        document.getElementsByTagName("head")[0].appendChild(se)
      }
      if (s >= 400 && s < 500) {
        if (_c < 10) {
          getAScript(_path, _url, _c + 1)
        }
      }
    }

    xhr.send(null)
  }

  //////////////////////////////////////////////////
  // 外部js文件结束

  // 重新创建 panelSocial 实例，打上补丁
  delete window.panelSocial
  initPanelSocial()

  // 保存 选择高亮文本 至 selectedText
  function handleSelection() {
    const selectedText = window.getSelection().toString().trim()
    if (selectedText) {
      GM_setValue("sharedText", selectedText) // 存储到 GM_setValue
      console.log("选定的文本已存储到 GM_setValue：", selectedText)
    }
  }
  // 监听 selectionchange 事件
  document.addEventListener("selectionchange", handleSelection)
  // 监听 mouseup 事件
  document.addEventListener("mouseup", handleSelection)

  // 创建 MutationObserver 实例 (observer2)
  const observer2 = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes) {
        mutation.addedNodes.forEach((node) => {
          if (
            node.nodeType === Node.ELEMENT_NODE &&
            node.classList.contains("modalViewerLT")
          ) {
            console.log("modalViewerLT 元素已出现！")
            // 在这里执行你想要的操作

            // 找到 div 元素
            const closeModalViewerDiv = document.querySelector(
              "div.closeModalViewer",
            )

            // const toolDeleteElement = document.querySelector('.tool_delete');

            // 立即点击关闭
            closeModalViewerDiv.click()

            // 定义点击事件处理函数
            function handleClick() {
              console.log("closeModalViewer 被点击了！")
              // 在这里添加你想要执行的操作
              closeModalViewerDiv.click()
            }

            // 找到 noteSignatureDiv 元素
            const noteSignatureDiv =
              document.querySelector("div.note_signature")
            // 找到 divNoteSignature 元素
            const contentHtmlDiv = document.querySelector("div.contentHtml")
            // 如果找到 noteSignatureDiv ，则 contentHtmlDiv 添加点击事件监听器
            if (noteSignatureDiv) {
              contentHtmlDiv.addEventListener("click", handleClick)
              console.log("点击事件监听器已添加。")
            } else {
              console.log("未找到 contentHtml div 元素。")
            }

            // 如果只需要执行一次，可以取消观察
            // observer2.disconnect();
          }
        })
      }
    })
  })

  // 配置观察选项 (config2)
  const config2 = { childList: true, subtree: true }

  // 开始观察目标元素
  observer2.observe(document.body, config2)

  // 创建 MutationObserver 实例
  const observer1 = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes) {
        mutation.addedNodes.forEach((node) => {
          if (
            node.nodeType === Node.ELEMENT_NODE &&
            node.id === "div_nota_visor"
          ) {
            console.log("div_nota_visor 元素已找到！")

            // 找到 input 元素
            let inputElement = document.querySelector("input.nota_title")

            // 如果找到，则设置其 value 属性为 "hello"
            if (inputElement) {
              const notaTitle = GM_getValue("sharedText", "") // 从 GM_getValue 获取
              inputElement.value = notaTitle
            }

            function getLocalDateTimeISO() {
              const now = new Date()
              const year = now.getFullYear()
              const month = String(now.getMonth() + 1).padStart(2, "0")
              const day = String(now.getDate()).padStart(2, "0")
              const hours = String(now.getHours()).padStart(2, "0")
              const minutes = String(now.getMinutes()).padStart(2, "0")
              const seconds = String(now.getSeconds()).padStart(2, "0")

              return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
            }

            const targetElement = document.querySelector(
              "#div_nota_visor > div.div_section_top > div.editor_area.editor_area_notas > p",
            )

            if (targetElement) {
              // 修改内部文本

              targetElement.textContent = getLocalDateTimeISO()

              console.log("元素文本已修改！")
            } else {
              console.log("未找到目标元素！")
            }

            const btnSalvar = document.querySelector(".btn_salvar")

            if (btnSalvar) {
              console.log("找到 btn_salvar 元素：", btnSalvar) // 在这里可以对找到的元素执行操作

              btnSalvar.click()
            } else {
              console.log("未找到 btn_salvar 元素")
            } // observer1.disconnect() // 停止观察
          }
        })
      }
    })
  })

  // 配置观察选项

  const config1 = { childList: true, subtree: true }

  // 开始观察目标元素

  observer1.observe(document.body, config1)

  console.log("开始监测 div_nota_visor 元素...")

  //////

  // 创建 MutationObserver 实例

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes) {
        mutation.addedNodes.forEach((node) => {
          if (
            node.nodeType === Node.ELEMENT_NODE &&
            node.classList.contains("nota_no_publica")
          ) {
            console.log("titulo_2 元素已找到！") // 查找并点击 closeLight 元素

            const closeLightButton = document.querySelector(
              ".closeLight.pg_center_left.book_icon",
            )

            if (closeLightButton) {
              closeLightButton.click()

              console.log("closeLight 元素已点击！")
            } else {
              console.log("closeLight 元素未找到！")
            } // observer.disconnect(); // 停止观察
          }
        })
      }
    })
  }) // 配置观察选项

  const config = { childList: true, subtree: true } // 开始观察目标元素

  observer.observe(document.body, config)

  console.log("开始监测 titulo_2 元素...")

  ////////

  ////////

  const observer4 = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (
          node.nodeType === Node.ELEMENT_NODE &&
          node.classList.contains("tipo_17")
        ) {
          console.log("tipo_17 element found (observer4):", node)
          // 在这里添加您想要执行的操作

          const elements = document.querySelectorAll(".tipo_17") // 获取所有 class 为 tipo_17 的元素

          function openEudicLink(element) {
            const searchText = element.textContent.trim() // 获取元素文本内容并去除首尾空格
            const eudicLink = `eudic-es://dict/${encodeURIComponent(searchText)}` // 构建欧路词典链接
            window.location.href = eudicLink
          }

          elements.forEach((element) => {
            element.addEventListener("click", () => openEudicLink(element))
            element.addEventListener("touchend", () => {
              console.log(element.className)

              const classString = element.className
              const classArray = classString.split(" ") // 使用空格分割字符串
              const lastClass = classArray.pop() // 获取数组的最后一个元素
              const classArray1 = lastClass.split("_") // 使用空格分割字符串
              const idToBeDeleted = classArray1.pop() // 获取数组的最后一个元素
              console.log("打印id")
              console.log(idToBeDeleted)

              GM_setValue("idToBeDeleted", idToBeDeleted) // 存储到 GM_setValue

              element.id = "span_" + idToBeDeleted
            })
          })
        }
      })
    })
  })

  const config4 = { childList: true, subtree: true }

  observer4.observe(document.body, config4)

  console.log("Monitoring tipo_17 elements (observer4)...")

  ////////

  function handleClick() {
    console.log("myDeleteButton clicked!")
    // 在这里添加您的事件处理逻辑
    // 实现直接删除

    function showToast(message, title = "提示", timeout = 2000) {
      GM_notification({
        text: message,
        title: title,
        timeout: timeout,
      })
    }

    const idToBeDeleted = GM_getValue("idToBeDeleted", "")
    const spanElement = document.getElementById("span_" + idToBeDeleted)

    const deleteNote = function () {
      var url = "/ltotal/lector/editNota.jsp"
      var params = {
        caso: 5,
        tipoNota: 17,
        idNota: idToBeDeleted, // 从 GM_getValue 获取
      }
      panelSocial.doPost(url, params).done(() => {
        console.log("进行删除，处理span")

        // const idToBeDeleted = GM_getValue("idToBeDeleted", "");
        // const spanElement = document.getElementById("span_" + idToBeDeleted);
        console.log(spanElement)

        spanElement.style.backgroundColor = "#efefef"

        // 示例：发送 toast 消息
        showToast(idToBeDeleted, "已删除")
      })
    }

    deleteNote()
  }

  const observer5 = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (
          node.nodeType === Node.ELEMENT_NODE &&
          node.id === "myDeleteButton"
        ) {
          console.log("myDeleteButton element found!")
          node.addEventListener("click", handleClick)
          console.log("Click event listener added to myDeleteButton.")
          // observer.disconnect(); // 找到元素后停止观察
        }
      })
    })
  })

  const config5 = { childList: true, subtree: true }

  observer5.observe(document.body, config5)

  console.log("Monitoring for myDeleteButton element...")
})()
