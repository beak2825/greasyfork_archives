// ==UserScript==
// @name        AllTheFallen Mascots Favicon
// @version     0.1
// @author      SeRoATF
// @namespace   https://allthefallen.ninja/forum/index.php?members/seroatf.57/
// @description Adds a mascots favicon for ATF.
// @icon        https://files.catbox.moe/zc5cgk.png

// @include     http*://allthefallen.ninja.*
// @include     https://allthefallen.ninja/*
// @include     https://allthefallen.ninja
//
// @grant       none
// @support     Limited
// @license     N/A
// @downloadURL https://update.greasyfork.org/scripts/35474/AllTheFallen%20Mascots%20Favicon.user.js
// @updateURL https://update.greasyfork.org/scripts/35474/AllTheFallen%20Mascots%20Favicon.meta.js
// ==/UserScript==
// 

var head = document.getElementsByTagName('head')[0];
var icon = document.createElement('link');

icon.setAttribute('type', 'image/x-icon');
icon.setAttribute('rel', 'icon');

icon.setAttribute('href', 'data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAzlJREFUeNqkU0tvG1UU/u7MnRmP58Yex4kfifNwiKGkpAo0JALEgi6ATRdICLGoKiHEpi3b/gfEChaAYMOODUIIFgi6QIhIgSJQ0iivKrYbByd+xW/P2DNz7zCNxC/oWZ6j833f+c45xPd9PElQ2+Hvl3c211lz/zmRz89x11LUZ1e2zfXrH7c9/RcFHlgk8uJuofnBo9JoRZJ9d2Zee5hk9Lud/fyPpFr4+1t+76s3GG+FZHDZ9z3iw3P55WvH3tJbnxabqr513P2wxaMTgVgFJCgLlzOp01mKOd+Qky/vNIxKJa5MhUENCaoegtcJIHoj/HEmtTajrxF/+XUzpALCsUCGAoJqOPzrd1x5fr5B+d521IvFUXJMyJ1zmKqDWFyHLg0AR4/51ITRayI8KINqY5jsn6CtTaFhZGBbjNFBR/gO4Rh7ZQ2800GlWED7tIdFtw8jkkJUpsjRMxhyHbV8HYtLHvq8jH4oABnJPm2ln1J65S6SXRe5qy9BTWZR2d3F0dYRjmQCGBxR0YCZlpFJmVBNjm7+BDrXYA1kQrWr1+53ydbapKKARcNgbAGhkYW98xdQsi/DcU34jo3c/AToRBroDjAq9/Dzvz1405NU/uiTz45lPbSqS6F4sdomzdM6NBapS0+vBDwZcliyDatkg9Qs2KKGZq2H/KGKjX0DbCEh0Vgqfc/uL/2w/euftxtEYkwjWBifHSbm5gZX3PNgrw6GpSQenFYxYzbQ6/k42DMCsFlETAnUG9rQKd0oV9s3s6sr7NJyDppGZySJzKwvJ/Dq6jSEL8GyXPQDk8s7/8B5uAE/k+6vXdIfULvdRiwVPzh4VLSmlp/BZCIGVZHx/4n7QoB7HEY4jEjUAC/eD7abr7984/bXiwtTX1AaG0dA2Yykqee5TX5WLEjMNDuyptqCc2k0DEYYjmSZKiw4r1BXjji5d2/9lFqcvdvtW6Bq4H7A1Xzv7este+QdDSpFkyrZz8Nq4jchxBhVKGeKPF6ptt8plBpvxsbTpUQ2uxnULlRSWZIupGrJ7IYi/OAXhEoV5Xtf8O3HeSEC+QaTpjNGd+hKZIyFCsQdHdTqw4s+8qTv/J8AAwAwh4YkmwoKtgAAAABJRU5ErkJggg==');

head.appendChild(icon);