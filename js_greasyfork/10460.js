// ==UserScript==
// @name         Hentai Foundry - Image Hover
// @namespace    https://github.com/Kayla355
// @version      0.3.2
// @description  Fetches a larger version of the image upon hovering over a thumbnail.
// @author       Kayla355
// @match        http://www.hentai-foundry.com/*
// @match        https://www.hentai-foundry.com/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @icon         http://img.hentai-foundry.com/themes/Hentai/favicon.ico
// @require      http://code.jquery.com/jquery-2.1.3.min.js
// @require      http://cdn.jsdelivr.net/jquery.visible/1.1.0/jquery.visible.min.js
// @require      https://cdn.rawgit.com/Kayla355/MonkeyConfig/d152bb448db130169dbd659b28375ae96e4c482d/monkeyconfig.js
// @history      0.2 Fixed an issue with smartPreload not loading in the image correctly. Also fixed an issue with flash files.
// @history      0.2.1 Fixed some issues with loading getting stuck.
// @history      0.2.2 Added more image positions.
// @history      0.2.3 Fixed the images not loading with the new HF theme. Some issues still remain with screen boundries, works when combined with my CSS fixes script.
// @history      0.2.4 Fixed the image boundries and also fixed an issue with the title showing up over the image somtimes.
// @history      0.2.5 Fixed an issue where images were still attempting to cache even after having already been cached.
// @history      0.3.0 Added MonkeyConfig options config, for actually storing options.
// @history      0.3.1 Quick bug fix from some changes to the website.
// @history      0.3.2 Fixed an issue with the "smart-preload" option.
// @downloadURL https://update.greasyfork.org/scripts/10460/Hentai%20Foundry%20-%20Image%20Hover.user.js
// @updateURL https://update.greasyfork.org/scripts/10460/Hentai%20Foundry%20-%20Image%20Hover.meta.js
// ==/UserScript==

// Options //
var imagePosition;
var hoverSize;
var smartPreload;
var preloadAll;

cfg = new MonkeyConfig({
    title: 'Hentai Foundry - Image Hover Configuration',
    menuCommand: true,
    params: {
        image_position: {
            type: 'select',
            choices: [ 'top-left', 'top-right', 'bottom-left', 'bottom-right', 'middle-left', 'middle-right'],
            default: 'middle-right'
        },
        hover_size: {
            type: 'number',
            default: 512
        },
        preload_option: {
            type: 'select',
            choices: [ 'Smart Preload', 'Preload All', 'none'],
            default: 'Smart Preload'
        }
    },
    onSave: setOptions
});

function setOptions() {
    imagePosition = cfg.get('image_position');
    hoverSize     = cfg.get('hover_size');
    smartPreload  = false;
    preloadAll    = false;

    switch(cfg.get('preload_option')) {
        case "Smart Preload":
            smartPreload = true;
            preloadAll = false;
            break;
        case "Preload All":
            smartPreload = false;
            preloadAll = true;
            break;
        default:
            smartPreload  = false;
            preloadAll    = false;
    }
}
setOptions();

switch(cfg.get('preload_option')) {
    case "Smart Preload":
        smartPreload = true;
        preloadAll = false;
        break;
    case "Preload All":
        smartPreload = false;
        preloadAll = true;
        break;
    default:
        smartPreload  = false;
        preloadAll    = false;
}

// Styles //
GM_addStyle(".image-hover {"
            +"position: absolute;"
            +"z-index: 9999;"
            +"box-shadow: 5px 5px 10px 0px rgba(50, 50, 50, 0.75);"
            +"pointer-events: none;"
            +"}"

            +".loader {"
            +"position: absolute;"
            +"margin: 8px 0px 0px 8px;"
            +"border-bottom: 6px solid rgba(255, 255, 255, 0.4);"
            +"border-left: 6px solid rgba(255, 255, 255, 0.4);"
            +"border-right: 6px solid rgba(255, 255, 255, 0.4);"
            +"border-top: 6px solid rgba(0, 0, 0, 0.8);"
            +"border-radius: 100%;"
            +"height: 25px;"
            +"width: 25px;"
            +"animation: rot 0.6s infinite linear;"
            +"}"
            +"@keyframes rot {"
            +"from {transform: rotate(0deg);}"
            +"to {transform: rotate(359deg);}"
            +"}"

            +"#pl-background {"
            +"position: absolute;"
            +"background-color: white;"
            +"height: 20px;"
            +"width: 125px;"
            +"border-radius: 25px;"
            +"}"

            +"#pl-fill {"
            +"display: inline-block;"
            +"background-color: red;"
            +"height: 20px;"
            +"border-radius: 25px;"
            +"}"

            +"#pl-background center {"
            +"position: absolute;"
            +"top: 0px;"
            +"left: 0px;"
            +"width: 125px;"
            +"text-align: center;"
            +"font-size: 10px;"
            +"font-weight: 900;"
            +"line-height: 20px;"
            +"}"
            +".thumb:hover {"
            +"position: relative !important;"
            +"padding: 0;"
            +"margin: 0;"
            +"background-size: cover;"
            +"border: 0;"
            +"}");

// Variables //
var hovering         = false;
var mouse            = {X: 0, Y: 0};
var imageExt         = [".jpg", ".jpeg", ".png", ".gif"];
loaded           = {};
var plProgress       = {current: 0, total: 0, percent: "0%"};
var loadingStatus    = "inactive";
var oldTitle         = "";
var done;
// Timers
var hoverTimer;
var hoverTimerStart;
var scrollTimer;

// Code //

// Event Listeners //

// Start preloading images
if(preloadAll || smartPreload) {
    if(preloadAll) {
        smartPreload = false;
    }
    loadImages();
}

// Listen for Events on thumbnails
$(".thumb").on({
    mousemove: function(e) {
        // Get mouse location
        if(e.pageY && e.pageX) {
            mouse.Y = e.pageY + 2;
            mouse.X = e.pageX + 5;
        }

        // Run function to keep image inside of window.
        if(hovering) {
            keepInside();
        }
        //console.log("X:", e.pageX, ", Y:", e.pageY);
    },
    mouseenter: function(e) {
        // Create links, id, etc.
        var link = e.target.parentNode.href.match(/(https?:\/\/www.hentai-foundry.com\/pictures\/user)(\/.*\/?)/)[2];
        var id   = link.match(/(?:\/.*\/)(.*)(?:\/)/)[1];
        var cat  = link.slice(1, 2).toLowerCase();
        if(cat.match(/-/)) {
            cat = "_";
        } else if(cat.match(/[^a-z]/)) {
            cat = "0";
        }
        var src = "http://pictures.hentai-foundry.com/" + cat + "/" + link.slice(0, -1);
        var obj = {id: id, src: src, target: e.target, from: "hover"};

        // Title issue fix
        oldTitle = this.title;
        this.title = "";

        // Create content div
        $('<div class="image-hover">'
          +'<div id="hoverLoader" class="loader"></div>'
          +'<div id="'+ id +'" style="display:none"></div>'
          +'</div>').appendTo("body");

        // Check if user has recently hovered over an object, thereby triggering the hover mode.
        if(!hovering) {
            clearTimeout(hoverTimerStart);
            hoverTimerStart = setTimeout(function() {
                hovering = true;
                hoverFunc(obj);
            }, 500);
        } else {
            hoverFunc(obj);
        }
        // Clear timer to exit "hovermode"
        clearTimeout(hoverTimer);
    },
    mouseleave: function(e) {
        // Clear timeouts and remove divs.
        clearTimeout(hoverTimerStart);
        $("div.image-hover").remove();
        hoverTimer = setTimeout(function() { hovering = false; }, 500);
        // Title issue fix
        this.title = oldTitle;
        oldTitle = "";
    }
});

// If smartPreload is enabled, Listen for when the document is scrolled
if(smartPreload) {
    $(document).on('scroll', function() {
        console.log("Scrolled, loading is", loadingStatus);
        if(preloadAll || smartPreload) {
            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(function() {
                if(loadingStatus === "active") {
                    $(document).on("stoppedLoading", function() {
                        console.log("stopped loading, starting again");
                        loadImages();
                    });
                } else {
                    loadImages();
                }
            }, 1000);
        }
    });
}

// Listen for update to the pre-load progress.


// Re-usable Functions //

// Function that is run when hovering over an image.
function hoverFunc(obj) {
    var target = obj.target;
    var id     = obj.id;

    $('#'+id).on("imageLoaded", function() {
        $('#hoverLoader').remove();
      // Set size of image
        loaded[id].image.style.maxHeight = hoverSize +"px";
        loaded[id].image.style.maxWidth  = hoverSize +"px";

        $('.image-hover div#'+ obj.id).css("background-color", "#a3a3ab").append(loaded[id].image).show();
        $(obj.target).trigger("mousemove");
    });

    $(target).trigger("mousemove");
    if(plProgress.current != plProgress.total) {
        $('#hoverLoader').remove();
        $('.image-hover').append('<div id="pl-background"><div id="pl-fill"></div><center></center></div>');
    } else if (validateImage(id)) {
        if(loaded[id].status === "done") {
            loaded[id].from = "hover";
            createImages(loaded[id]);
        }
    } else {
        imageExt.eachImage(obj);
    }

    $(document).trigger("plStatusChange");
}

// Function for creating and loading the images before showing.
function loadImages() {
    var thumbs = $('.thumb');
    var from   = "preload";
    loadingStatus = "active";
    done = 0;

    if(smartPreload) {
        from = "smartload";
        console.log("Filtering!");
        thumbs = $('.thumb').filter(function(e) {
            var id = parseInt(this.style["background-image"].replace(/.*pid=([0-9]+).*/, '$1'));
            if(!id || typeof id !== "number") return false;
            if($(this).visible( true )) {
                if(validateImage(id)) {
                    console.info("["+id+"]", "Image already loaded:", loaded[id].image.src);
                }
                //console.log("Visible:",$(this).visible( true ));
                return true;
            } else {
                //console.log("Visible:", $(this).visible( true ), "Loaded:", loaded[id]);
                return false;
            }
        });
    }
    if(thumbs.length === 0) {
        console.log("Finished loading images");
        loadingStatus = "inactive";
        $(document).trigger("loadingReady");
    }

    thumbs.each(function(i) {
        var e = {target: this};
        var link = e.target.parentNode.href.match(/(https?:\/\/www.hentai-foundry.com\/pictures\/user)(\/.*\/?)/)[2];
        var id   = link.match(/(?:\/.*\/)(.*)(?:\/)/)[1];
        var cat  = link.slice(1, 2).toLowerCase();

        if(cat.match(/-/)) {
            cat = "_";
        } else if(cat.match(/[^a-z]/)) {
            cat = "0";
        }
        var imgSrc = "http://pictures.hentai-foundry.com/" + cat + "/" + link.slice(0, -1);

        loaded[id] = {};

        var fail = 0;

        imageExt.forEach(function(ext) {
            imageExists(imgSrc + ext, function(exists) {
                if(exists) {

                    loaded[id].id      = id;
                    loaded[id].src     = imgSrc;
                    loaded[id].ext     = ext;
                    loaded[id].target  = e.target;
                    loaded[id].from    = from;

                    if(loaded[id].ext && from === "preload") {
                        plProgress.realtotal++;
                        //return;
                    }

                    createImages(loaded[id], thumbs.length);
                } else {
                fail++;
                if(fail === imageExt.length) {
                    done++;
                    console.log("Loading Progress: ", done +" / "+ thumbs.length);
                    loaded[id].ext = "failed";
                    console.error("Could not determine file type:", imgSrc);
                }
            }
            });
        });
    });
}


// Create the image and load it before attaching it to the div.
function createImages(obj, total) {
    var image = new Image();

    if(obj.from === "preload") {
        plProgress.total = total;
        if(plProgress.realtotal > plProgress.total && obj.from === "preload") {
            plProgress.total = plProgress.realtotal;
        }
    }


    if(obj.status === "done") {
        if(loaded[obj.id].image) {
            if($('#'+obj.id+' img').length === 0) {
                $('#'+obj.id).trigger("imageLoaded");
            }
            return;
        }
    }

    if(obj.from != "preload" && obj.status !== "done") {
        image.onload = function () {
            obj.image = image;
            if($('#'+obj.id+' img').length === 0) {
                obj.status = "done";

                if(obj.from === "smartload") {
                    loaded[obj.id].status = obj.status;
                    loaded[obj.id].image = image;
                } else {
                    loaded[obj.id] = obj;
                }

                console.info("["+obj.id+"]", "Image loaded:", obj.image.src);
                $('#'+obj.id).trigger("imageLoaded");
            }
            done++;
            console.log("Loading Progress: ", done +" / "+ total);
            if(done === total) {
                console.log("Finished loading images");
                loadingStatus = "inactive";
                $(document).trigger("loadingReady");
            } else if((total - done) <= Math.round(total/3)) {
                console.log("Accepting new Images");
                loadingStatus = "ready";
                $(document).trigger("loadingReady");
            }
        };
    } else if(obj.from === "preload") {
        image.onload = function () {
            plProgress = {current: plProgress.current+1, total: plProgress.total, percent: Math.round((plProgress.current / plProgress.total) * 100)};
            $(document).trigger("plStatusChange");
        };
    }

    image.onerror = function () {
        obj.status = "failed";
        console.error("Cannot load image");
    };

    obj.status = "loading";
    image.src = obj.src + obj.ext;
}

// Prototype for checking each of the image extensions listed in 'imageExt'.
Array.prototype.eachImage = function(obj) {
    var fail = 0;
    this.forEach(function(ext) {
        imageExists(obj.src + ext, function(exists) {
            if(exists) {
                obj.ext = ext;
                createImages(obj);
            } else {
                fail++;
                if(fail === imageExt.length) {
                    done++;
                    console.log("Loading Progress: ", done +" / "+ thumbs.length);
                    loaded[id].ext = "failed";
                    console.error("Could not determine file type:", imgSrc);
                }
            }
        });
    });
};

// Checks if the given image url exists
function imageExists(url, callback) {
    GM_xmlhttpRequest({
        url: url,
        method: "HEAD",
        onload: function(response) {
            callback(response.status < 400);
        }
    });
}

var hasOwnProperty = Object.prototype.hasOwnProperty;
// Validate the existing image object
function validateImage(id) {
    if(loaded[id] == null) return false;

    if(loaded[id].image) return true;

    if(loaded[id].length > 0) return true;
    if(loaded[id].length === 0) return false;

    if(typeof loaded[id] !== "object") return false;

    for(var key in loaded[id]) {
        if (hasOwnProperty.call(loaded[id], key)) return true;
    }

    return false;
}

// Function for keeping the image inside the window borders.
function keepInside() {
    var image = {};
    try {
        image  = {
            naturalHeight: $('.image-hover img')[0].height,
            naturalWidth:  $('.image-hover img')[0].width
        };
    } catch(e) {
        image  = {
            naturalHeight: 0,
            naturalWidth:  0
        };
    }

    var screen = {
        height: window.pageYOffset + $(window).height() - 2,
        width:  window.pageXOffset + $(window).width()  - 0,
        naturalHeight: $(window).height(),
        naturalWidth:  $(window).width(),
        margin: {
            height: parseFloat(($(document).height() - $("body").height()) / 2),
            width: parseFloat(($(document).width() - $("body").width()) / 2)
        }
    };

    // Get image height, relative to mouse position.
    try {
        if(imagePosition === "bottom-left" || imagePosition === "bottom-right") {
            image.height = (mouse.Y - 2) + image.naturalHeight;
        } else if(imagePosition === "middle-left" || imagePosition === "middle-right") {
            image.height = {
                top: (mouse.Y - 2) - (image.naturalHeight / 2),     // For checking if colliding with top
                bottom: (mouse.Y - 2) + (image.naturalHeight / 2)   // For checking if colliding with bottom
            };
        } else {
            image.height = (mouse.Y - 2) - image.naturalHeight;
        }
    } catch(e) {
        image.height = 0;
    }

    // Get image width, relative to mouse position.
    try {
        if(imagePosition === "top-right" || imagePosition === "bottom-right" || imagePosition === "middle-right") {
            image.width = (mouse.X + 2) + image.naturalWidth;
        } else {
            image.width = (mouse.X + 2) - image.naturalWidth;
        }
    } catch(e) {
        image.width = 0;
    }

    // Check if image height is outside of screen
      // If on bottom
    if(imagePosition === "bottom-left" || imagePosition === "bottom-right") {
        if(screen.height <= image.height) {
            mouse.Y = mouse.Y - (image.height - screen.height);
        }
      // ELSE IF in middle
    } else if(imagePosition === "middle-left" || imagePosition === "middle-right") {
        if(screen.height <= image.height.bottom) {
            mouse.Y = mouse.Y - (image.height.bottom - screen.height);
        } else if(image.height.top + screen.naturalHeight - 1 <= screen.height) {
            mouse.Y = mouse.Y - image.height.top + (screen.height - screen.naturalHeight) + 1;
        }
      // ELSE on top
    } else {
        if(image.height + screen.naturalHeight - 1 <= screen.height) {
            mouse.Y = mouse.Y - image.height + (screen.height - screen.naturalHeight) + 1;
        }
    }

    // Check if image width is outside of screen
      // IF on right side
    if(imagePosition === "top-right" || imagePosition === "bottom-right" || imagePosition === "middle-right") {
        if(screen.width <= image.width) {
            mouse.X = mouse.X - (image.width - screen.width);
        }
      // ELSE on left side
    } else {
        if (image.width <= 3){
            mouse.X = mouse.X + ~image.width + 5;
        }
    }

    // Offset depending image position relative to mouse set in options
    switch(imagePosition) {
        case "top-left":
            image.Y = mouse.Y - (image.naturalHeight);
            image.X = mouse.X - (image.naturalWidth);
            break;
        case "top-right":
            image.Y = mouse.Y - (image.naturalHeight);
            image.X = mouse.X;
            break;
        case "bottom-left":
            image.Y = mouse.Y;
            image.X = mouse.X - (image.naturalWidth);
            break;
        case "bottom-right":
            image.Y = mouse.Y;
            image.X = mouse.X;
            break;
        case "middle-left":
            image.Y = mouse.Y - (image.naturalHeight / 2);
            image.X = mouse.X - (image.naturalWidth);
            break;
        case "middle-right":
            image.Y = mouse.Y - (image.naturalHeight / 2);
            image.X = mouse.X;
            break;
        default:
            image.Y = mouse.Y;
            image.X = mouse.X;
            break;

    }

    // Margin offsets
    image.Y = image.Y - screen.margin.height;
    image.X = image.X - screen.margin.width;

    // Set image position
    $("div.image-hover").css({
        "top": image.Y,
        "left": image.X
    });
}
