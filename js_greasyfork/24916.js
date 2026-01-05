// ==UserScript==
// @name         Theme tweaker LN
// @namespace    https://openuserjs.org/scripts/akuma06/Theme_tweaker_LN
// @supportURL   https://openuserjs.org/scripts/akuma06/Theme_tweaker_LN/issues
// @icon         https://orig00.deviantart.net/19e5/f/2012/125/2/0/ebook_icon_png_by_crankin88-d4yl70x.png
// @version      0.9.1
// @description  This script provides some useful tools for ln translation website like a FullScreen Reader and some design style change for better readability. I provide the software as is, you can fully modify it to your likings :) 
// @copyright    2016, akuma06
// @author       akuma06
// @license      MIT
// @match        http://krytykal.org/*
// @match        http://www.machineslicedbread.xyz/*
// @match        http://avertranslation.org/*
// @match        http://www.rebirth.online/*
// @match        http://www.comegatranslations.com/*
// @match        https://firebirdsnest.org/*
// @match        https://rancerqz.com/*
// @match        https://koreanovels.com/*
// @match        https://shurimtranslation.com/*
// @match        https://www.ehmed.xyz/*
// @match        https://www.readlightnovel.org/*
// @match        http://volarenovels.com/*
// @match        http://snowycodex.com/*
// @match        http://www.sousetsuka.com/*
// @match        http://blastron01.tumblr.com/*
// @match        http://razpyon.tumblr.com/*
// @match        https://comettranslations.weebly.com/*
// @match        https://birdytranslations.com/*
// @match        https://rpgnovels.com/*
// @match        https://creativenovels.com/*
// @match        http://novelsnchill.com/*
// @match        https://lightnovelstranslations.com/*
// @match        http://tseirptranslations.com/*
// @match        http://infinitenoveltranslations.net/*
// @match        https://pumlated.wordpress.com/*
// @match        https://idletranslations.wordpress.com/*
// @match        https://twomorefreethoughts.wordpress.com/*
// @match        https://tenseiken.wordpress.com/*
// @match        https://theworsttranslation.wordpress.com/*
// @match        https://omegaharem.wordpress.com/*
// @match        https://weitranslations.wordpress.com/*
// @match        https://pizzasandcoke.wordpress.com/*
// @match        https://pengutaichou.wordpress.com/*
// @match        https://procrastranslation.wordpress.com/*
// @match        https://grimgarthetranslation.wordpress.com/*
// @match        https://oniichanyamete.wordpress.com/*
// @match        https://kobatochan.com/*
// @match        https://xiose.net/*
// @match        https://dsrealmtranslations.com/*
// @match        https://martialdao.com/*
// @match        https://kakkokaritranslations.com/*
// @match        http://www.mistycloudtranslations.com/*
// @match        http://www.liberspark.com/*
// @match        http://www.wolfiehonyaku.com/*
// @match        https://psicern.wordpress.com/*
// @match        https://knightsoflunadia.wordpress.com/*
// @match        http://www.yamitranslations.com/*
// @match        http://www.wuxiaworld.com/*
// @match        http://www.radianttranslations.com/*
// @match        https://zirusmusings.com/*
// @match        http*://moonbunnycafe.com/*
// @match        https://isekailunatic.wordpress.com/*
// @match        https://addnewtab.wordpress.com/*
// @match        http*://yukkuri-literature-service.blogspot.com/*
// @match        http*://handofvecna.blogspot.com/*
// @match        http://gravitytales.com/*
// @match        https://re-library.com/*
// @match        https://www.webnovel.com/book/*
// @require      http://code.jquery.com/jquery-latest.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/24916/Theme%20tweaker%20LN.user.js
// @updateURL https://update.greasyfork.org/scripts/24916/Theme%20tweaker%20LN.meta.js
// ==/UserScript==
/* jshint asi:true */
var $ = window.jQuery
var regexp = {
  "krytykal\.org/.*": "krytykal_org",
  "avertranslation\.org/.*": "avertranslation_org",
  "readlightnovel\.org/.*": "readlightnovel_org",
  "firebirdsnest\.org/.*": "firebirdsnest_org",
  "tseirptranslations\.com/.*": "tseirptranslations_com",
  "snowycodex\.com/.*": "snowycodex_com",
  "www\.webnovel\.com/.*": "www_webnovel_com",
  "www\.machineslicedbread\.xyz/.*": "www_machineslicedbread_xyz",
  "www\.ehmed\.xyz/.*": "www_ehmed_xyz",
  "www\.wolfiehonyaku\.com/.*": "www_wolfiehonyaku_com",
  "re-library\.com/.*": "re_library_com",
  "rancerqz\.com/.*": "rancerqz_com",
  "shurimtranslation\.com/.*": "shurimtranslation_com",
  "birdytranslations\.com/.*": "birdytranslations_com",
  "lightnovelstranslations\.com/.*": "lightnovelstranslations_com",
  "gravitytales\.com/.*": "gravitytales_com",
  "infinitenoveltranslations\.net/.*": "infinitenoveltranslations_net",
  "xiose\.net/.*": "xiose_net",
  "moonbunnycafe\.com/.*": "moonbunnycafe_com",
  "zirusmusings\.com/.*": "zirusmusings_com",
  "dsrealmtranslations\.com/.*": "dsrealmtranslations_com",
  "kobatochan\.com/.*": "kobatochan_com",
  "creativenovels\.com/.*": "creativenovels_com",
  "volarenovels\.com/.*": "volarenovels_com",
  "novelsnchill\.com/.*": "novelsnchill_com",
  "martialdao\.com/.*": "martialdao_com",
  "koreanovels\.com/.*": "koreanovels_com",
  "comettranslations\.weebly\.com/.*": "comettranslations_weebly_com",
  "www\.yamitranslations\.com/.*": "www_yamitranslations_com",
  "www\.comegatranslations\.com/.*": "www_comegatranslations_com",
  "www\.rebirth\.online/.*": "www_rebirth_online",
  "www\.mistycloudtranslations\.com/.*": "www_mistycloudtranslations_com",
  "www\.sousetsuka\.com/.*": "www_sousetsuka_com",
  "www\.wuxiaworld\.com/.*": "www_wuxiaworld_com",
  "www\.radianttranslations\.com/.*": "www_radianttranslations_com",
  "www\.liberspark\.com/.*": "www_liberspark_com",
  "twomorefreethoughts\.wordpress\.com/.*": "twomorefreethoughts_wordpress_com",
  "theworsttranslation\.wordpress\.com/.*": "theworsttranslation_wordpress_com",
  "pumlated\.wordpress\.com/.*": "pumlated_wordpress_com",
  "idletranslations\.wordpress\.com/.*": "idletranslations_wordpress_com",
  "weitranslations\.wordpress\.com/.*": "weitranslations_wordpress_com",
  "tenseiken\.wordpress\.com/.*": "tenseiken_wordpress_com",
  "blastron01\.tumblr\.com/.*": "blastron01_tumblr_com",
  "razpyon\.tumblr\.com/.*": "razpyon_tumblr_com",
  "omegaharem\.wordpress\.com/.*": "omegaharem_wordpress_com",
  "pengutaichou\.wordpress\.com/.*": "pengutaichou_wordpress_com",
  "addnewtab\.wordpress\.com/.*": "addnewtab_wordpress_com",
  "pizzasandcoke\.wordpress\.com/.*": "pizzasandcoke_wordpress_com",
  "procrastranslation\.wordpress\.com/.*": "pizzasandcoke_wordpress_com",
  "rpgnovels\.com/.*": "rpgnovels_com",
  "kakkokaritranslations\.com/.*": "kakkokaritranslations_com",
  "grimgarthetranslation\.wordpress\.com/.*": "grimgarthetranslation_wordpress_com",
  "oniichanyamete\.wordpress\.com/.*": "oniichanyamete_wordpress_com",
  "psicern\.wordpress\.com/.*": "psicern_wordpress_com",
  "knightsoflunadia\.wordpress\.com/.*": "knightsoflunadia_wordpress_com",
  "isekailunatic\.wordpress\.com/.*": "isekailunatic_wordpress_com",
  "handofvecna\.blogspot\.com/.*": "handofvecna_blogspot_com",
  "yukkuri-literature-service\.blogspot\.com/.*": "yukkuri_literature_service_blogspot_com"
}

function Infobox(params) {
  this.clicked = []
  var callback = params.callback
  var appendTo = (params.append !== undefined) ? params.append : $("body")
  var buttons = (params.buttons !== undefined) ? params.buttons : {
    Ok: () => {
      return
    }
  }
  var parentDiv = $("<div></div>").css({
    position: "fixed",
    zIndex: 10000,
    background: "none",
    display: "flex",
    textAlign: "center",
    margin: 0,
    padding: 0,
    top: "0",
    left: "0",
    right: "0",
    bottom: "0"
  })
  var infoDiv = $("<div></div>").css({
    background: "rgba(171, 171, 171, 0.88)",
    display: "inline-block",
    color: "white",
    borderRadius: "1em",
    boxShadow: "0 0 19px 2px black",
    padding: "2em",
    margin: "auto"
  })
  this.close = function () {
    if (callback !== undefined) {
      callback(this)
    }
    $(parentDiv).remove()
  }
  var self = this
  $(infoDiv).html($("<p></p>").html(params.text))
  var divButtons = $("<div></div>").css({
    textAlign: "center"
  })
  this.addButton = (name, button) => {
    if (button instanceof Function) {
      $(divButtons).append($("<button></button>").css({
        marginRight: "3px"
      }).text(name).click((e) => {
        e.preventDefault()
        self.clicked.push(name)
        button(self)
        self.close()
      }))
    }
    else if (button instanceof Object) {
      $(divButtons).append($("<button></button>").css({
        marginRight: "3px"
      }).text(button.name).click((e) => {
        e.preventDefault()
        self.clicked.push(name)
        button.action(self)
      }))
    }
  }
  for (var btn in buttons) {
    this.addButton(btn, buttons[btn])
  }
  infoDiv.append(divButtons)
  parentDiv.html(infoDiv)
  appendTo.append(parentDiv)
  return parentDiv
}

function Toast(params) {
  var div = $("<div></div>").html(params.text).css(Object.assign({
    fontSize: "1rem",
    position: "fixed",
    zIndex: "10001",
    bottom: "30px",
    opacity: 0,
    borderRadius: "2px",
    left: "50%",
    padding: "16px",
    textAlign: "center",
    color: "#fff",
    backgroundColor: "#333",
    marginLeft: "-125px",
    minWidth: "250px",
    visibility: "hidden"
  }, params.styles))
  $("body").append(div)
  this.hide = () => {
    div.animate({
      bottom: 0,
      opacity: 0
    }, 500, function () {
      $(this).css({
        visibility: "hidden"
      })
      if (params.onclose !== undefined) params.onclose.bind(this)()
    })
  }
  this.show = () => {
    div.css({
      visibility: "visible"
    }).animate({
      bottom: "30px",
      opacity: 1
    }, 500)
  }
  this.animate = () => {
    this.show()
    return setTimeout(this.hide, 3000)
  }
}

function Tweaker(params) {
  var self = this
  const state = {
    loading: false,
    rendered: false,
    autoOpen: false,
    readerMode: false,
    showComments: false,
    typing: false,
    links: {
      next: "",
      previous: ""
    },
    title: "",
    fontSize: 24,
    article: null,
    comments: null,
    commentsJSON: null
  }
  this.state = state
  var events = {
    defaults: {
      statechanged: (e) => {
        if (e.params.newState === undefined) {
          console.error("NewState was not defined when statechanged event emitted")
          return
        }
        this.state = state
        if (e.params.newState.article !== undefined) {
          this.getContent().find("> div.post-article").html(this.state.article)
        }
        if (e.params.newState.title !== undefined) {
          if (e.params.newState.title !== "" && e.params.oldState.title !== e.params.newState.title)
            this.getContent().find("> h1.post-title").text(this.state.title).show()
          else this.getContent().find("> h1.post-title").hide()
        }
        if (e.params.newState.commentsJSON !== undefined) {
          this.loadComments()
        }
        if (e.params.newState.comments !== undefined) {
          this.getActive().find("> div.post-comments > div.list-comments").html(this.state.comments)
          let linkComments = this.getContent().find("> a.commentslink").show()
          if (this.state.comments === null || this.state.comments.length === 0) {
            linkComments.text("No Comments")
            this.getContent().css({
              border: "none",
              margin: "auto"
            })
            this.getActive().find("> div.post-comments").css("display", "none")
          }
          else {
            linkComments.text("Comments")
          }
        }
        if (e.params.newState.fontSize !== undefined) {
          this
        }
      },
      loadstarted: (e) => {
        this.setState({
          loading: true
        })
      },
      loadfinished: (e) => {
        this.setState({
          loading: false
        })
      },
      rendered: (e) => {
        $('<link href="https://fonts.googleapis.com/css?family=Merriweather:700,400,400i" rel="stylesheet">').appendTo("head")
        this.setState({
          rendered: true
        })
      },
      readermodestart: (e) => {
        this.setState({
          readerMode: true
        })
        sessionStorage.setItem("readerMode", true)
        this.Popup($(e.params.link))
      },
      readermodeclose: (e) => {
        this.getActive().remove()
        $("body").css("overflow", "")
        $("html").css("overflow", "")
        sessionStorage.setItem("readerMode", false)
        this.active = undefined
        this.setState({
          readerMode: false
        })
      },
      nextpage: (e) => {
        if (this.state.links.next !== undefined)
          window.location.href = this.state.links.next
      },
      previouspage: (e) => {
        if (this.state.links.previous !== undefined)
          window.location.href = this.state.links.previous
      },
      scroll: (e) => {
        if (this.state.loading)
          return
        if (this.active.scrollHeight <= (this.active.scrollTop + 1.3 * this.active.offsetHeight) || this.active.scrollTop <= 0.3 * this.active.offsetHeight) {
          localStorage.removeItem(window.location.href)
          return
        }
        localStorage.setItem(window.location.href, this.active.scrollTop)
      }
    }
  }
  this.setState = (newState) => {
    let oldState = Object.assign({}, state)
    Object.assign(state, newState)
    this.emit("statechanged", {
      newState: newState,
      oldState: oldState
    })
  }
  this.addEventListener = (name, callback) => {
    if (events[name] === undefined) events[name] = []
    events[name].push(callback)
  }
  this.emit = (name, params) => {
    if (events[name] === undefined && events.defaults[name] === undefined) return
    const event = {
      allowDefault: true,
      params: params,
      allowPropagation: true,
      stopImmediatePropagation: function () {
        this.allowPropagation = false
      },
      preventDefault: function () {
        this.allowDefault = false
      }
    }
    if (events[name] !== undefined) {
      for (let i = 0; i < events[name].length; i++) {
        if (event.allowPropagation)
          events[name][i].bind(this)(event)
      }
    }
    if (event.allowDefault && events.defaults[name] !== undefined) events.defaults[name].bind(this)(event)
  }
  this.getActive = () => $(this.active)
  this.getContent = () => this.getActive().find("> div.post-content")
  this.active = undefined
  this.mapF = (arr, text) => {
    return arr.map(function (ind, obj) {
      return ($(obj).text().match(new RegExp(text, 'i'))) ? obj : undefined
    })[0]
  }
  this.mapFExact = (arr, text) => {
    return arr.map(function (ind, obj) {
      return ($(obj).text() == text) ? obj : undefined
    })[0]
  }
  var textTitle = (params !== undefined && params.title !== undefined) ? params.title.bind(this) : () => {
    return $(".entry-title")
  }
  var icon, iconClose
  if (params !== undefined) {
    switch (params.icon) {
      case "noticon":
        icon = "noticon noticon-external"
        iconClose = "noticon noticon-close"
        break;
      case "genericon":
        icon = "genericon genericon-external"
        iconClose = "genericon genericon-close"
        break;
      case "fa":
        icon = "fa fa-external-link"
        iconClose = "fa fa-close"
        break;
      case "fa5":
        icon = "fas fa-external-link-alt"
        iconClose = "fas fa-times"
        break;
      case "dashicons":
        icon = "dashicons dashicons-external"
        iconClose = "dashicons dashicons-close"
        break;
      default:
        icon = (params.icon !== undefined && params.icon.open !== undefined) ? params.icon.open : undefined
        iconClose = (params.icon !== undefined && params.icon.close !== undefined) ? params.icon.close : undefined
        break;
    }
  }
  var contentDiv = (params !== undefined && params.content !== undefined && params.content.find !== undefined) ? params.content.find.bind(this) : (link) => {
    return $(link).parent().parent().siblings(".entry-content")
  }
  var filter = (params !== undefined && params.content !== undefined && params.content.filter !== undefined) ? ((params.content.filter !== "") ? params.content.filter.bind(this) : (content) => {
    return content
  }) : (content) => {
    return $(content).find("> *:not(.sharedaddy)")
  }
  var nextLink = (params !== undefined && params.next !== undefined && params.next.find !== undefined) ? params.next.find.bind(this) : (link, text) => {
    return this.mapF($(contentDiv(link)).find("a"), text)
  }
  var prevLink = (params !== undefined && params.prev !== undefined && params.prev.find !== undefined) ? params.prev.find.bind(this) : (link, text) => {
    return this.mapF($(contentDiv(link)).find("a"), text)
  }
  var commentList = (params !== undefined && params.comments !== undefined && params.comments.list !== undefined) ? params.comments.list.bind(this) : () => {
    return $(".comment-list")
  }
  var findComments = (params !== undefined && params.comments !== undefined && params.comments.elements !== undefined) ? params.comments.elements.bind(this) : (list) => {
    return $(list).find(".comment article")
  }
  var commentForm = (params !== undefined && params.comments !== undefined && params.comments.form !== undefined) ? params.comments.form.bind(this) : () => {
    if ($("div#respond").length > 0)
      return $("div#respond")
    return undefined
  }
  var comment = function (list, ind) {
    this.context = list[ind]
    this.index = ind
    this.styles = {
      avatar: {},
      pseudo: {},
      date: {},
      likes: {},
      comment: {}
    }
    this.setContext = (list, ind) => {
      this.context = list[ind]
      this.index = ind
    }
    this.getAvatar = () => {
      return $(this.context).find("img.avatar")[0]
    }
    this.getComment = () => {
      return $(this.context).find("div.comment-content")[0].innerHTML
    }
    this.getPseudo = () => {
      return $(this.context).find(".fn")[0].textContent
    }
    this.getDate = () => {
      return $(this.context).find("time")[0].textContent
    }
    this.getLikes = () => {
      return ""
    }
    this.render = () => {
      let commentDiv = $("<div></div>").css({
        borderBottom: "1px solid grey"
      })
      let avatar = (this.getAvatar() === "") ? "" : $("<img />").css(Object.assign({
        height: 44,
        width: 44,
        marginRight: "5px",
        verticalAlign: "middle"
      }, this.styles.avatar)).attr("src", this.getAvatar().src)
      let commentHeader = $("<div></div>").append($("<h3></h3>").append(avatar)
        .append($("<span></span>").css(this.styles.pseudo).text(this.getPseudo())))
      let commentContent = $("<div></div>").css(this.styles.comment).html(this.getComment())
      let commentFooter = $("<div></div>").css({
        display: "flex"
      }).append($("<div></div>").css(this.styles.likes).html(this.getLikes())).append($("<div></div>").css(Object.assign({
        textAlign: "right"
      }, this.styles.date)).text(this.getDate()))
      return commentDiv.append(commentHeader).append(commentContent).append(commentFooter)
    }
  }

  var nextText = (params !== undefined && params.next !== undefined && params.next.text !== undefined) ? params.next.text : "Next"
  var prevText = (params !== undefined && params.prev !== undefined && params.prev.text !== undefined) ? params.prev.text : "Previous"
  var styles = (params !== undefined) ? params.styles : undefined
  this.navigation = (context) => {
    if (params !== undefined && params.navigation !== undefined) params.navigation.bind(this)(context)
    else this.navigationCallback(context)
  }
  this.Render = () => {
    this.addEventListener("loadstarted", function (e) {
      this.setState({
        article: "Loading...",
        comments: null,
        title: "",
        loading: true
      })
      this.getContent().find("> a.commentslink").hide()
      e.stopImmediatePropagation()
    })
    if (params.after !== undefined && params.after instanceof Function) {
      this.addEventListener("readermodeopened", params.after)
    }
    if (params.before !== undefined && params.before instanceof Function) {
      this.addEventListener("renderstart", params.before)
    }
    this.emit("renderstart")
    if (GM_getValue("firstlaunch") !== true) {
      new Infobox({
        text: "Welcome to LN Reader!<br>You can read LN in fullscreen mode by clicking on the link next to the Chapter title.<br>Furthermore, you move to the next/previous page with your left/right arrow keys.<br><em>Have fun reading!</em>",
        callback: () => GM_setValue("firstlaunch", true)
      })
    }
    let tagIcon = (icon !== undefined) ? $("<i></i>").attr("class", icon).css("font-size", "1.5em") : "&plusmn;Reader"
    let linkOpen = $('<a href="" style="float:right;"></a>').html(tagIcon).click(function (e) {
      e.preventDefault()
      self.open($(this))
    })
    // console.log("Applying popup link...")
    this.setState({
      title: $(textTitle()).text()
    })
    $(textTitle()).append(linkOpen)
    this.navigation()
    let readerMode = sessionStorage.getItem("readerMode")
    if (readerMode == "true") {
      this.setState({
        autoOpen: true
      })
      this.open($($(textTitle()).find("a:last")[0]))
    }
    let commentsOpen = localStorage.getItem(this.state.title + "_c")
    if (commentsOpen == "true" && !this.state.showComments) {
      this.toggleComments()
    }
    // console.log("Rendering done!")
    this.emit("rendered")
  }
  this.open = (link) => {
    this.emit("readermodestart", {
      link: link
    })
  }
  this.Popup = (context) => {
    // console.log("Opening popup...")
    let containerStyle = (params.styles !== undefined && params.styles.container !== undefined) ? params.styles.container : {}
    let container = $("<div></div>").attr("tabindex", 0).attr("data-reader", "lnreader").css(Object.assign({
      zIndex: "9999",
      background: "#EEE",
      width: "100%",
      height: "100%",
      position: "fixed",
      top: "0",
      left: "0",
      overflow: "auto",
      padding: "20px 0px",
      fontSize: this.state.fontSize + "px",
      display: "grid",
      gridTemplateColumns: "1fr auto",
      lineHeight: "1.8"
    }, containerStyle))
    let titleBlock = $("<h1></h1>").attr("class", "post-title").text(this.state.title).css({
      borderBottom: "1px solid black",
      paddingBottom: "0.5em",
      textAlign: "center",
      marginBottom: "0.5em"
    })
    let contentStyle = (params.styles !== undefined && params.styles.content !== undefined) ? params.styles.content : {}
    let contentBlock = $("<div></div>").attr("class", "post-content").css(Object.assign({
      width: "60%",
      minWidth: "700px",
      maxWidth: "1200px",
      height: "auto",
      margin: "auto",
      padding: "2.5em",
      fontFamily: "Merriweather,serif",
      fontWeight: "400",
      background: "white",
      color: "black",
      textAlign: "justify",
      wordWrap: "break-word"
    }, contentStyle))
    let article = $("<div></div>").attr("class", "post-article")
    let closeIconStyle = (params.styles !== undefined && params.styles.close !== undefined && params.styles.close.icon !== undefined) ? params.styles.close.icon : {}
    let closeIcon = (iconClose !== undefined) ? $("<i></i>").attr("class", iconClose).css(Object.assign({
      fontSize: "2em"
    }, closeIconStyle)) : "&times;"
    let closeLinkStyle = (params.styles !== undefined && params.styles.close !== undefined && params.styles.close.link !== undefined) ? params.styles.close.link : {}
    let linkClose = $("<a href=''></a>").html(closeIcon).css(Object.assign({
      position: "fixed",
      border: "none",
      left: "82%",
      top: "40px",
      fontSize: "3.5em"
    }, closeLinkStyle)).click(function (e) {
      e.preventDefault()
      self.close()
    })
    let contentCommentsStyle = (params.styles !== undefined && params.styles.comments !== undefined && params.styles.comments.panel !== undefined) ? params.styles.comments.panel : {}
    let contentComments = $("<div></div>").attr("class", "post-comments").css(Object.assign({
      display: "none",
      minWidth: "250px",
      background: "white",
      padding: "1em",
      fontSize: "0.75em"
    }, contentCommentsStyle)).append($("<div></div>").addClass("list-comments"))
    let formComments = commentForm()
    if (formComments !== undefined) {
      $(formComments).find("textarea").focus(() => {
        this.setState({
          typing: true
        })
      }).blur(() => {
        this.setState({
          typing: false
        })
      })
    }
    let linkComments = $("<a href=''></a>").attr("class", "commentslink").text("...").css({
      display: "block",
      border: "1px solid #673ab7",
      color: "#673ab7",
      borderRadius: "5px",
      padding: "4px 10px",
      width: "fit-content",
      margin: "auto",
      textAlign: "center"
    }).click(function (e) {
      e.preventDefault()
      self.toggleComments()
    })
    $("body").append(container.append(
      contentBlock.append(article)
      .prepend(titleBlock).prepend(linkClose).append(linkComments)
    ).prepend(contentComments.append(formComments))).css("overflow", "hidden")
    $(container).focus().on("click", function (e) {
      if ($(this)[0].webkitRequestFullscreen !== undefined) $(this)[0].webkitRequestFullscreen()
      else $(this)[0].mozRequestFullScreen()
    })
    this.active = $(container)[0]
    let fullscreenElement = (document.webkitFullscreenElement !== undefined) ? document.webkitFullscreenElement : document.mozFullScreenElement

    if (localStorage.getItem(window.location.href) !== null) {
      new Infobox({
        text: "We have saved where you left when reading this chapter, do you want to resume?",
        buttons: {
          Yes: () => {
            let active = $("div[data-reader='lnreader']")[0]
            active.scrollTop = localStorage.getItem(window.location.href)
            active.focus()
          },
          No: () => localStorage.removeItem(window.location.href)
        },
        append: this.getActive()
      })
    }
    else if ((this.state.autoOpen) && (fullscreenElement === null)) {
      if (GM_getValue("no_more_fullscreen_mess") !== true)
        new Infobox({
          text: `We can't make the reader completely fullscreen without user gesture. You have to click on the reader or press <span style="border:1px white solid;padding:5px 5px;border-radius:5px;margin:0 2px;display:inline-block;">Enter</span> to be in fullscreen mode.`,
          buttons: {
            Ok: () => {
              let active = $("div[data-reader='lnreader']")[0]
              if (active.webkitRequestFullscreen !== undefined) active.webkitRequestFullscreen()
              else active.mozRequestFullScreen()
              active.focus()
            },
            DontShow: {
              name: "Don't Show again",
              action: (infobox) => {
                GM_setValue("no_more_fullscreen_mess", true);
                infobox.close()
              }
            }
          },
          append: this.getActive()
        })
      else
        new Toast({
          text: 'Press <span style="border:1px white solid;padding:5px 5px;border-radius:5px;margin:0 2px;display:inline-block;">Enter</span> for fullscreen',
          onclose: function () {
            $(this).remove()
          }
        }).animate()
    }
    if ($(container)[0].webkitRequestFullscreen !== undefined) $(container)[0].webkitRequestFullscreen()
    else $(container)[0].mozRequestFullScreen()
    $("html").css("overflow", "hidden")
    // console.log("Looking for next/prev links...")
    this.setState({
      article: $(filter(contentDiv(context))).clone()
    })
    this.loadComments()
    this.navigation(context)
    // console.log("Popup opened!")
    this.emit("readermodeopened")
  }

  this.close = () => {
    this.emit("readermodeclose")
  }

  this.loadComments = () => {
    let comments = findComments(commentList())
    let renderedComments = []
    for (let i = comments.length - 1; i >= 0; i--) {
      let c = new comment(comments, i)
      if (params !== undefined && params.comments !== undefined && params.comments.comment !== undefined) {
        c = Object.assign(c, params.comments.comment)
      }
      if (params !== undefined && params.styles !== undefined && params.styles.comments !== undefined) {
        c.styles = Object.assign(c.styles, params.styles.comments.item)
      }
      renderedComments[i] = c.render()
    }
    this.setState({
      comments: renderedComments
    })
    this.emit("commentsloaded")
  }

  this.toggleComments = () => {
    if (this.active !== undefined && this.state.comments !== null && this.state.comments.length > 0) {
      let container = this.getActive()
      let commentBlock = this.getActive().find("> div")[0]
      let contentBlock = this.getContent()[0]
      if (!this.state.showComments) {
        $(contentBlock).css({
          borderLeft: "1px solid grey",
          margin: "0"
        })
        $(commentBlock).css({
          display: "block"
        })
        this.active.scrollTop = 0
      }
      else {
        $(contentBlock).css({
          border: "none",
          margin: "auto"
        })
        $(commentBlock).css({
          display: "none"
        })
      }
      localStorage.setItem(this.state.title + "_c", !this.state.showComments)
      this.setState({
        showComments: !this.state.showComments
      })
    }
  }

  this.navigationCallback = (context) => {
    if (context === undefined) {
      return
    }
    let links = {
      next: "",
      previous: ""
    }
    let nextHref = $(nextLink(context, nextText)).attr("href")
    if (nextHref) {
      links.next = nextHref
      // console.log("Next link found")
    }
    let previousHref = $(prevLink(context, prevText)).attr("href")
    if (previousHref) {
      links.previous = previousHref
      // console.log("Previous link found")
    }
    this.setState({
      links: links
    })
    this.attachEvents()
  }

  this.attachEvents = () => {
    this.getActive().keyup(function (e) {
      if ((e.which == 39) && (self.state.links.next !== "") && (self.state.links.next !== undefined) && !self.state.typing) {
        e.preventDefault()
        self.next()
        // console.log("Moving to Next Page")
      }
      else if ((e.which == 37) && (self.state.links.previous !== "") && (self.state.links.previous !== undefined) && !self.state.typing) {
        e.preventDefault()
        self.previous()
        // console.log("Moving to Previous Page")
      }
    })
    if (this.active !== undefined) {
      var timeoutWheel = null
      $(document).keyup((e) => {
        let fullscreenElement = (document.webkitFullscreenElement !== undefined) ? document.webkitFullscreenElement : document.mozFullScreenElement
        if (e.which == 13 && fullscreenElement === null) {
          if (self.active.webkitRequestFullscreen !== undefined) self.active.webkitRequestFullscreen()
          else self.active.mozRequestFullScreen()
        }
      })
      this.getActive().keyup(function (e) {
        if ((e.which == 40) && (self.state.links.next !== "") && (self.state.links.next !== undefined) && !self.state.typing) {
          self.hideup(e, true)
        }
        else if ((e.which == 38) && (self.state.links.previous !== "") && (self.state.links.previous !== undefined) && !self.state.typing) {
          self.hidedown(e, true)
        }
        else if (e.which == 27) {
          self.close()
        }
      }).keydown(function (e) {
        if ((e.which == 40) && (self.state.links.next !== "") && (self.state.links.next !== undefined) && !self.state.typing && !self.state.loading) {
          self.hideup(e)
        }
        else if ((e.which == 38) && (self.state.links.previous !== "") && (self.state.links.previous !== undefined) && !self.state.typing && !self.state.loading) {
          self.hidedown(e)
        }
      }).scroll(() => {
        self.emit("scroll")
      }).on("mousewheel", (e) => {
        if (self.state.loading) {
          return;
        }
        clearTimeout(timeoutWheel)
        if ((e.originalEvent.wheelDelta > 0) && (self.state.links.previous !== "") && (self.state.links.previous !== undefined)) {
          self.hidedown()
          timeoutWheel = setTimeout(() => self.hidedown(undefined, true), 200)
        }
        else if ((e.originalEvent.wheelDelta < 0) && (self.state.links.next !== "") && (self.state.links.next !== undefined)) {
          self.hideup()
          timeoutWheel = setTimeout(() => self.hideup(undefined, true), 200)
        }
      })
    }
  }
  this.next = () => {
    this.emit("loadstarted")
    this.emit("nextpage")
  }
  this.previous = () => {
    this.emit("loadstarted")
    this.emit("previouspage")
  }
  this.hideup = function (e, reset) {
    if (this.active !== undefined) {
      let div = this.getActive().find("> div")
      if (reset) {
        $(div).css({
          position: "",
          top: 0
        })
        return
      }
      if (this.active.scrollHeight <= (this.active.scrollTop + this.active.offsetHeight + 1)) {
        if (e !== undefined) e.preventDefault()
        $(div).css({
          position: "relative"
        })
        var pos = (div[0].style.top.replace("px", "") !== "") ? parseFloat(div[0].style.top.replace("px", "")) : -1
        pos = (pos >= 0) ? -1 : pos
        if (-pos > this.active.offsetHeight) {
          this.next(this)
        }
        else {
          pos -= -0.2 * pos
          if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
            pos -= 0.05 * this.active.offsetHeight
          }
          $(div).css("top", pos + "px")
        }
      }
    }
  }
  this.hidedown = function (e, reset) {
    if (this.active !== undefined) {
      let div = this.getActive().find("div")
      if (reset) {
        $(div).css({
          position: "",
          top: 0
        })
        return
      }
      if (this.active.scrollTop === 0) {
        if (e !== undefined) e.preventDefault()
        $(div).css({
          position: "relative"
        })
        var pos = (div[0].style.top.replace("px", "") !== "") ? parseFloat(div[0].style.top.replace("px", "")) : 1
        pos = (pos <= 0) ? 1 : pos
        if (pos > this.active.offsetHeight) {
          this.previous(this)
        }
        else {
          pos += 0.2 * pos
          if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
            pos += 0.05 * this.active.offsetHeight
          }
          $(div).css("top", pos + "px")
        }
      }
    }
  }
}

let tweakes = {
  krytykal_org: {
    before: () => {
      $(".main-navigation .nav-menu ul li > a").each(function () {
        this.style.setProperty("color", "black", "important")
        $(this).hover(function () {
          this.style.setProperty("color", "#e74c3c", "important")
        }, function () {
          this.style.setProperty("color", "black", "important")
        })
      })
      $(".main-navigation ul.children").css("background", "#2f3c4e")
      $(".main-navigation ul.children").css("border-left", "1px solid rgba(255,255,255,0.2)")
      $(".main-navigation ul.children li").css("border", "0")

      $(".main-navigation ul.children li a").each(function () {
        this.style.setProperty("color", "white", "important")
        this.style.setProperty("background", "none", "important")
        this.style.setProperty("font-family", "'Open Sans', 'Droid Arabic Kufi', Arial, sans-serif", "important")
        $(this).hover(function () {
          this.style.setProperty("color", "#e74c3c", "important")
        }, function () {
          this.style.setProperty("color", "white", "important")
        })
      })
      $("#page").css("color", "black")
      $("#page").css("background", "white")
    }
  },
  avertranslation_org: {
    before: () => {
      $("#menu-menu-1 li > a").each(function () {
        this.style.setProperty("color", "black", "important")
        $(this).hover(function () {
          this.style.setProperty("color", "#e74c3c", "important")
        }, function () {
          this.style.setProperty("color", "black", "important")
        })
      })
      $("#menu-menu-1 ul.sub-menu").css("background", "#2f3c4e")
      $("#menu-menu-1 ul.sub-menu").css("border-left", "1px solid rgba(255,255,255,0.2)")
      $("#menu-menu-1 ul.sub-menu li").css("border", "0")

      $("#menu-menu-1 ul.sub-menu li a").each(function () {
        this.style.setProperty("color", "white", "important")
        this.style.setProperty("background", "none", "important")
        this.style.setProperty("font-family", "'Open Sans', 'Droid Arabic Kufi', Arial, sans-serif", "important")
        $(this).hover(function () {
          this.style.setProperty("color", "#e74c3c", "important")
        }, function () {
          this.style.setProperty("color", "white", "important")
        })
      })
      $("#page").css("color", "black")
      $("#page").css("background", "white")
      $("#access").css("background", "white")

    }
  },
  firebirdsnest_org: {
    before: () => {
      $(".hentry").css("color", "black")
      $(".hentry").css("background", "white")
      $("#menu li > a").each(function () {
        this.style.setProperty("color", "black", "important")
        $(this).hover(function () {
          this.style.setProperty("color", "#e74c3c", "important")
        }, function () {
          this.style.setProperty("color", "black", "important")
        })
      })
      $("#menu ul.sub-menu").css("background", "#2f3c4e")
      $("#menu ul.sub-menu").css("border-left", "1px solid rgba(255,255,255,0.2)")
      $("#menu ul.sub-menu li").css("border", "0")

      $("#menu ul.sub-menu li a").each(function () {
        this.style.setProperty("color", "white", "important")
        this.style.setProperty("background", "none", "important")
        this.style.setProperty("font-family", "'Open Sans', 'Droid Arabic Kufi', Arial, sans-serif", "important")
        $(this).hover(function () {
          this.style.setProperty("color", "#e74c3c", "important")
        }, function () {
          this.style.setProperty("color", "white", "important")
        })
      })
      $("#menu").css({
        background: "white",
        float: "none",
        margin: "auto"
      }).append($("<div></div>").css("clear", "both"))
      $("#container").css("width", "100%")
      $("#main").css("width", "70%")
      $("#page-wrap").css({
        width: "90%",
        minWidth: "1000px"
      })
      $("#sidebar").css({
        width: "26%"
      })
      $(".widget").css({
        padding: 0,
        width: "100%"
      })
      $(".widget > *").css({
        marginLeft: "15px",
        marginBottom: "15px"
      })
      $(".widget-title").css({
        position: "static",
        width: "100%",
        marginLeft: 0,
        marginBottom: 0
      })
    },
    content: {
      find: () => {
        return $("#main .entry-content")
      },
      filter: ""
    },
    icon: "noticon",
  },
  tseirptranslations_com: {
    title: () => {
      return $(".content .post-title")
    },
    content: {
      find: (link) => {
        return $(link).parent().parent().siblings(".post-content")
      },
      filter: (content) => {
        return $(content).find(">*:not(.sd-block)")
      }
    },
    icon: "genericon",
  },
  pumlated_wordpress_com: {
    icon: "noticon",
    prev: {
      find: () => {
        return $("a[rel='prev']")
      }
    },
    next: {
      find: () => {
        return $("a[rel='next']")
      }
    }
  },
  handofvecna_blogspot_com: {
    content: {
      filter: (content) => {
        return $(content).html()
      }
    },
    comments: {
      list: () => {
        return $("#top-ra")
      },
      elements: (list) => {
        return $(list).find(".comment")
      },
      form: () => $("#top-ce"),
      comment: {
        getPseudo: function () {
          return $(this.context).find(".comment-block .comment-header .user").text()
        },
        getComment: function () {
          return $(this.context).find(".comment-block .comment-content").html()
        },
        getAvatar: function () {
          return $(this.context).find(".avatar-image-container img")[0]
        },
        getDate: function () {
          return $(this.context).find(".comment-block .comment-header .datetime").text()
        },
      }
    },
    prev: {
      text: "PREV"
    },
    styles: {
      comments: {
        panel: {
          color: "black"
        },
        item: {
          pseudo: {
            color: "black"
          }
        },
      }
    }
  },
  yukkuri_literature_service_blogspot_com: {},
  pizzasandcoke_wordpress_com: {
    icon: "noticon",
  },
  idletranslations_wordpress_com: {
    icon: "noticon",
  },
  grimgarthetranslation_wordpress_com: {
    title: () => {
      return $(".page .page-title")
    },
    content: {
      find: (link) => {
        return $(link).parent().parent().siblings(".page-body")
      },
      filter: (content) => {
        return $(content).find("> *:not(.sharedaddy)>*")
      }
    },
    icon: "noticon",
  },
  omegaharem_wordpress_com: {
    icon: "noticon",
  },
  tenseiken_wordpress_com: {
    prev: {
      find: () => {
        return $(".nav-previous a[rel='prev']")
      },
    },
    next: {
      find: () => {
        return $(".nav-next a[rel='next']")
      },
    },
    icon: "noticon",
  },
  isekailunatic_wordpress_com: {
    icon: "noticon",
  },
  oniichanyamete_wordpress_com: {
    icon: "noticon",
  },
  pengutaichou_wordpress_com: {
    icon: "noticon",
  },
  infinitenoveltranslations_net: {
    icon: "genericon",
    before: () => {
      $("#xyz").prepend($("#xyz div").remove().html())
    }
  },
  birdytranslations_com: {
    content: {
      find: (link) => {
        return $(link).parent().parent().siblings(".entry-wrapper")
      },
      filter: (content) => {
        return $(content).find(".entry-content>*:not(.sharedaddy)")
      }
    },
    icon: "genericon",
    next: {
      text: "Next"
    },
    prev: {
      text: "Last"
    }
  },
  moonbunnycafe_com: {
    content: {
      find: (link) => {
        return $(link).parent().siblings(".entry-content")
      }
    },
    icon: "dashicons",
    comments: {
      list: () => {
        return $("#comments .commentlist")
      },
      elements: (list) => {
        return $(list).find(".comment")
      },
      comment: {
        getPseudo: function () {
          return $(this.context).find(".fn").text()
        },
        getComment: function () {
          return $(this.context).find(".comment-body").html()
        },
        getDate: function () {
          return $(this.context).find(".comment-meta").text()
        },
      },
    }
  },
  psicern_wordpress_com: {
    icon: "noticon",
    next: {
      text: "→"
    },
    prev: {
      text: "←"
    }
  },
  www_wuxiaworld_com: {
    icon: "fa",
    before: (title, content) => {
      if (window.location.href.match("wmw-index")) {
        var parseChildren = (child) => {
          if ($(child).children().length > 0) {
            $(child).children().each(function () {
              parseChildren($(this))
            })
          }
          $(child).html($(child).html().replace(/!/g, "."))
        }
        parseChildren($(content))
      }
    }
  },
  knightsoflunadia_wordpress_com: {
    icon: "noticon",
    next: {
      find: () => {
        return $(".nav-next")
      }
    },
    prev: {
      find: () => {
        return $(".nav-previous")
      }
    }
  },
  www_yamitranslations_com: {
    content: {
      find: (link) => {
        return $(link).parent().siblings(".entry-content")
      },
      filter: ""
    },
    next: {
      find: (link, text) => {
        return this.mapF($(".orPrevNext"), text)
      }
    },
    prev: {
      find: (link, text) => {
        return this.mapF($(".orPrevNext"), text)
      }
    },
    navigation: () => {
      if (document.querySelectorAll(".orPrevNext a").length === 0) {
        // console.log("retry to find prev link")
        setTimeout(() => {
          this.navigation(self)
        }, 300)
        return
      }
      // console.log("found links!")
      this.navigationCallback("")
    }
  },
  zirusmusings_com: {
    title: () => {
      return $(".page-title")
    },
    content: {
      find: (link) => {
        return $(link).parent().parent().parent().parent().find(".entry-content")
      }
    },
    icon: "noticon",
  },
  addnewtab_wordpress_com: {
    icon: "noticon",
  },
  gravitytales_com: {
    title: () => {
      return $($("#contentElement h3")[0])
    },
    icon: "fa",
    content: {
      find: (link) => {
        return $("#chapterContent")
      },
      filter: function (content) {
        var c = $(content)
        c.find("p, p span").css({
          fontSize: this.state.fontSize + "px",
          lineHeight: "normal"
        })
        return c
      },
    },
    next: {
      find: function (link, text) {
        return this.mapF($(".chapter-navigation a"), text)
      }
    },
    prev: {
      find: function (link, text) {
        return this.mapF($(".chapter-navigation a"), text)
      }
    },
    comments: {
      list: () => $("div#commentsList"),
      form: () => $("div#commentsbox > div > div > div"),
      elements: (list) => $(list).find(".comment-wrapper"),
      comment: {
        getPseudo: function () {
          return $(this.context).find("p.comment-poster").first().text()
        },
        getDate: function () {
          return $(this.context).find("div.comment-info").first().text()
        },
        getComment: function () {
          return $(this.context).find("div.commentContent").first().find("p")
        },
        getAvatar: () => "",
      }
    }
  },
  weitranslations_wordpress_com: {
    icon: "genericon",
  },
  www_radianttranslations_com: {
    next: {
      text: "Next.{1,2}Chapter"
    },
    prev: {
      text: "Prev\. Chapter"
    }
  },
  blastron01_tumblr_com: {
    title: () => {
      return $($("#blog h1")[0])
    },
    icon: {
      open: "icon icon-external-link",
      close: "fa fa-close"
    },
    content: {
      find: (link) => {
        return $("#blog .post")
      },
      filter: (content) => {
        return $(content).find("> *:not(.meta,.permalink-footer,h1:first)")
      }
    },
    next: {
      text: "next"
    },
    prev: {
      text: "prev"
    }
  },
  razpyon_tumblr_com: {
    title: () => $($("#home h2")[0]),
    content: {
      find: (link) => $("#home .textpostbody"),
      filter: (content) => $(content).find("> *:not(.meta,.permalink-footer,h1:first)")
    },
    next: {
      text: "Next Page"
    },
    prev: {
      text: "Previous Page"
    },
    comments: {
      list: () => $("#disqus_thread"),
      elements: (list) => $(list),
      comment: {
        render: function () {
          return $(this.context)
        },
      }
    }
  },
  martialdao_com: {
    icon: "noticon",
  },
  www_mistycloudtranslations_com: {
    content: {
      find: (link) => {
        return $(link).parent().siblings(".entry-content")
      },
      filter: function (content) {
        var c = $(content).find("> *:not(.sharedaddy)").clone()
        c.find("p").css({
          fontSize: this.state.fontSize + "px",
          lineHeight: "normal"
        })
        return c
      },
    },
    icon: "fa",
  },
  novelsnchill_com: {
    title: () => {
      return $($("h1.loop-title")[0])
    },
    content: {
      find: () => {
        return $($("div.entry-the-content")[0])
      }
    },
    icon: "fa",
    styles: {
      close: {
        icon: {
          fontSize: "1.3em"
        },
        link: {
          left: "85%"
        }
      }
    }
  },
  rpgnovels_com: {
    title: () => {
      return $($(".post-title h1")[0])
    },
    content: {
      find: (link) => {
        return $(link).parent().parent().siblings(".post-content").find(".post-entry")
      }
    },
    icon: "noticon",
  },
  kakkokaritranslations_com: {
    icon: "noticon",
    styles: {
      content: {
        fontSize: "1.5em"
      }
    },
    icon: "noticon",
  },
  rancerqz_com: {
    before: () => {
      $("body.custom-background").css("background-color", "#fafafa")
      $(".site").css("background-color", "whitesmoke")
      $(".main-navigation ul ul li").css("background-color", "whitesmoke")
      $("<style>body, blockquote cite, blockquote small, .main-navigation a, .menu-toggle, .dropdown-toggle, .social-navigation a, .post-navigation a, .widget-title a, .site-branding .site-title a, .entry-title a, .page-links>.page-links-title, .comment-author, .comment-reply-title small a:hover, .comment-reply-title small a:focus { color: grey !important; }</style>").appendTo("body")
    },
    icon: "genericon",
  },
  www_rebirth_online: {
    icon: "fa",
    comments: {
      list: () => $("#disqus_thread"),
      elements: (list) => $(list),
      comment: {
        render: function () {
          return $(this.context)
        },
      }
    },
    next: {
      find: function (link, text) {
        return this.mapF($(".chapter-navigation").find("a"), text)
      }
    },
    prev: {
      find: function (link, text) {
        return this.mapF($(".chapter-navigation").find("a"), text)
      }
    },
    after: function () {
      if (this.state.title !== undefined) {
        this.setState({
          title: $("h3.chapter-title").text()
        })
      }
    }
  },
  kobatochan_com: {
    icon: "genericon",
    next: {
      text: "Next Chapter >>"
    },
    prev: {
      text: "<< Previous Chapter"
    },
    styles: {
      close: {
        icon: {
          color: "black"
        }
      },
      content: {
        color: "black!important"
      }
    },
    after: function () {
      this.getActive().find("*").css("color", "black")
    }
  },
  comettranslations_weebly_com: {
    title: () => {
      return $("h2.blog-title")
    },
    content: {
      find: () => {
        return $("div.blog-content")
      }
    },
    comments: {
      list: () => {
        return $("div.blog-comment-area")
      },
      elements: (list) => {
        return $(list).find(".blogCommentWrap")
      },
      comment: {
        getPseudo: function () {
          return $(this.context).find(".blogCommentAuthor .name").text()
        },
        getAvatar: function () {
          return ""
        },
        getComment: function () {
          return $(this.context).find(".blogCommentText").html()
        },
        getDate: function () {
          return $(this.context).find(".blogCommentDate").text()
        },
      }
    }
  },
  www_comegatranslations_com: {
    content: {
      find: (link) => $(link).parent().siblings(".entry-content")
    },
    comments: {
      list: () => {
        return $("div.comment-thread ol")
      },
      elements: (list) => {
        return $(list).find(".comment")
      },
      form: () => $(".comment-replybox-thread").clone(),
      comment: {
        getPseudo: function () {
          return $(this.context).find(".comment-header cite.user")[0].textContent
        },
        getAvatar: function () {
          return $(this.context).find("div.avatar-image-container img")[0]
        },
        getComment: function () {
          return $(this.context).find("p.comment-content")[0].innerHTML
        },
        getDate: function () {
          return $(this.context).find(".comment-header span.datetime")[0].textContent
        },
      }
    }
  },
  www_sousetsuka_com: {
    content: {
      find: (link) => {
        return $(link).parent().siblings(".entry-content")
      },
      filter: ""
    },
    comments: {
      list: () => {
        return $("#disqus_thread")
      },
      elements: (list) => {
        return $(list)
      },
      comment: {
        render: function () {
          return $(this.context)
        },
      }
    }
  },
  re_library_com: {
    comments: {
      list: () => {
        return $("#disqus_thread")
      },
      elements: (list) => {
        return $(list)
      },
      comment: {
        render: function () {
          return $(this.context)
        },
        icon: "genericon"
      }
    }
  },
  volarenovels_com: {
    after: function () {
      this.getActive().find("p").css({
        fontSize: this.state.fontSize + "px",
        fontFamily: "Merriweather, serif",
        fontWeight: 400
      })
    },
    icon: "genericon",
    comments: {
      list: () => $("#disqus_thread"),
      elements: (list) => $(list),
      comment: {
        render: function () {
          return $(this.context)
        },
      }
    }
  },
  theworsttranslation_wordpress_com: {
    content: {
      find: (link) => {
        return $(link).parent().siblings(".entry-content")
      },
    },
    comments: {
      list: () => $(".commentlist")
    },
    icon: "noticon"
  },
  www_liberspark_com: {
    title: () => $("h3#reader-title"),
    content: {
      find: (link) => $(link).parent().siblings(".reader-content")
    },
    comments: {
      list: function () {
        return this.state.commentsJSON
      },
      elements: (list) => (list !== null && list.length > 0) ? list : [],
      form: function () {
        let form = $("<form></form>").append($("<h3></h3").append($("<i></i>").addClass("fa fa-comments")).append("&nbsp;Add your comment")).append($("<textarea></textarea>").attr("name", "lnreader-comment-add").addClass("form-control")).append($("<button>Send</button>").addClass("btn btn-primary btn-comment"))
        let self = this
        form.on("submit", (e) => {
          e.preventDefault()
          let data = {
            body: unsafeWindow.CKEDITOR.instances["lnreader-comment-add"].getData(),
            _token: document.head.querySelector("meta[name='csrf-token']").content,
            commentable_type: unsafeWindow.commentable_type,
            commentable_id: unsafeWindow.commentable_id
          }
          $.ajax({
            url: "/comments",
            type: "POST",
            data: data,
            success: (result) => {
              console.log(self)
              if (result.success == true) {
                unsafeWindow.CKEDITOR.instances["comment-input"].setData("");
                let comments = self.state.commentsJSON.slice(0)
                comments.push(result.comment)
                self.setState({
                  commentsJSON: comments
                })
              }
            }
          })
        })
        return form
      },
      comment: {
        getPseudo: function () {
          return this.context.user.username
        },
        getAvatar: function () {
          return {
            src: this.context.user.profile_picture_url
          }
        },
        getComment: function () {
          return this.context.body
        },
        getDate: function () {
          return this.context.created_at
        },
      }
    },
    next: {
      find: function (link, text) {
        return this.mapF($(".reader-container a"), text)
      }
    },
    prev: {
      find: function (link, text) {
        return this.mapF($(".reader-container a"), text)
      }
    },
    before: function () {
      this.addEventListener("commentsloaded", function () {
        unsafeWindow.CKEDITOR.replace(this.getActive().find("textarea")[0], {
          width: '100%',
          height: 100,
          customConfig: '/ckeditor/comment-config.js'
        });
      })
    },
    after: function () {
      let data = {
        commentable_type: unsafeWindow.commentable_type,
        commentable_id: unsafeWindow.commentable_id
      };
      let self = this
      $.ajax({
        dataType: "json",
        url: "/comments",
        data: data,
        success: function (result) {
          self.setState({
            commentsJSON: result.comments
          })
        }
      });
      this.getActive().find("p").css({
        fontSize: this.state.fontSize + "px",
        fontFamily: "Merriweather, serif",
        fontWeight: 400,
        lineHeight: "1.8",
        marginBottom: "1.2em"
      })
    }
  },
  creativenovels_com: {
    title: () => $("h1.entry-title"),
    icon: "fa5",
    prev: {
      find: () => $($("a.prevkey")[0])
    },
    next: {
      find: () => $($("a.nextkey")[0])
    },
    comments: {
      list: () => {
        return $("div.wc-thread-wrapper")
      },
      elements: (list) => {
        return $(list).find(".wc-comment")
      },
      form: () => {
        let form = $(".wc-main-form-wrapper form")
        form.find("textarea").on("focus", function () {
          console.log(this)
          if (!($(this).next('.autogrow-textarea-mirror').length)) {
            unsafeWindow.$(this).autoGrow()
          }
          var parent = $(this).parents('form');
          $('.commentTextMaxLength', parent).show();
          $('.wc-form-footer', parent).slideDown(700);
        })
        return form
      },
      comment: {
        getPseudo: function () {
          return $(this.context).find("div.wc-comment-header div.wc-comment-author")[0].textContent
        },
        getAvatar: function () {
          return $(this.context).find("div.wc-comment-left img")[0]
        },
        getComment: function () {
          return $(this.context).find("div.wc-comment-text")[0].innerHTML
        },
        getDate: function () {
          return $(this.context).find(".wc-comment-date")[0].textContent
        },
        getLikes: function () {
          return $(`<div class="wc-comment-right"></div>`).html($(this.context).find(".wc-footer-left")).attr("id", $(this.context).find(".wc-comment-right").attr("id"))
        }
      }
    },
    before: function () {
      this.addEventListener("commentsloaded", () => {
        this.getActive().find("> .post-comments").attr("id", "wpcomm")
      })
    }
  },
  koreanovels_com: {
    title: () => $("article h1.title"),
    content: {
      find: () => $("#content")
    },
    icon: {
      open: "publishable-icon icon-plus"
    },
    comments: {
      list: () => $(".commentlist"),
      elements: (list) => $(list).find("li.comment"),
      comment: {
        getPseudo: function () {
          return $(this.context).find("div.comment-author")[0].textContent
        },
        getAvatar: function () {
          return $(this.context).find("div.comment-author img")[0]
        },
        getComment: function () {
          return $(this.context).find("div.commentmetadata p").toArray().map((v) => v.outerHTML)
        },
        getDate: function () {
          return $(this.context).find(".commentmetadata time")[0].textContent
        }
      }
    },
  },
  www_wolfiehonyaku_com: {
    content: {
      find: (link) => $(link).parent().siblings(".entry-content")
    },
    next: {
      find: function (link, text) {
        return this.mapF($(".NavigationSucks a"), text)
      }
    },
    prev: {
      find: function (link, text) {
        return this.mapF($(".NavigationSucks a"), text)
      }
    },
    comments: {
      list: () => $(".commentlist"),
      elements: (list) => $(list).find("li"),
      comment: {
        getPseudo: function () {
          return $(this.context).find(".comment-author cite")[0].textContent
        },
        getAvatar: function () {
          return $(this.context).find(".comment-author img")[0]
        },
        getComment: function () {
          return $(this.context).find(".commententry p").toArray().map((v) => v.outerHTML)
        },
        getDate: function () {
          return $(this.context).find(".comment-author .comment-time")[0].textContent
        }
      }
    },
    icon: "fa",
  },
  dsrealmtranslations_com: {
    title: () => $(".page-title h1"),
    content: {
      find: (link) => $(link).parent().parent().siblings(".page-description")
    },
    after: function () {
      this.getActive().find(".post-article p").css({
        fontFamily: "Merriweather, serif",
        color: "black",
        fontSize: this.state.fontSize + "px",
        lineHeight: "1.8",
      })
    },
    comments: {
      list: () => $(".commentlist"),
      elements: (list) => $(list).find("li.comment"),
      comment: {
        getPseudo: function () {
          return $(this.context).find("div.comment-author b.fn")[0].textContent
        },
        getAvatar: function () {
          return $(this.context).find("div.comment-author img")[0]
        },
        getComment: function () {
          return $(this.context).find("div.comment-content")
        },
        getDate: function () {
          return $(this.context).find(".comment-metadata time")[0].textContent
        }
      }
    },
    icon: "fa"
  },
  www_webnovel_com: {
    before: function () {
      let toolbar = document.querySelector(".cha-tools")
      if (toolbar !== null) {
        let fs_svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
        let svg_use = document.createElementNS('http://www.w3.org/2000/svg', 'use')
        svg_use.setAttributeNS("http://www.w3.org/1999/xlink", "href", "#i-plus")
        fs_svg.appendChild(svg_use)
        let fullscreen_link = document.createElement("a")
        fullscreen_link.appendChild(fs_svg)
        fullscreen_link.setAttribute("title", "Fullscreen")
        fullscreen_link.addEventListener("click", (e) => {
          e.preventDefault()
          if (document.documentElement.webkitRequestFullscreen !== undefined) document.documentElement.webkitRequestFullscreen()
          else document.documentElement.mozRequestFullScreen()
        })
        let baseScrollTop = document.documentElement.scrollTop
        let baseScrollHeight = document.documentElement.scrollHeight
        let getFullscreenElement = () => document.webkitFullscreenElement || document.mozFullscreenElement || null
        let timeoutFade = null
        let enableFade = false
        let fadeInHeader = () => {
          clearTimeout(timeoutFade)
          if (getFullscreenElement() !== null && enableFade) {
            $(".cha-header").fadeIn()
            timeoutFade = setTimeout(function () {
              $(".cha-header").fadeOut()
            }, 4000)
          }
        }
        let eventFS = () => {
          if (getFullscreenElement() !== null) {
            document.body.style.paddingTop = 0
            fadeInHeader()
          }
          else {
            document.body.style.paddingTop = "" // reset
            document.querySelector(".cha-header").style.display = "block"
            document.querySelector(".cha-header").style.opacity = 1
          }
          setTimeout(() => {
            document.documentElement.scrollTop = baseScrollTop + document.documentElement.scrollHeight - baseScrollHeight
          }, 500)
        }
        let updateScroll = () => {
          baseScrollTop = document.documentElement.scrollTop
          baseScrollHeight = document.documentElement.scrollHeight
        }
        document.addEventListener("webkitfullscreenchange", eventFS)
        document.addEventListener("mozfullscreenchange", eventFS)
        document.addEventListener("mousemove", fadeInHeader)
        document.addEventListener("touchstart", fadeInHeader)
        document.querySelector(".cha-header").addEventListener("mouseover", () => {
          clearTimeout(timeoutFade)
          enableFade = false
        })
        document.querySelector(".cha-header").addEventListener("mouseout", () => {
          enableFade = true
        })
        document.addEventListener("touchmove", updateScroll)
        document.addEventListener("wheel", updateScroll)
        document.addEventListener("keyup", (e) => {
          if (e.which == 38 || e.which == 40) updateScroll()
        })
        toolbar.appendChild(fullscreen_link)
      }
    }
  },
  xiose_net: {
    icon: "noticon",
    after: function () {
      this.getActive().find(".post-article p span").css({
        fontFamily: "Merriweather, serif",
        fontSize: this.state.fontSize + "px"
      })
    }
  },
  lightnovelstranslations_com: {
    icon: {
      open: "fa fa-external-link",
      close: "fa fa-close"
    },
    content: {
      find: (link) => {
        return $(link).parent().siblings(".entry-content")
      }
    },
    next: {
      find: (link) => {
        return $($(link).parent().siblings(".entry-content").find("a")[1])
      }
    },
    prev: {
      find: (link) => {
        return $($(link).parent().siblings(".entry-content").find("a")[0])
      }
    },
    styles: {
      close: {
        icon: {
          fontSize: "inherit"
        },
        link: {
          left: "",
          right: "10%"
        }
      }
    }
  },
  snowycodex_com: {
    icon: {
      open: "otb-fa otb-fa-external-link",
      close: "otb-fa otb-fa-close"
    },
    title: () => $($(".entry-content h2")[0]),
    content: {
      find: (link) => $(link).parent(),
      filter: (content) => $(content).nextAll()
    },
    next: {
      find: function (link, text) {
        return this.mapF($(".entry-content a"), text)
      }
    },
    prev: {
      find: function (link, text) {
        return this.mapF($(".entry-content a"), text)
      }
    },
  },
  readlightnovel_org: {
    icon: {
      open: "glyphicon glyphicon-fullscreen",
      close: "glyphicon glyphicon-remove"
    },
    title: () => $($(".block-title h1")[0]),
    content: {
      find: () => $(".chapter-content3 .desc"),
      filter: (content) => $(content).html()
    },
    next: {
      find: function (link, text) {
        return $($(".chapter-actions .next")[0])
      }
    },
    prev: {
      find: function (link, text) {
        return $($(".chapter-actions .prev")[0])
      }
    },
  },
  www_machineslicedbread_xyz: {
    icon: "fa",
    after: function () {
      $(this.active).find("h1,a").css("color", "#DDDDDD")
    }
  },
  twomorefreethoughts_wordpress_com: {
    icon: "dashicons"
  },
  shurimtranslation_com: {
    icon: {
      open: "dashicons dashicons-external",
      close: "dashicons dashicons-no"
    }
  },
  www_ehmed_xyz: () => {
    let ehmed = new Tweaker({
      icon: "dashicons",
      comments: {
        list: () => $("#disqus_thread"),
        elements: (list) => $(list),
        comment: {
          render: function () {
            return $(this.context)
          },
        }
      },
      next: {
        find: function (link, text) {
          return this.mapF($("#Chapter_Index a"), text)
        }
      },
      prev: {
        find: function (link, text) {
          return this.mapF($("#Chapter_Index a"), text)
        }
      },
    })
    return ehmed
  }
}

$.each(regexp, function (key, val) {
  if (window.location.href.match(key)) {
    if (tweakes[val] !== undefined) {
      if (tweakes[val] instanceof Tweaker) {
        tweakes[val].Render()
      }
      else if (tweakes[val] instanceof Function) {
        let ret = tweakes[val]()
        if (ret instanceof Tweaker) {
          ret.Render()
        }
      }
      else {
        new Tweaker(tweakes[val]).Render()
      }
    }
    else console.error("The element in tweakes map is not defined")
  }
})
// Registering menu command
if (GM_registerMenuCommand !== undefined) {
  GM_registerMenuCommand("Theme Tweaker - Report Issues", () => {
    window.location.href = "https://openuserjs.org/scripts/akuma06/Theme_tweaker_LN/issues"
  })
}
