// ==UserScript==
// @name Anti-Troll pour FA
// @namespace
// @description Pour se débarrasser des trolls nuisibles sur le forum FA, il suffit d'installer TamperMonkey ou GreaseMonkey (Chrome, Firefox, Opera ect..), puis installer mon script. L'effet est immédiat ! Les messages des trolls seront masqués automatiquement, sans toucher à l'ergonomie du forum ! Vous pouvez à tout moment désactiver le script, bien évidemment :) Ensemble, luttons pour nettoyer le forum !

// @author Le Grand Vizir
// @homepage
// @version 1.0.4
// @require https://code.jquery.com/jquery-2.2.4.min.js
// @include *.forum-auto.com/*
// @namespace https://greasyfork.org/users/47830
// @downloadURL https://update.greasyfork.org/scripts/20348/Anti-Troll%20pour%20FA.user.js
// @updateURL https://update.greasyfork.org/scripts/20348/Anti-Troll%20pour%20FA.meta.js
// ==/UserScript==

	jQuery('[data-id_user="1402936"]').parents('table').hide(); // Pour nettoyer le troll d'autoquiroulcool
    jQuery('[data-id_user="401677"]').parents('table').hide(); // Pour nettoyer le troll de tetanos-46