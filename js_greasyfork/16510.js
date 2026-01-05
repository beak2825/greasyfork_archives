// ==UserScript==
// @name       LikeadorAutomatico (darAmor)(v6)
// @version    3.1
// @description Likeador automatico solo para el Mi.
// @match      *://*.taringa.net/mi
// @include        *.taringa.net/*
// @copyright  @Mauri934 (modificador por @Cazador4ever)
// @icon http://o1.t26.net/images/favicon.ico
// @grant        none
// @namespace http://www.taringa.net/Cazador4ever
// @downloadURL https://update.greasyfork.org/scripts/16510/LikeadorAutomatico%20%28darAmor%29%28v6%29.user.js
// @updateURL https://update.greasyfork.org/scripts/16510/LikeadorAutomatico%20%28darAmor%29%28v6%29.meta.js
// ==/UserScript==
/* jshint -W097 */
(function ($) {
        var iniciar = 0;
    var cora = '<li class="like"><a class="btn g" title="Dar amor..." id="like" value="start"><div class="btn-text"><i class="b-like"></i></div></a></li>';
    $('.my-shout-attach-options').append(cora);
    $('#user-metadata-profile > ul').append(cora);
    function likear(){
        iniciar = 1;
        $('.Feed-load.active').click();
        $(".require-login.button-action-s.action-vote.hastipsy.pointer").click();
        $(window).scrollTop(0,0);
    }
    var $botonCora = $('.like i.b-like');
    $botonCora.css({'background':'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAARCAYAAADdRIy+AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NDI4RjNDQjBFODNEMTFFMzg1MjQ5RTUzQzFBRDcwODAiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NDI4RjNDQjFFODNEMTFFMzg1MjQ5RTUzQzFBRDcwODAiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo0MjhGM0NBRUU4M0QxMUUzODUyNDlFNTNDMUFENzA4MCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo0MjhGM0NBRkU4M0QxMUUzODUyNDlFNTNDMUFENzA4MCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PjKUg8oAAAEgSURBVHjaYjQ3N2egJmDCIS4PxJpAzI5DXhaItYGYjZCBpkB8FogfAPE1IH4DxFVAzAiVtwLiG0D8CIivAPFzIM5HkmdglpGRgbFBLjoExApIFoBc4AzEPED8CogPA7E4kjwnEHsA8U8gPoLuwmYg5sPhxQIgno8nCGqBWBjdQHs8Yc0MxAZ45EEutUY3kIXCCP6LbuA+CgwDheExdAOrgfgbmQY2APF7dANBySEOiP+TaNh6IO7ElQ7XAnEeCYaBgikG2RHYcsoUIC4lwrCjQByAHky4sl4P1FBc3gclcE8g/kxsXoYZmglLDkhgKzR3fCalcICBmUAcBcS/oPzlQByELzUQk5hXAfFHIHYH4hIg/odPMbG5YycUEwQAAQYAIfQysI+7R2oAAAAASUVORK5CYII=)',
                    'background-position':0,
                    'background-size': '19px',
                    'top': '0px',
                    'left': '0px',
                   });
    $('#like').on('click', function darAmor(){
        if(iniciar===0){
            $botonCora.css({'background':'url(data:image/gif;base64,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)',
                            'background-position':0,
                            'background-size': '20px',
                            'top': '-1px',
                            'left': '-1px',
                           });
            //likear();
        setInterval(likear, 10000);
        }else{
            $botonCora.css({'background':'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAARCAYAAADdRIy+AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NDI4RjNDQjBFODNEMTFFMzg1MjQ5RTUzQzFBRDcwODAiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NDI4RjNDQjFFODNEMTFFMzg1MjQ5RTUzQzFBRDcwODAiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo0MjhGM0NBRUU4M0QxMUUzODUyNDlFNTNDMUFENzA4MCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo0MjhGM0NBRkU4M0QxMUUzODUyNDlFNTNDMUFENzA4MCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PjKUg8oAAAEgSURBVHjaYjQ3N2egJmDCIS4PxJpAzI5DXhaItYGYjZCBpkB8FogfAPE1IH4DxFVAzAiVtwLiG0D8CIivAPFzIM5HkmdglpGRgbFBLjoExApIFoBc4AzEPED8CogPA7E4kjwnEHsA8U8gPoLuwmYg5sPhxQIgno8nCGqBWBjdQHs8Yc0MxAZ45EEutUY3kIXCCP6LbuA+CgwDheExdAOrgfgbmQY2APF7dANBySEOiP+TaNh6IO7ElQ7XAnEeCYaBgikG2RHYcsoUIC4lwrCjQByAHky4sl4P1FBc3gclcE8g/kxsXoYZmglLDkhgKzR3fCalcICBmUAcBcS/oPzlQByELzUQk5hXAfFHIHYH4hIg/odPMbG5YycUEwQAAQYAIfQysI+7R2oAAAAASUVORK5CYII=)',
                            'background-position':0,
                            'background-size': '19px',
                            'top': '0px',
                            'left': '0px',
                           });
            location.reload(true);
        }
    });
})(jQuery);