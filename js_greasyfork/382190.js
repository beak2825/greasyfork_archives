// ==UserScript==
// @author       nht.ctn
// @name         [DP] PlanetDP Diğer Sitelere PlanetDP Bağlantısı Ekleme Aracı
// @namespace    https://github.com/nhtctn
// @version      1.2.6
// @description  Sık kullanılan birkaç film, dizi ve anime sitesine PlanetDP'ye kolay erişim sağlayacak bağlantı ekler.
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAAJcEhZcwAACxEAAAsRAX9kX5EAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuOWwzfk4AAAPHSURBVFhHxVZtaI1hGD7ztRGK8v39FUIkfiilKC0halPbOe/7zlZbxFbKHwmlJX6YhJolP1fyg4PT7Hy8m3xT8kNM4Q8TITQjs/tx3Y/73XnPOc84ph1X3Z33uZ/r/nju97nv8wYYsTJaGrdp2+VSNUor/gdiNk1CEufjFtVe20pjRJ1bKKXyEhbtQhLvEzYduRqisbKVW7iOWoIEHkE6OJFYBY2TrdzhZhENxSs5iQQIv52QutYgTZDt3CFq0Xok8SZhK6UTsehYzhO57HSMx92IcBK/RFfkhBukyUL5d7gWLTtXrAbqZ0fNQ4C1ekOgAiovGvpRjQp87UnEom/gnWwqoylC6zvguNwrbTxEi+Wk4eYSmqMJAnTGQgR+mKyG5n2LWXQqXkrThPb3wEn28kDiZ54DKc5tOuRuV8M1EUCFCqCvgw35E8EhvkN/GvvThZo9+J3CwTp+5leBdZffOU79EroSvIw8bQC4DhXC5nUKD8KJQBpQrRlC/TPgnKdguSz5lbxKd6yd26qluZQWCU2qRWEjlyuCROB7ltB7B5zcgOyRJa/vmpyywHEXHB+9HaSRzOULivV2BOo08nU16awbotnauQkgPY/Z3cdlGYDDiyZnfoFNO2SLmARaLJqP5B6YuCy9JsIngOHXuN19TlT8CupNTvwSt7o/48KViYmG67woQPJ3THxPuIKQhlavfZsqaLTetKhVK4C4pQ6kG6YKNae3HabmCji+ZeanC13heaMNUZoFrMRvm1YAaL2qTCOIpT4mHFXJVRNqgBNBNRphn9KWJgHnXsKhNWL6C6yQzU+i4qQ2phujQhH/1LtQTiMQuBZc4+VLFXoGXsn+/WqAmCfh2hQSEoUr1TDWtZTRcp/xBwR3NBnQcwItC4ftSU4vYtFb2NdECilfzDMBZ7s9g+hWNZN1UUtN5TWCXLpeThM1EcCYXg1+rzfdE3C+QGq9Vv0tMMePeoZopRWsi+ykfC6ZJgDxIM3FabJpzR848ZlI8Ev2/5QwavQcxBy1SdQa3CE4yTEI5nxmwFShMHwtENPswePV56SKdXjPQ3A5q7F+lxokUxD0NqqzSjvrC+CgrccZ+j8Wog0I/MQfxCz0FPxif0v2CUjgk+cUz9m01BvMiR33K9VgcdF3cNuZg5iEOnBhD0aC7/58s7MFt505WFJQlS5Ifb98jEat7ytNQT1B4As9M7s/gClYZAqMct/AMFoptP4DLlONPzD6/TF0m/2fXv0KlPiwBMa3HVW5q9Qg2coNkEAdhsg+tzj51Zs7BAI/ATGDAuhMWJKcAAAAAElFTkSuQmCC

// @include      *://*.imdb.com/title/*
// @include      *://*.imdb.com/list/*
// @include      *://*.imdb.com/user/*/ratings*
// @include      *://*.imdb.com/user/*/watchlist*
// @include      *://*.google*/search*
// @include      *://*trakt.tv/*
// @include      *://*.icheckmovies.com/movies/*
// @include      *://*.icheckmovies.com/lists/*
// @include      *://*letterboxd.com/film/*
// @include      *://*.themoviedb.org/movie*
// @include      *://*.themoviedb.org/tv*
// @include      *://*.thetvdb.com/series/*
// @include      *://*.thetvdb.com/movies/*
// @include      *://*.tvtime.com/*/show/*
// @exclude      *://*.tvtime.com/*/show/*/episode/*
// @include      *://*tvmaze.com/shows/*
// @include      *://*.criticker.com/film/*
// @include      *://*.criticker.com/tv/*
// @include      *://*subscene.com/subtitles/*
// @include      *://*.opensubtitles.org/*
// @exclude      *://*.opensubtitles.org/en/search/subs
// @include      *://*.addic7ed.com/serie/*
// @include      *://*.addic7ed.com/show/*
// @include      *://*.addic7ed.com/movie/*
// @include      *://animetosho.org/series/*
// @include      *://*myanimelist.net/*
// @include      *://*anidb.net/perl-bin/animedb.pl?show=anime*
// @include      *://anidb.net/anime/*
// @include      *://*.livechart.me/*
// @include      *://anilist.co/*
// @include      *://kitsu.io/*
// @include      *://*turkcealtyazi.org/mov/*
// @include      *://*turkcealtyazi.org/sub/*
// @include      *://*turkanime.net/anime/*
// @include      *://mydramalist.com/*
// @include      *://*movie.douban.com/subject/*
// @include      *://*.amazon.com/s?i=instant-video*

// @grant   	 GM_addStyle
// @run-at       document-end

// @require	 https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
/* global $ */
// @downloadURL https://update.greasyfork.org/scripts/382190/%5BDP%5D%20PlanetDP%20Di%C4%9Fer%20Sitelere%20PlanetDP%20Ba%C4%9Flant%C4%B1s%C4%B1%20Ekleme%20Arac%C4%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/382190/%5BDP%5D%20PlanetDP%20Di%C4%9Fer%20Sitelere%20PlanetDP%20Ba%C4%9Flant%C4%B1s%C4%B1%20Ekleme%20Arac%C4%B1.meta.js
// ==/UserScript==
/*jshint esversion: 6 */
(function() {

	'use strict';

	var PlanetDP =
	[{//==========================================================================================================================================================================================
         // İstemediğiniz siteler için 1'i 0'a çevirin.
         imdb: '1', imdb_new: '1', imdb_list: '1', imdb_google: '1',
         trakt: '1', iCheckMovies: '1', letterboxd: '1', TheMovieDB: '1', thetvdb: '1', tvTime: '1', tvMaze: '1', criticer: '1',
         subscene: '1', OpenSubtitles: '1', addic7ed: '1', animetosho: '1', turkcealtyazi: '1', turkanime: '1',
         MyAnimeList: '1', AniDB: '1', LiveChart: '1', aniList: '1', kitsu: '1', MyDramaList: '1', douban: '1', amazon_list: '1',

         name: 'PlanetDP', short_name: 'DP', url: 'https://www.planetdp.org/movie/search?title=%ttimdbId%', url_title: 'https://www.planetdp.org/movie/search?title=%title%&year_date=%year%&is_serial=all', url_forum: 'http://forum.planetdp.org/index.php?/search/&q=%ttimdbId%',
         icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAAJcEhZcwAACxIAAAsSAdLdfvwAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuOWwzfk4AAAPqSURBVFhHxVZJaBRBFG033HBLZqomMe4iiiAo4kFEBAUVFD0IghFUFJeDJ/EQiYILRkIUd/AiIogYVCSHkGSmuxM3RAJqEHJSjIhIFIlmz0xX+ar696RnpkdNYsYHn+7+9f7Sv379bkOhJxpaIGy28+uj/Ela8T/QXsuZY7JbCZMdl/aUqaTOLaRhjEiY4UMJk392TH5SPpk5jZZyC1EfWYQkXkF+OBY/LZ4X5dFS7iCq549FFSoSFneQyE/HYmelXRCi5dwhHmXrUIVPEIlE2tEn58TjSJiWcwMRLcxH8IcqCZ2IxTpQkXLxjDOiDB3C5ItVE+r7Wj6nz4ys1gs+JGy2D6cEwSkRk3U6Nq/osMMRogwewmLFosZtNuz1QjcIu9dlRmZpAkHNDOhfekkQrxPXC6IhVEC0gQMlPqqqoO5Fdd5kzznK3Qk5gZMwXhMB2WiMUU0JG6c/Cc3tQo9cEk/zC4n690DHn0cV1qp7KY0RCNDld47n93GbbdVkgrT5GmzDx1Se3ppu8C+LWN50ov4ZMLyDNyimR1WRd+mOlUBfI7ANRDPUsIJdZTCX9aAiV4U9vYjo2QGyBUdH6FFV5EmQUyXg9qotQLNOJLpq4j2YGZgXAXxLJ3JNNBTOIHom4LQZTsvpERUJfqtUYR9EPd9MJkgiPA9+XgRzKRGLXxc1AYkg+zYs3qZHVIBd8hsHCYJ9h912MtGQN4wx0NtBfE/cRNgV6R1fVUq9YPI6rQBwX5JumCqsStSldruoDy2F/rfBlSBpgS2+342KacNuOzxfL5i8SSuARIzvTjd0hX3DQNpJNA11/qG/CfuUYxkk4DzFVq0kUxd9dniVu8haSWXErfD6dGPIA//UU7MBNqVw2h7ATRHwmmXaMU5C2JFtLok7jdhDrYuxJUlji7X691rNCTjcAX2Lx8km8PkZvAPSNkaTeSZAOuwZdNLwaI8x7jpglepvSRMBVT7osna6J/D5E1tV6j+qWeHEWJlnKGIFy5ROZYzJuEUTAEy92XF8G+BY+AOlC9b79PAZyJcSBrc8B/FYZCOpNb7p7wIrw1tjvGYG9MRNjFUKNDSZ/j2wv7VJR+h+pZOVxijs3X6sffEHChIkVy8a+ArtbDCAkzf9zngJunUdrk2eLpsgwbdxm28iN4MH3qA16VT//2UGS5NPwuJ7VZXIxeChRyd+PAOCZAh4bXjrY7KqYAKZDx3qmx0UzC+oUC9+vS4Oy18xhtDyoKBKdGeb7K6MsrlE//dQn9Og4DhSpkqOaMOHRIwdTAv+GoE30PLwAwFPuYFZSyIa2YU5P5KWcgN8l89gr49Ke9Y4UuUQhvELesxt69DhWMoAAAAASUVORK5CYII=',
         icon_green: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAAJcEhZcwAACxIAAAsSAdLdfvwAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuOWwzfk4AAAO2SURBVFhHxVZbSBRhGJ0toxtJ93vYZVl357LrVoRItEFCBUk9JEEKFUWXh57CB6OSLlhIRZYFou7MrljsUj30VEEZ1EP0UkngU1EhERJhWmmB2vlmv1lnZmdZW3M7cJj5v/98l/86IxC8Ea9H1uTKwubCGbrhf8Af9c+XVZQRkU8G1MBMNuccLkmTjqCQT3ieVtqUWWzPLaSI5MNcvEQh38CzYkyczV25g7vePRmzcBGFDIK9kirVeho9c7k7d1BalFIk70IRw5iNPrxfKGopmsfduQFOyRwkvqsXAeL9O551tHFZMnb4NJ+Eh4veEXiFoikb6N0MLMkBTp4oRJN+0DKJqriQJdkD01shNiU2G969PNKYr9lXoAsYfGe8MIowCoHPZW+rdxHL/h5IVsWzILhb3fm24KeKY8VTdSGwpnHNJOhrYacNmiwE/Al9ffBmcDFLRw8EvKSoyiZuuiiYOTj63yHhDu7XAdtG9H0065j9KORqQAssYWlmIFgbElRwk9pvHQLTSbjvj/g9LBPoskKyeBrtAJ4NSquylOXpAfFj8Bg3qf00JaBBVf6FAmuxWaezXIB9H9hr0Y2QCrkuhaVlLE8FRtEJUR03qe08KivfS1GpjF3IZxUKe+6gMziA4m84FgLnHgii3KR2vc05hUj2Fdf2LnbRQRsUfe12rY0D8L2WPL40ldSBpA91A4B2tcnBifeCzdbd7ov4grBnSk4cAm/TjOmOOP9u6oChQzcAOBF7TQ4jVOUveFayTAedf4woDLv9WDrxGZathF0TECPieupEAd1sErBOm22OxDvmW4/uBvicQFF9DloLoeuEznKMk8C1u5OFg7SGZMO73+TcbVnrYcGlhJXdCPjB0KQl/i3ksHwo1B7KY+9U4C/oqOFgXB5yk7yA2pjauPmjg5kpybDTDfbS7JiPalpAeN5wxMhWky1UE8pTIsp2XQDgN205EsegoQ1kT5YkYv3Gs8FcdEZgmjQjAJZjK5t14McknwvsNzSOVOUh6OJiVHSz6+gB5wdGINr9ZCuPl09EMQcx6s+WRA6E5omoiev0YNkAAV6bAlZj6ksxmg6TzZmq/AabcxuHyR5I1m0KnO4+TxIFd4H7aZY4RPbgq3M0FwhtsB7wOHymsfvYQcfOKZmF+PrhqF7xtI3DXzECr3VMSsTOxvMW/oxXsvzfAxdLWUriBB9RcSwbP2CUh22JX+G+38Ld4w/MwBk9Me51MSzuEWqECdyVGyD5OZzlqgK1YAqbcghB+AO6HvKsiiWw5QAAAABJRU5ErkJggg==',
         icon_white: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuOWwzfk4AAAMHSURBVFhH3ZZdaM1hHMfP2WGdwkje5qWJFDYaaqXEjbxeiUKKJcmd5IJiV7uYcqHJW6GVCyQiaiuk5mLkRnKj3axdMBdceMk4O87x+T3Pd2fOzv/v7OycHfKpb8/v/Xn2P/+XRf4Z0ul0ZSqVakDVCv0dOMAO1IzmKFR+uBrzOcBjdB7NU7i8cIgYm59EX9ElVKNUeWFjuy+6UQJd5mALlCofbDqRza+wplkHUBtapHRpYY+o1pgL/AabbkMfdJAkuoa5WOniYVgFcpeYdRob2I24xCUF/mz0kLwD2w5yHS1VyehhyEy0zmxmR7F/IPvtT6NJrgiUO4K+u1MA9k+WW6zLVFY4DKhnwE65dqBeNx2w36LdmO4nMvCXo9e+woNv3MasV9nIoXEzOizX/Od+7BDEOlHmryQUx29FKV/hMR/uYa5SaX5o2I9a5Jp/14/Lhrg9Ca2Yk1VqtRvRO18xBDHjAWpQaTgUnUBtcs2/oDmBkH/P0ogGnxy7cQMPbZBrR6vd8CBInkMdcs1vUm8g5O0GbcasVIuDWL6D21O0RuVDkLiDXso1/4BvycXq0AqVOvBrkD2SWffDcEg/SSQSuT8JiS7UJ9f8rerJQMweTbsy41VmdVWoBfX7qmDIv0Jb1JYLyR6UpNa9BbFX+lYP/gtU54qBUAwdJGb3Qijke9E+zAq15kLSXi6DL5ZZFsOvNoe1Hx3DHOeKAd/u+qx3wHDIf0RHMeNqC4fCqb7N4V4irPZJfsqaed/j16J2VxUC+W8sp9AUteWHpjrXDdibFHZXxlZiM9BFNOCrciFn34WraK5rLgT61/sxjkaFLR5Hxxn6yWVCIH8f1aqtcGjeq1k2zH7vaDKZ3IXd46PBkH+G1mrM6NGmDuwO1CU3EPJv0HbMzMepKBh2xo/+M9T1oUOYmSeiJDD0pt8iGPKfUROaoJbSwuBO7ZUFcXvznUXTVTo2sEG39nTgGzfQQpWMLWz0RXvb5o9YRv6PRLGwYZU2ti/cBoXLB5vaP6N7OEP4x+L/JBL5BZkthtrAnUDCAAAAAElFTkSuQmCC',
         icon_long: 'data:image/png;base64,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',
         icon_iCheckMovies: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAAJcEhZcwAADsIAAA7CARUoSoAAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuOWwzfk4AAAGiSURBVDhPjdK/LwNhGAfwhxAVVVFSNBE7y20WYTLZ+yPpIFHX43+4YxSrxGIxCBsxGJSgEVKtRmhVG5EwiFFCSPzoe77P9W1VW00v+eTNPfc+3773XIkvrx6a8eihhEfXVkExs01kZiDdTOK6hUQKrmwkLltJXLSRSNhJnLeTiDuIzNtGko0m8xvqQzGongCRtHGAArvwCgI4LAZWUO0APOQLG10wBBNwBNaJIAr5oGoB/CAwH1zGOgBLsA5Or65iLtoTVAaVBUzBG4Y4mh+m9g3PfmNawzoOa/AOlUEygG9MbpYBhY08iwgM+wx1paQuWV9NKQYAH5+HWdjEA11A6CDW2ZJ6qSj5dHVD3mxBAzzCDT7nCNZ+8MAd/GlGcBKrQoG54I4sboIdFmEMRzSwxiEDn2A14nX4Pj+DGGaAAg+FH6bBDZOwLWtF2McnyzeedpI46yArAAX+w/CmD0jBPXzJWgH/iCKOu0icOKk8oOL9Svx+skg3/RfwIjdXbcwd9JA4dFGtgOqNe32U2++legL4D5OVzUou7KZcGM11BTjoB0Cz4wOsqbXoAAAAAElFTkSuQmCC',
         icon_TheMovieDB: 'data:image/png;base64,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',
         icon_OpenSubtitles: 'https://images2.imgbox.com/4b/72/EpGIM9Ap_o.png',
         icon_anidb: 'https://images2.imgbox.com/0b/d3/uH45PTHK_o.png',
         icon_sarangni: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAQCAYAAAD52jQlAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOwgAADsIBFShKgAAAABh0RVh0U29mdHdhcmUAcGFpbnQubmV0IDQuMC45bDN+TgAAAqZJREFUOE9lk8trE1EUxm8effiidpWNSJMaBClaaVMtUkQkKAgu1Y1VcONC1NrYmYSkaZsmttZW+6BR8dGVf4Abl/4fghsRlFaN0pR00uQev3PvzGTSDnzcM2fu97vfnZkrnEu+6SL5cj/JtwdIrh0k+Q7i2qvXtnieo9V2PcJvo/RV+5gkuYIHBUxYgJb3kVzE/QvUrIU23Z+HnrU29DRIcgYj++BnjgLKYlgDZmEsYAIned+htSflYZKv0OdkRWgVvRUEYB/7mQOekM/RzLdgVayWx4P5KA3fiNPw9ct089oQ5W7101ahgzY+nKTM3fP6ma3FO+eoMoa07FN+cLAjIefQyOGGtzMVoFq+h6LhSJPix6O0udS9p8/6kwgpn/IzBzwhZ5B02o6P1f5lhtTkwVgffcpccc1fipfc+nPuqltvjBzRKdnPHPCELNhJeYQc6Nn+WBP023KvWyto5JiqfyeOul6HI2SOY9uabqdSyoEONEF/zuqR5YWWzIjyeTlCToI+BU3o0YGe2ZXUC127f8Gty6nuJj+PQqYFijaqp/EVMa6bg2ry7qTfC2G3dnTx1Al88c4mP/NcaC3lp3oqSOuGhg709TYl+joTc+u/2RBVx9toJxsgy/ApH/tdaD2F3yHbSlXTR5bpp1/maWWMdDWSxVGXJhr31XG8Ow6TFGSNaR/7mcM8UTE0lFeyHvuobIbUT+1o6XYP/biHRBOtbq+WQSqGpgFMAAyfSgrO9pgf0GQnVVHILF4yJu9gEX4/vKV6Mkg7pi30WVUArId+2n7go8pIgCqP4OVF4GeOZXTY538Ox20UL3rKcxCeYOQznbfFff5l+AtPYuSvzeIw8Ck/OAroXJvGIdoa1WlqTlJvWk5ptKizzlvcTjRUTgSI/ZokxH9iteh4MiGYswAAAABJRU5ErkJggg==',
         main_color: '#f80',
         hover_color: '3F51B5',
         domain: 'planetdp.org', domain_url: 'https://www.planetdp.org',
    }];//=========================================================================================================================================================================================

    var regex = /\/title\/(tt\d+)\/?/;
    var pageUrl = window.location.href;

    // Common Used Vars
    var ttimdbId, HTML;
    var episodeCheck;
    var titleArea;
    var imdbLink;
    var imdbButton;
    var elBox;
    var elTitle;
    var title;
    var year = "";
    var infos;
    var styles = "";
    var className;
    var scriptSelector;
    var x, a, i, len; // for integers

    if (pageUrl.search( /imdb\.com\/title/ ) >= 0 && ( PlanetDP[0].imdb == 1 || PlanetDP[0].imdb_new == 1 ) ) //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    {
		// Vars
		ttimdbId = regex.exec( pageUrl )[1];
		var newRatingBar = $('[class^="TitleBlock__ButtonContainer"]');

		if (newRatingBar.length > 0 && PlanetDP[0].imdb_new == 1) {
			// Episode Check
			episodeCheck = $('a[class*="SeriesParentLink"]').length > 0;
			if (episodeCheck) {
				let parentLink = $('a[class*="SeriesParentLink"]').attr("href");
				ttimdbId = regex.exec( parentLink )[1];
			}

            // Position and Classes
            const refPos = (p_ref, width, marginR) => {
				let ref = document.querySelector(p_ref).getBoundingClientRect();
                let screen = window.screen.width;
                return {
					top: (window.scrollY + ref.top) + "px",
					left: ( (screen >= 1023.5) ? ref.left - width - marginR : (screen >= 350) ? ref.right + (marginR*2) : -200 ) + "px",};
            };
            const refCls = (p_ref) => {
				let ref = document.querySelector(p_ref)
                return {
					cls1: $(ref).children('div:first').attr("class"),
					cls2: $(ref).find('div:first > div:first').attr("class"),
				};
			}

            // On resize
            var refSlc = '[class^="TitleBlock__ButtonContainer"]';
            var wid = 90; // 90 benim yerleştirdiğim elementin boyu.
            var marg = 10; // 10 Dudak payı
            window.onresize = function() {
                $('#imdb648').css("top", refPos(refSlc, wid, marg).top);
                $('#imdb648').css("left", refPos(refSlc, wid, marg).left);
            };

			// Area
			let pos = refPos(refSlc, wid, marg);
			let cls = refCls(refSlc);
            $('[class^="TitleBlock__TitleContainer"]').css("padding-right", wid + "px");
			$('body').prepend('<div id="imdb648" class="imdb648 ' + cls.cls1 + '" style="position: absolute; top: ' + pos.top + '; left: ' + pos.left + '; z-index: 100;"></div>');
			$('#imdb648').append('<div class="' + cls.cls2 + '">SEARCH ON</div><div id="newDiv648"></div>');

			// Put Buttons
			PlanetDP.forEach(function(p) {
				let linkClone = newRatingBar.find('a.ipc-button:first').clone().css("min-width", "auto").attr("target", "_blank");
				linkClone.clone().attr("href", url(p.url ) ).html('<img style="height: 1.4rem; opacity:0.9;" src="' + p.icon + '" title="' + p.name + '">').appendTo( $('#newDiv648') );
				linkClone.clone().attr("href", url(p.url_forum) ).html('<img style="height: 1.4rem; opacity:0.9;" src="' + p.icon_green + '" title="' + p.name + ' Forum">').appendTo( $('#newDiv648') );
			});

			// Advanced Script
			className = "imdb648";
			scriptSelector = '#searchOn a[href*="planetdp.org/movie/search?title="]';
			advencedScriptAction( className, scriptSelector );
		}
		else {
			const html = () => {
				var h = '';
				for( var i = 0, len = PlanetDP.length; i < len; i++ ) {
					var p = PlanetDP[i];
					if ( p.imdb_list == 1 ) {
						h += '<a class="' + className + '" href="' + url( p.url_forum ) + '" target="_blank" style="height: 13px; float: right; padding: 0 3px;"><img style="height: 15px; opacity:0.7;" onMouseover="this.style.opacity=1" onMouseout="this.style.opacity=0.7" src="' + p.icon_green + '" title="' + p.name + '"><\/a>';
						h += '<a class="' + className + '" href="' + url( p.url ) + '" target="_blank" style="height: 13px; float: right; padding: 0 3px;"><img style="height: 15px; opacity:0.7;" onMouseover="this.style.opacity=1" onMouseout="this.style.opacity=0.7" src="' + p.icon + '" title="' + p.name + '"><\/a>';
					}
				}
				return h;
			};

			// Episode Check
			episodeCheck = document.querySelector( 'meta[property="og:type"][content="video.episode"]' ) != null;
			if (episodeCheck)
			{
				let parentLink = document.querySelector( 'div[class="titleParent"] > a' ).href;
				ttimdbId = regex.exec( parentLink )[1];
			}

			// Advanced Script
			className = "imdb648";
			scriptSelector = 'table#gm_links a[href*="planetdp.org/movie/search?title="]';
			advencedScriptAction( className, scriptSelector );

			// Areas
			titleArea = document.querySelector ( 'div.subtext' );
			titleArea.insertAdjacentHTML( "beforeend", html() );
		}
    }

    else if (pageUrl.search(/imdb\.com\/(list|.+\/ratings|.+\/watchlist)/) >= 0 && PlanetDP[0].imdb_list == 1 ) //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    {
	    const html = () => {
		   var h = '';
		   for( var i = 0, len = PlanetDP.length; i < len; i++ ) {
		    	var p = PlanetDP[i];
                if ( p.imdb_list == 1 ) {
                    h += '<a href="' + url( p.url_forum ) + '" target="_blank" style="height: 16px; float: right; padding: 3px 0 0 5px;"><img style="height: 16px; opacity:0.6;" onMouseover="this.style.opacity=1" onMouseout="this.style.opacity=0.6" src="' + p.icon_green + '" title="' + p.name + '"><\/a>';
                    h += '<a href="' + url( p.url ) + '" target="_blank" style="height: 16px; float: right; padding: 3px 0 0 10px;"><img style="height: 16px; opacity:0.6;" onMouseover="this.style.opacity=1" onMouseout="this.style.opacity=0.6" src="' + p.icon + '" title="' + p.name + '"><\/a>';
                }
		    }
		    return '<div>' + h + '</div>';
	    };

        // Work on Each Movie
        elBox = document.querySelectorAll( 'div[class="lister-item-content"]' );
        for ( x = 0; x < elBox.length; x++ )
        {
        // Vars
        ttimdbId = elBox[x].querySelector( '[href^="/title/tt"]' );
        ttimdbId= ttimdbId.attributes[0].value; ttimdbId = ttimdbId.substr( 7, 9 );

        // Areas
        titleArea = elBox[x].querySelector( '[class="lister-item-header"]' );
        titleArea.insertAdjacentHTML( "beforeend", html() );
        }
    }


    else if (pageUrl.search(/google\D+\/search\?/i) >= 0 && PlanetDP[0].imdb_google == 1 ) //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    {
	    const html = (position = '') => {
		   var h = '';
		   for( var i = 0, len = PlanetDP.length; i < len; i++ ) {
		    	var p = PlanetDP[i];
                if ( p.imdb_google == 1 ) {
                    h += '<a href="' + url( p.url ) + '" target="_blank" style="' + position + ' z-index:5;"><img style="height: 20px; padding: 0 10px; vertical-align: sub; opacity:0.4;" onMouseover="this.style.opacity=1" onMouseout="this.style.opacity=0.4" src="' + p.icon_long + '" border="0"></a>';
                }
		    }
		    return h;
	    };

        // Work on Each Link
        imdbButton = document.querySelectorAll( '#search #rso .g [href^="https://www.imdb.com/title/tt"]' );
        for ( x = 0; x < imdbButton.length; x++ )
        {
            // Vars
            imdbLink = imdbButton[x].href;
            var titleButton = imdbButton[x].querySelector( 'h3' );
            ttimdbId = imdbLink.match( /.+imdb\.com\/title\/(tt\d+)\/?/i )[1];
            title = imdbButton[x].textContent;
            var subButtonCheck = imdbButton[x].attributes[0].value.search( /imdb\.com/i ) < 0;

            // Areas
            if (!subButtonCheck)
            {
                if (title.search( /(TV Episode|Video Game)/i ) < 0 && title.search( /"/i ) < 0 && imdbLink.search( /title\/tt\d+\/./i ) < 0)
                {
                    titleButton.closest('div').insertAdjacentHTML( "beforeend", html() );
                }
            }
            else if (imdbLink.search( /title\/tt\d+\/./i ) < 0)
            {
                imdbButton[x].insertAdjacentHTML( "afterend", html() );
            }
        }
    }


    else if (pageUrl.search(/trakt\.tv/) >= 0 && PlanetDP[0].trakt == 1 ) //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    {
	    const html = (urlType) => {
		   var h = '';
		   for( var i = 0, len = PlanetDP.length; i < len; i++ ) {
		    	var p = PlanetDP[i];
                if ( p.trakt == 1 ) {
                    h += '<a target="_blank" href="' + url( p[urlType] ) + '" data-original-title="" title="">' + p.short_name + '</a>';
                }
		    }
		    return h;
	    };

        waitForKeyElements('.sidebar .external', function() {
            pageUrl = window.location.href;
            if (pageUrl.search(/trakt\.tv\/(movies|shows)\//) >= 0) {
                // Area
				titleArea = document.querySelector( '[href*="imdb.com/"]' );
				// Vars
                imdbLink = document.querySelector( '[href*="imdb.com/"]' ).href;
                if (imdbLink.search( "find" ) < 0) {
                    ttimdbId = imdbLink.match( regex )[1];
					HTML = html("url");
                } else {
                    title = titleEdit( document.querySelector( '[property="og:title"]' ).getAttribute( "content" ) );
                    year = titleEdit( document.querySelector( 'span[class="year"]' ).textContent );
					HTML = html("url_title");
                }
				// Final
                titleArea.insertAdjacentHTML("afterend", HTML);
            }
        });
    }

    else if (pageUrl.search(/icheckmovies\.com/) >= 0 && PlanetDP[0].iCheckMovies == 1 ) //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    {
	    const html = () => {
		   var h = '';
		   for( var i = 0, len = PlanetDP.length; i < len; i++ ) {
		    	var p = PlanetDP[i];
                if ( p.iCheckMovies == 1 ) {
                    h += '<li><a href="' + url( p.url ) + '" target="_blank" style="background: none; text-indent:0px"><img style="width: 10px; height: 10px; margin: 8px; opacity:0.3;" onMouseover="this.style.opacity=1" onMouseout="this.style.opacity=0.3" src="' + p.icon_iCheckMovies + '" title="' + p.name + '"><\/a></li>';
                }
		    }
		    return h;
	    };

        // Work on Each Movie
        elBox = document.querySelectorAll( 'ul[class="optionIconMenu optionIconMenuCheckbox"]' );
        for ( x = 0; x < elBox.length; x++ ) {
			// Vars
			ttimdbId = elBox[x].querySelector( '[href*="imdb.com/"]' );
			ttimdbId = ttimdbId.attributes[1].value; ttimdbId = ttimdbId.substr(26);

			// Areas
			titleArea = elBox[x].querySelector( 'a[class="optionIcon optionIMDB external"]' ).closest("li");
			titleArea.insertAdjacentHTML( "beforebegin", html() );
        }
    }

    else if (pageUrl.search(/letterboxd\.com/) >= 0 && PlanetDP[0].letterboxd == 1 ) //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    {
	    const html = () => {
		   var h = '';
		   for( var i = 0, len = PlanetDP.length; i < len; i++ ) {
		    	var p = PlanetDP[i];
                if ( p.letterboxd == 1 ) {
                    h += '<a href="' + url( p.url ) + '" class="micro-button track-event">' + p.name + '</a>';
                }
		    }
		    return h;
	    };

        // Vars
        imdbButton = document.querySelector( '[href*="imdb.com/"]' );
        imdbLink= imdbButton.href; ttimdbId = imdbLink.match( /.+imdb\.com\/title\/(tt\d+)\/?/i )[1];

        // Areas
        titleArea = imdbButton.parentElement;
        var thatDamnFlagIcon = titleArea.querySelector( '[data-original-title="Report this film"]' );
        if (thatDamnFlagIcon) {
            thatDamnFlagIcon.remove();
            titleArea.insertAdjacentHTML( "beforeend", html() );
            titleArea.insertAdjacentElement( "beforeend", thatDamnFlagIcon );
        }
        else {
            titleArea.insertAdjacentHTML( "beforeend", html() );
        }
    }

    else if (pageUrl.search(/themoviedb\.org\//) >= 0 && PlanetDP[0].TheMovieDB == 1 ) //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    {
	    const html = () => {
		   var h = '';

		   for( var i = 0, len = PlanetDP.length; i < len; i++ ) {
		    	var p = PlanetDP[i];
                if ( p.TheMovieDB == 1 ) {
                    h += '<div class="homepage"><a class="social_link" title="' + p.name + '\'yi ziyaret edin" href="' + url( p.url_title ) + '" target="_blank" rel="noopener" data-role="tooltip"><img style="padding: 5px; width: 30px;" src="' + p.icon_TheMovieDB + '"></a></div>';
                }
		    }
		    return h;
	    };

        // Vars
        infos = document.querySelector( 'title' ).textContent.replace( " — The Movie Database (TMDb)" , "");
        title = titleEdit( infos.replace(/(\d+)|TV Series (\d+)-(\d+)? ?/, "") );
        year = titleEdit( infos.match(/(\d+|TV Series \d+)/)[1].replace(/TV Series /, "") );

        titleArea = document.querySelector( 'div[class="social_links"]' );
        titleArea.insertAdjacentHTML( "beforeend", html() );
    }

    else if (pageUrl.search(/thetvdb\.com\/(series|movies)\//) >= 0 && PlanetDP[0].thetvdb == 1 ) //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    {
	    const html = () => {
		   var h = '';
		   for( var i = 0, len = PlanetDP.length; i < len; i++ ) {
		    	var p = PlanetDP[i];
                if ( p.thetvdb == 1 ) {
                    h += '<span><a href="' + url( p.url ) + '" target="_blank">' + p.name + '</span></a>';
                }
		    }
		    return h;
	    };

        // Vars
        imdbButton = document.querySelector( '[href*="imdb.com/"]' );
        if (imdbButton) {
            ttimdbId = imdbButton.href.match( /.+imdb\.com\/title\/(tt\d+)\/?/i )[1];
            titleArea = imdbButton.parentElement.parentElement;
            titleArea.insertAdjacentHTML( "beforeend", html() );
        }
        else {
            ttimdbId = document.querySelector( '#series_title' ).textContent;
            $('#series_basic_info .list-group').append( '<li class="list-group-item clearfix"><strong>ON OTHER SITES</strong>' + html() + '</li>' );
        }
    }


    else if (pageUrl.search(/tvtime\.com\/.+\/show/) >= 0 && PlanetDP[0].tvTime == 1 ) //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    {
	    const html = () => {
		   var h = '';
		   for( var i = 0, len = PlanetDP.length; i < len; i++ ) {
		    	var p = PlanetDP[i];
                if ( p.tvTime == 1 ) {
                    h += '<a href="' + url( p.url_title ) + '" target="_blank" class="' + p.name.toLowerCase() + '" style="background: ' + p.main_color + ';"><img src="' + p.icon_white + '" style="margin: 0;width: 20px;padding-bottom: 6px;"></a>';
                }
		    }
		    return h;
	    };

        // Vars & Areas
        title = titleEdit( $('[property="og:title"]').attr("content") );
        $( '.info-zone .container-fluid' ).append( '<span class="share-btns social" style="left: 20px;">' + html() + '</span>' );
    }


    else if (pageUrl.search(/tvmaze\.com\/shows\/\d+/) >= 0 && PlanetDP[0].tvMaze == 1 ) //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    {
	    const html = () => {
		   var h = '';
		   for( var i = 0, len = PlanetDP.length; i < len; i++ ) {
		    	var p = PlanetDP[i];
                if ( p.tvMaze == 1 ) {
                    h += '<a id="' + p.name.toLowerCase() + '" href="' + url( p.url_title ) + '" target="_blank" title="' + p.name.toLowerCase() + '" style="float: left; margin-top: 3px; background: ' + p.main_color + '; height: 26px;width: 26px;display: inline-flex;border-radius: 2px;margin: 3px 5px 0 0;align-items: center;justify-content: center;" onmouseover="this.style.opacity=0.8" onmouseout="this.style.opacity=1"><img src="' + p.icon_white + '" style="height: 20px;"></a>';
                }
		    }
		    return h;
	    };

        // Vars
        title = titleEdit( $('[property="og:title"]').attr("content").replace(" | TVmaze", "") );

        // Areas
        titleArea = $( '#general-information .social-buttons' );
		titleArea.css("display", "flow-root");
		titleArea.children('span').prepend( '<span style="float: left;">Search this on:</span>' );
		titleArea.children('span').after( html() );
    }


    else if (pageUrl.search(/criticker\.com/) >= 0 && PlanetDP[0].criticer == 1 ) //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    {
	    const html = (urlType) => {
		   var h = '';
		   for( var i = 0, len = PlanetDP.length; i < len; i++ ) {
		    	var p = PlanetDP[i];
                if ( p.criticer == 1 ) {
                    h += '<a target="_blank" href="' + url( p[urlType] ) + '" title="' + p.name + '" style="float: right;"><img style="height: 26px; vertical-align: baseline; padding: 3px;" src="' + p.icon + '"></a>';
                }
		    }
		    return h;
	    };

        // Vars & Areas
        imdbButton = document.querySelector( '#fi_info_ext [href^="http://www.imdb.com/title/tt"]' );
        titleArea = document.querySelector( '.crit_container > h1' );
        if (imdbButton != null) {
            ttimdbId = regex.exec( imdbButton.href )[1];
			HTML = html("url");
        }
        else {
            title = titleEdit( titleArea.querySelector( '[itemprop="name"]' ).textContent );
            if (pageUrl.search(/\/film\//) >= 0) {year = titleEdit( titleArea.querySelector( '[itemprop="datePublished"]' ).textContent );}
            else {year = titleEdit( titleArea.querySelector( '[itemprop="startDate"]' ).textContent );}
			HTML = html("url_title");
        }

        // Fatal Blow
        titleArea.insertAdjacentHTML( "beforeend", HTML );

        GM_addStyle( ".crit_container > h1 > a > img:hover {background-color: #01305F; border-radius: 13px;}" );
    }


    else if (pageUrl.search(/subscene\.com/) >= 0 && PlanetDP[0].subscene == 1 ) //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    {
	    const html = (type) => {
		   var h = '';
		   for( var i = 0, len = PlanetDP.length; i < len; i++ ) {
		    	var p = PlanetDP[i];
                if ( p.subscene == 1 ) {
                    h += '<a target="_blank" class="imdb" href="' + url( p[type] ) + '" style="margin-left: 6px;">' + p.name + '</a>';
                }
		    }
		    return h;
	    };

        // Vars
        imdbButton = document.querySelector( '[href*="imdb.com/title"]' );
        if (imdbButton != null) {
            ttimdbId = imdbButton.href.match( regex )[1];
            if (ttimdbId.length == 8) {ttimdbId = ttimdbId.replace( "tt", "tt0" );}
            titleArea = imdbButton;
            titleArea.insertAdjacentHTML( "afterend", html("url") );}
        else {
            title = titleEdit( document.querySelector( 'title').textContent.replace( /.+Subtitles for (.+)/i, "$1" ).replace( /Subscene - (.+) .+ subtitle/i, "$1" ) );
            year = document.querySelector( 'div[class="header"] > ul > li' ).textContent.trim().replace( /Year:\s+/, " " );
            year = ( $('.comment-sub').length > 0 ) ? '' : year;
            titleArea = document.querySelector( '[href^="javascript:Embed"]' );
            titleArea.insertAdjacentHTML( "afterend", html("url_title") );
             }
    }

    else if (pageUrl.search(/opensubtitles\.org.+(\/subtitles\/|\/s?search\/)/) >= 0 && PlanetDP[0].OpenSubtitles == 1 ) //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    {
	    const html = () => {
		   var h = '';
		   for( var i = 0, len = PlanetDP.length; i < len; i++ ) {
		    	var p = PlanetDP[i];
                if ( p.OpenSubtitles == 1 ) {
                    h += '<a target="_blank" href="' + url( p.url ) + '" style="width: 21px"><img alt="imdb" width="16" height="16" src="' + p.icon_OpenSubtitles + '"></a>';
                }
		    }
		    return h;
	    };

        // Vars
        imdbButton = document.querySelector( '[href*="imdb.com/title/tt"]' );
        ttimdbId = imdbButton.href.match( /\/title\/(tt\d{7,8})/i )[1];
        if (ttimdbId.length == 8) {ttimdbId = ttimdbId.replace( "tt", "tt0" );}
        episodeCheck = document.querySelector( 'span[itemtype*="schema.org/TVEpisode"]' ) != null;
        if (episodeCheck)
        {
            var mainPageLink = document.querySelector( 'a[href*="/ssearch/sublanguageid-"]' ).href;
            ttimdbId = 'tt' + mainPageLink.match( /\/imdbid\-(\d{7})/i )[1];
        }

        // Areas
        titleArea = imdbButton;
        titleArea.insertAdjacentHTML( "afterend", html() );
    }

    else if (pageUrl.search(/addic7ed\.com\/(show|serie|movie)/) >= 0 && PlanetDP[0].addic7ed == 1 ) //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    {
	    const html = () => {
		   var h = '';
		   for( var i = 0, len = PlanetDP.length; i < len; i++ ) {
		    	var p = PlanetDP[i];
                if ( p.addic7ed == 1 ) {
                    h += '&nbsp;&nbsp;<a target="_blank" href="' + url( p.url_title ) + '">PlanetDP</a>';
                }
		    }
		    return h;
	    };

        // Vars
        var pageType = pageUrl.match(/addic7ed\.com\/(.+?)\//)[1];
        if (pageType == "show") {
            title = titleEdit( $('#header > div > b > font').text().replace(/(subtitles\s+)$/, "") );
            titleArea = $('#header [href^="/overview/"]');
        } else if (pageType == "serie") {
            title = titleEdit( $('#container td > [href^="/show/"]').first().text() );
            titleArea = $('#container td > [href^="/show/"]').last();
        } else if (pageType == "movie") {
            title = titleEdit( $('span.titulo').text().replace(/Subtitle/i,"").replace(/\(\d{4}\)/g, "") );
			year = titleEdit( $('span.titulo').text().replace(/Subtitle/i,"").match(/\((\d{4})\)/g)[0] );
            titleArea = $('#container td > [href^="/show/"]').last();
        }
        titleArea.after( html() );
    }

    else if (pageUrl.search(/animetosho\.org\/series\//) >= 0 && PlanetDP[0].animetosho == 1 ) //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    {
	    const html = () => {
		   var h = '';
		   for( var i = 0, len = PlanetDP.length; i < len; i++ ) {
		    	var p = PlanetDP[i];
                if (p.animetosho == 1) {
                    h += ' | <a target="_blank" href="' + url( p.url_title ) + '">PlanetDP</a>';
                }
		    }
		    return h;
	    };

        // Vars
        title = titleEdit( $('#title').text().replace(/(\d+)/, "") );
        year = '';
        titleArea = $('#title_desc + table td > div > [href*="anidb.net/anime/"]').parent();
        titleArea.append( html() );
    }

    else if (pageUrl.search(/myanimelist\.net/) >= 0 && PlanetDP[0].MyAnimeList == 1 ) //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    {
	    const html = () => {
		   var h = '';
		   for( var i = 0, len = PlanetDP.length; i < len; i++ ) {
		    	var p = PlanetDP[i];
                if ( p.MyAnimeList == 1 ) {
                    h += ', <a class="' + className + '" href="' + url( p.url_title ) + '" target="_blank">' + p.name + '</a>';
                }
		    }
		    return h;
	    };

        if (pageUrl.indexOf("myanimelist.net/anime/season") < 0 && pageUrl.indexOf("myanimelist.net/anime") >= 0) {
            // Vars
            title = titleEdit( document.querySelector( 'h1.title-name' ).firstChild.textContent.replace(/ ?\(TV\)/i, "") );
        	elTitle = document.querySelector( 'span[itemprop="name"]' );

            // Advanced Script
            className = "mal648";
            scriptSelector = 'li > a[href*="planetdp.org/movie/search?title="]';
            advencedScriptAction( className, scriptSelector );

            // Areas
            if (document.querySelector( '[class="btn-login"]' ) == null) {
                titleArea = document.querySelector( '[class="pb16"]' );
                titleArea.innerHTML += html();
            }
        }
    }

    else if (pageUrl.search(/anidb\.net/) >= 0 && PlanetDP[0].AniDB == 1 ) //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    {
	    const html = (site) => {
		   var h = '';
		   for( var i = 0, len = site.length; i < len; i++ ) {
		    	var p = site[i];
                if ( p.AniDB == 1 ) {
                    h += '<div class="icons ' + className + '"><a class="i_icon i_resource_' + (p.short_name).toLowerCase() + ' brand" style="background-image: url(' + p.icon_anidb + '); height: 16px; width: 16px;" href="' + url( p.url_title ) + '" data-anidb-rel="anidb::extern" itemprop="sameAs" title="' + p.name + '"><span class="text">' + p.name + '</span></a></div>';
                }
		    }
		    return h;
	    };

        // Vars
        title = titleEdit( document.querySelector( 'h1[class="anime"]').textContent.replace(/Anime: ((.+)(\d{4})?) ?(\(\))?/, "$2") );
        year = titleEdit( document.querySelector( 'h1[class="anime"]').textContent.replace(/Anime: ((.+)(\d{4})?) ?(\(\))?/, "$3") );

        // Advanced Script
        className = "dp";
        scriptSelector = 'h1.anime li > a[href*="planetdp.org/movie/search?title="]';
        advencedScriptAction( className, scriptSelector );

        // Areas
        var resources = document.querySelector( '.resources > .value' );
        if ( resources.querySelector( 'div.group.thirdparty.english' ) == null ) {
            resources.insertAdjacentHTML( "beforeend", '<div class="group thirdparty english"></div>' );
        }
        titleArea = resources.querySelector( 'div.group.thirdparty.english' );
        titleArea.insertAdjacentHTML( "beforeend", html( PlanetDP ) );
    }


    else if (pageUrl.search(/livechart\.me\/anime/) >= 0 && PlanetDP[0].LiveChart == 1 ) //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    {
	    const html = (site) => {
		   var h = '';
		   for( var i = 0, len = site.length; i < len; i++ ) {
		    	var p = site[i];
                if ( p.LiveChart == 1 ) {
                    h += '<div class="liveChart648 column column-block"><a class="button expanded ' + p.name.toLowerCase() + '-button" href="' + url( p.url_title ) + '" target="_blank" rel="noopener nofollow">PLANET<span class="accent">DP</span></a></div>';
                }
		    }
		    return h;
	    };

        // Vars
        title = titleEdit( $('[property="og:title"]').attr("content") );

        // Advanced Script
        className = "liveChart648";
        scriptSelector = '#liveChart648-page div > a[href*="planetdp.org/movie/search?title="]';
        advencedScriptAction( className, scriptSelector );

        // Areas
        titleArea = document.querySelector( 'div.column > div.row.small-up-2.medium-up-3' );
        titleArea.insertAdjacentHTML( "beforeend", html( PlanetDP ) );

        // Styles
        GM_addStyle('.planetdp-button, .planetdp-button:hover, .planetdp-button:focus {background-color: #ff6d00; color: white}');
    }


    // SEASON CHARTS
    else if (pageUrl.search(/livechart\.me\/(spring|summer|fall|winter|tba)(.+)?\/.+/) >= 0 && PlanetDP[0].LiveChart == 1 ) //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    {
        const html = () => {
        	var h = '';
        	for( var i = 0, len = PlanetDP.length; i < len; i++ ) {
        		var p = PlanetDP[i];
                if ( p.LiveChart == 1 ) {
                    h += '<li id="LiveChart648" class="' + p.name + '"><a href="' + url( p.url_title ) + '" target="_blank" rel="noopener nofollow" style="display: table; padding: 7px 5px 0px 4px;" ><img style="height:16px;" src="' + p.icon + '" title="' + p.name + '"><\/a></li>';
                }
        	}
        	return h;
        };

        const eliminate = (site) => {
            if (elBox[x].querySelector( site ) != null)
            {elBox[x].querySelector( site ).closest('li').style.display = "none";}
        };

        var myScriptCheck = document.querySelector( '[id="LiveChart648"]' );
        if (myScriptCheck == null) {
        	elBox = document.querySelectorAll( '[class="anime-card"]');
            for ( x = 0; x < elBox.length; x++ )
            {
                // Vars
                title = titleEdit( elBox[x].querySelector( '[class="main-title"]' ).textContent );

                // Areas
                titleArea = elBox[x].querySelector( '.related-links' );
                titleArea.innerHTML += html();

                // Eliminate Existing Butons
                //=====================================================================
//                /* Official Site */            eliminate( '.website-icon' );
//                /* Trailer */                  eliminate( '.preview-icon' );
//                /*Twitter*/                    eliminate( '.twitter-icon' );
//                /* AniList */                  eliminate( '.anilist-icon' );
//                /* MAL */                      eliminate( '.mal-icon' );
//                /* AniDB */                    eliminate( '.anidb-icon' );
//                /* AnimePlanet */              eliminate( '.anime-planet-icon' );
//                /* AniSearch */                eliminate( '.anisearch-icon' );
//                /* Kitsu */                    eliminate( '.kitsu-icon' );
                /* Crunchyroll */              eliminate( '.crunchyroll-icon' );
                /* Official Ways to Watch */   eliminate( '.watch-icon' );
                //=====================================================================
            }

            // Set required style and hover
            styles = "";
            for( i = 0, len = PlanetDP.length; i < len; i++ )
            {
                styles += "." + PlanetDP[i].name + ":hover {background-color: #" + PlanetDP[i].hover_color + "; border-radius: 15px;} ";
            }
            GM_addStyle ( styles );
        }
    }


    else if (pageUrl.search(/anilist\.co/) >= 0 && PlanetDP[0].aniList == 1 ) //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    {
	    const html = (site, vData) => {
		   var h = '';
		   for( var i = 0, len = site.length; i < len; i++ ) {
		    	var p = site[i];
                if ( p.aniList == 1 ) {
                    h += '<a data-v-' + vData + '="" href="' + url( p.url_title ) + '" target="_blank" class="external-link ' + p.name + '">' + p.name + '</a>';
                }
		    }
		    return h;
	    };

        const anilistAction = () => {
            if (window.location.href.search(/anilist\.co\/anime/) > 0) {
                // Varsa eskileri temizle.
                var externals = document.querySelectorAll('.external-links');
				var vClass = externals[0].innerHTML.replace(/.+<a data-v-(.+?)=""(.|\n)+/,"$1");
                if (externals.length > 1) externals[1].remove();
                var oldies = document.querySelectorAll('.external-link.PlanetDP');
                for (let x=0; x<oldies.length; x++) {oldies[x].remove();}

                // Yenisini yerleştir.
                title = titleEdit( $('.header .content h1').text() );
                if ( $( '.external-links' ).length > 0 ) {
					$( '.external-links' ).append( html( PlanetDP, vClass ) );
				} else {
					$( '.sidebar' ).append( '<div data-v-7408c186="" data-v-1fe923a4="" class="external-links"><h2 data-v-7408c186="">External &amp; Streaming links</h2>' + html( PlanetDP, vClass ) + '</div>' );
				}
            }
            setTimeout(function(){ anilistAction(); }, 5000);
        };

		// Start ver.
        setTimeout(function(){ anilistAction(); }, 1000);
    }


    else if (pageUrl.search(/kitsu\.io\//) >= 0 && PlanetDP[0].kitsu == 1 ) //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    {
	    const html = () => {
		   var h = '';
		   for( var i = 0, len = PlanetDP.length; i < len; i++ ) {
		    	var p = PlanetDP[i];
                if ( p.kitsu == 1 ) {
                    h += '<li><a href="' + url( p.url_title ) + '" target="_blank" rel="noopener noreferrer" class="hint--top hint--bounce hint--rounded" aria-label="' + p.name + '"><img src="' + p.icon + '" style="width:20px"></a></li>';
                }
		    }
		    return h;
	    };

        const kitsuAction = () => {
            if (window.location.href.search(/kitsu\.io\/anime\//) > 0 && $('[property="og:title"]').attr("content")) {
                // Varsa eskileri temizle.
                var oldies = document.querySelectorAll('.where-to-watch-widget.external-script');
                for (let x=0; x<oldies.length; x++) {oldies[x].remove();}

                // Yenisini yerleştir.
                title = titleEdit( $('[property="og:title"]').attr("content") );
                titleArea = $( '.entry-state-status' ).parent();
                titleArea.after( '<div class="where-to-watch-widget external-script"><span class="where-to-watch-header"><span>Başka Sitede Ara</span></span><ul class="nav">' + html( ) + '</ul></div>' );
            }
            setTimeout(function(){ kitsuAction(); }, 5000);
        };

		// Start ver.
		setTimeout(function(){ kitsuAction(); }, 3000);
    }


    else if (pageUrl.search(/turkcealtyazi\.org/) >= 0 && PlanetDP[0].turkcealtyazi == 1 ) //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    {
	    const html = () => {
		   var h = '';
		   for( var i = 0, len = PlanetDP.length; i < len; i++ ) {
		    	var p = PlanetDP[i];
                if (p.turkcealtyazi == 1) {
                    h += '<a target="_blank" href="' + url( p.url_title ) + '" title="' + p.name + '" style="border: none; background: none; float: right; height: 17px; padding: 0 5px 0 0;"><img style="height: 17px; vertical-align: middle; padding: 0 0 0 0;" src="' + p.icon + '"></a>';
                }
		    }
		    return h;
	    };

        // Vars & Areas
        if (pageUrl.search(/turkcealtyazi\.org\/mov/) >= 0) {
            imdbButton = document.querySelector( '[href*="imdb.com/title/tt"]' );
            if (imdbButton) {
                title = imdbButton.href.match( /.+imdb\.com\/title\/(tt\d+)\/?/i )[1];
            } else {
                title = titleEdit( document.querySelector( 'span[itemprop="name"]' ).textContent );
                year = titleEdit( document.querySelector( 'span[class="year"]' ).textContent );
            }

            titleArea = document.querySelector( '[id="altyazilar"] > h5' );
        }
        else {
            // Vars
            var titleYear = document.querySelector( 'strong > a[href^="/mov/"]' ).parentElement.textContent;
            title = titleEdit( titleYear.replace( /(.+)\((\d+)\)/, "$1" ) );
            year = titleEdit( titleYear.replace( /(.+)\((\d+)\)/, "$2" ) );

            titleArea = document.querySelector( '[id="altyazilar"] > h2' );
            GM_addStyle ( ".portalust h2 a:after, .portalust h5 a:after {content: none;}" );
        }

        // Fatal Blow
        titleArea.insertAdjacentHTML( "beforeend", html() );
    }

    else if (pageUrl.search(/turkanime\.net\/anime\//) >= 0 && PlanetDP[0].turkanime == 1 ) //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    {
	    const html = () => {
		   var h = '';
		   for( var i = 0, len = PlanetDP.length; i < len; i++ ) {
		    	var p = PlanetDP[i];
                if ( p.turkanime == 1 ) {
                    h += '<a href="' + url( p.url_title ) + '" target="_blank" title="PlanetDP" style="float: right; height: 12px;"><img style="height: 16px; margin: -2px 0 0 5px; opacity: 0.8;" onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=0.8" src="' + p.icon + '"></a></li>';
                }
		    }
		    return h;
	    };

		// Vars
        titleArea = $( '#detayPaylas .panel-ust' );
        title = titleEdit( titleArea.text().trim() );
        year = '';

        // Area
        titleArea.append( html() );
    }

    else if (pageUrl.search(/mydramalist\.com\/\d+/) >= 0 && PlanetDP[0].MyDramaList == 1 ) //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    {
	    const html = () => {
		   var h = '';
		   for( var i = 0, len = PlanetDP.length; i < len; i++ ) {
		    	var p = PlanetDP[i];
                if ( p.MyDramaList == 1 ) {
                    h += '<li class="page-item nav-item"><a href="' + url( p.url_title ) + '" target="_blank" title="PlanetDP" class="nav-link"><img style="height: 20px; vertical-align: text-bottom; opacity: 0.7;" onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=0.7" src="' + p.icon + '"></a></li>';
                }
		    }
		    return h;
	    };

        var type = document.querySelector( 'meta[property="og:type"]' ).content;
        if (type == 'video.tv_show' || type == 'video.movie' || type == 'video.episode') {
            // Vars
            titleArea = document.querySelector( 'h1.film-title' );
            title = titleEdit( titleArea.querySelector( 'a' ).textContent.trim() );
            year = titleEdit( titleArea.textContent.match( /.+\((\d{4})\)$/i )[1] );

            // Area
            $('ul.nav-tabs').append( html() );
        }
    }

    else if (pageUrl.search(/movie.douban\.com/) >= 0 && PlanetDP[0].douban == 1 ) //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    {
	    const html = () => {
		   var h = '';
		   for( var i = 0, len = PlanetDP.length; i < len; i++ ) {
		    	var p = PlanetDP[i];
                if ( p.douban == 1 ) {
                    h += '<a target="_blank" href="' + url( p.url ) + '" class="colbutt" style="flex: 1.5; letter-spacing: 0; font: 10px; margin-right: 0; color: #000;"><span style="padding-left: 9px; font: normal 11px sans-serif; line-height: 20px;">' + p.name + '</span></a>';
                }
		    }
		    return '<br><div style="display: flex; width: 135px; margin-right: 0px;"><a target="_blank" href="' + imdbLink + '" class="colbutt" style="flex: 1; letter-spacing: 0; color: #000;"><span style="padding-left: 9px; font: normal 11px sans-serif; line-height: 20px;">IMDB</span></a>' + h + '</div>';
	    };

        // Vars
        imdbButton = document.querySelector( '[href*="imdb.com/title/tt"]' );
        imdbLink = imdbButton.href;
        ttimdbId = imdbLink.substr( imdbLink.indexOf('title')+6, 9);

        // Areas
        titleArea = document.querySelector( '[id="mainpic"]' );

        // Some CSS
        titleArea.style.width = "135px";
        var seasonInfo = document.querySelector( '[id="season"] > [selected="selected"]' );
        if (seasonInfo == null || seasonInfo.textContent == "1") {
			titleArea.insertAdjacentHTML( "beforeend", html() );
		}
    }


    else if (pageUrl.search(/amazon\.com\/s\?i\=instant\-video/) >= 0 && PlanetDP[0].amazon_list == 1 ) //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    {
	    const html = () => {
			var h = '';
			for( var i = 0, len = PlanetDP.length; i < len; i++ ) {
				var p = PlanetDP[i];
				if ( p.amazon_list == 1 ) {
					h += '<span id="648html" class="a-size-base a-color-secondary" dir="auto"> | </span><span id="648html" class="a-letter-space"></span><a id="648html" dir="auto" target="_blank" href="' + url( p.url_title ) + '">' + p.name + '</a>';
				}
			}
			return h;
		};

		waitForKeyElements('[data-cel-widget="search_result_15"]', function() {
			// Work on Each Link
			var titles = document.querySelectorAll( '.s-result-item h2' );
			for ( x = 0; x < titles.length; x++ )
			{
				// Vars
				title = titleEdit( titles[x].textContent.trim() );
				year = $($(titles[x]).next('div')).text().replace(/^(\d{4}).+/,"$1");
				if (title.search(/season/i) >= 0) {
					year = '';
					title = titleEdit( title.replace(/season.+/i, "").replace(/ - | – /,"").trim() );
				}

				// Areas
				$(titles[x]).next('div').append(html());
			}
		});
    }


    function advencedScriptAction( f_className, f_scriptSelector ) {
        GM_addStyle( '.' + f_className + ' {}' );
        if ( document.querySelector( f_scriptSelector ) != null ) { GM_addStyle( '.' + f_className + ' {display:none!important}' ); }
        waitForKeyElements( f_scriptSelector, function() {GM_addStyle( '.' + f_className + ' {display:none!important}' );} );
    }

    function url( site ) {
        if ( site.indexOf( "%ttimdbId%" ) >= 0) {site = site.replace( /%ttimdbId%/, ttimdbId );}
        if ( site.indexOf( "%title%" ) >= 0) {site = site.replace( /%title%/, title );}
        if ( site.indexOf( "%year%" ) >= 0) {site = site.replace( /%year%/, year );}

		return site;
    }


	function getFirstItem(input, key, value) {
		for (var i = 0; i < input.length; i++) {
			var obj = input[i];
			if(obj[key] == value)
				return i;
		}
		return null;
	}

    function titleEdit( e_title ) {
        e_title = e_title
            .replace( ":", " " )
            .replace( "-", " " )
            .replace("&amp;","&") //replace & with code
            .replace("&nbsp;","") //delete nobreak space
            .replace(/[\/\\#+()$~%"*?<>{}]/g, " ") //remove bad chars
            .replace( /\s{2,}/g, " " )
            .trim()
        ;
        return e_title;
    }

    function waitForKeyElements (
        selectorTxt,    /* Required: The jQuery selector string that
                            specifies the desired element(s).
                        */
        actionFunction, /* Required: The code to run when elements are
                            found. It is passed a jNode to the matched
                            element.
                        */
        bWaitOnce,      /* Optional: If false, will continue to scan for
                            new elements even after the first match is
                            found.
                        */
        iframeSelector  /* Optional: If set, identifies the iframe to
                            search.
                        */
    ) {
        var targetNodes, btargetsFound;

        if (typeof iframeSelector == "undefined")
            targetNodes     = $(selectorTxt);
        else
            targetNodes     = $(iframeSelector).contents ()
                                               .find (selectorTxt);

        if (targetNodes  &&  targetNodes.length > 0) {
            btargetsFound   = true;
            /*--- Found target node(s).  Go through each and act if they
                are new.
            */
            targetNodes.each ( function () {
                var jThis        = $(this);
                var alreadyFound = jThis.data ('alreadyFound')  ||  false;

                if (!alreadyFound) {
                    //--- Call the payload function.
                    var cancelFound     = actionFunction (jThis);
                    if (cancelFound)
                        btargetsFound   = false;
                    else
                        jThis.data ('alreadyFound', true);
                }
            } );
        }
        else {
            btargetsFound   = false;
        }

        //--- Get the timer-control variable for this selector.
        var controlObj      = waitForKeyElements.controlObj  ||  {};
        var controlKey      = selectorTxt.replace (/[^\w]/g, "_");
        var timeControl     = controlObj [controlKey];

        //--- Now set or clear the timer as appropriate.
        if (btargetsFound  &&  bWaitOnce  &&  timeControl) {
            //--- The only condition where we need to clear the timer.
            clearInterval (timeControl);
            delete controlObj [controlKey];
        }
        else {
            //--- Set a timer, if needed.
            if ( ! timeControl) {
                timeControl = setInterval ( function () {
                        waitForKeyElements (    selectorTxt,
                                                actionFunction,
                                                bWaitOnce,
                                                iframeSelector
                                            );
                    },
                    300
                );
                controlObj [controlKey] = timeControl;
            }
        }
        waitForKeyElements.controlObj   = controlObj;
    }

})();