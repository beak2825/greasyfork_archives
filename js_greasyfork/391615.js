// ==UserScript==
// @name   		    Disable previews on YouTube (Firefox).
// @description   Disable previews while hovering thumbnails on YouTube.
// @include		    https://www.youtube.com*
// @version 		  1b
// @grant   		  none
// @require		    https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @icon          data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABqUlEQVRYhe2VPW4TURRGzzWWG1xYCFEjOTIO1SSQBsEaKFgBHQ0Fa2ABNLAFSpZBhY0Lgp1oAqkjhFykiCxnDgUBbMdvkgG6zNe8p/fu3HPmH+rUqXPVE1WKP3U3MaIltIAWYUMAKYQZMIOYZfnn/yOwu3H3NvBK2AY6QpuIBohnNedGLZBjYQoMxRf3DiaHlQV2NzaB+EhEtgxJw3FxzV9Co6Jwa+fr3lpOIyUg0ftnOEBEFo3opThJAaCXhOsEPboQ/mf8K4Gba+EAxFC4g75W5xfAEW5UFhDaZZc9y8fTLB8/R3bU9yVwgHZlgZ97Jff8LFsH45H6CHmqHiUkmilIcsM181X4cr2VjykVAAuI0qcdYNDtZ8AbIh6k4MK8soBwvNpwET7o9jvAS+AZEc2SDxMs9Lq0APAtBVe3IfYIbq2FLsNRv1cWEPZ/z11cF4L+Ql05fKXXatJvQeE+OjoHL4Oug+vwtHFaXSD7MkF4jL5Vc3WqzC8BnwNT9VB9Bzx5mOfJ86z0Owb40O03gZbQJKKJIhTAXDi51rk+vz8YVG1bp06dK5wfLeUbFPT8L9QAAAAASUVORK5CYII=
// @namespace https://greasyfork.org/users/11231
// @downloadURL https://update.greasyfork.org/scripts/391615/Disable%20previews%20on%20YouTube%20%28Firefox%29.user.js
// @updateURL https://update.greasyfork.org/scripts/391615/Disable%20previews%20on%20YouTube%20%28Firefox%29.meta.js
// ==/UserScript==

$(window).on('load', function (e) { setTimeout(function (){  
check();   
}, 2000);                                  
});

async function check() { setTimeout(function (){ 
$('#mouseover-overlay').each(function(i, obj) {  
$(obj).remove(); 
});
if ($('ytd-thumbnail > #thumbnail').find('#mouseover-overlay').length) {check();}   
}, 300); }