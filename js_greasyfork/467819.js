// ==UserScript==
// @name         LZT Giveaways Only
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Данное расширение удаляет все разделы кроме Халявы
// @author       ChatGPT , aff
// @match        *https://zelenka.guru/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/467819/LZT%20Giveaways%20Only.user.js
// @updateURL https://update.greasyfork.org/scripts/467819/LZT%20Giveaways%20Only.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var targetElement1 = document.querySelector('body.index .discussionList');
    if (targetElement1) {
        targetElement1.remove();
    }

    var targetElements2 = document.querySelectorAll('.sidebar .section .secondaryContent');
    if (targetElements2) {
        targetElements2.forEach(function(element) {
            element.remove();
        });
    }

    var targetElement3 = document.querySelector('.section.sidebar--footer.sidebarWrapper');
    if (targetElement3) {
        targetElement3.remove();

    }
    var targetElements5 = document.querySelectorAll('.list.node.node105.forum.level_2');
    if (targetElements5) {
        targetElements5.forEach(function(element) {
            element.remove();
        });
    }

    var targetElements6 = document.querySelectorAll('.list.node.node239.forum.level_2');
    if (targetElements6) {
        targetElements6.forEach(function(element) {
            element.remove();
        });
    }
    var targetElements7 = document.querySelectorAll('li.list.node.node104.noLoad.forum.level_2');
    if (targetElements7) {
        targetElements7.forEach(function(element) {
            element.remove();
        });
    }
    var targetElements8 = document.querySelectorAll('li.list.node.node585.forum.level_2');
    if (targetElements8) {
        targetElements8.forEach(function(element) {
            element.remove();
        });
    }
    var targetElements9 = document.querySelectorAll('li.list.node.node421.forum.level_2');
    if (targetElements9) {
        targetElements9.forEach(function(element) {
            element.remove();
        });
    }
    var targetElements10 = document.querySelectorAll('li.list.node.node82.forum.level_2');
    if (targetElements10) {
        targetElements10.forEach(function(element) {
            element.remove();
        });
    }
var targetElements11 = document.querySelectorAll('li.list.node.node974.forum.level_2');
    if (targetElements11) {
        targetElements11.forEach(function(element) {
            element.remove();
        });
    }
    var targetElements12 = document.querySelectorAll('li.list.node.node767.forum.level_2');
    if (targetElements12) {
        targetElements12.forEach(function(element) {
            element.remove();
        });
    }
var targetElements13 = document.querySelectorAll('li.list.node.node13.forum.level_2');
if (targetElements13) {
    targetElements13.forEach(function(element) {
        element.remove();
    });
}

var targetElements14 = document.querySelectorAll('li.list.node.node972.forum.level_2');
if (targetElements14) {
    targetElements14.forEach(function(element) {
        element.remove();
    });
}

var targetElements15 = document.querySelectorAll('li.list.node.node128.forum.level_2');
if (targetElements15) {
    targetElements15.forEach(function(element) {
        element.remove();
    });
}

var targetElements16 = document.querySelectorAll('li.list.node.node967.forum.level_2');
if (targetElements16) {
    targetElements16.forEach(function(element) {
        element.remove();
    });
}
var targetElements17 = document.querySelectorAll('li.list.node.node19.forum.level_2');
if (targetElements17) {
    targetElements17.forEach(function(element) {
        element.remove();
    });
}

var targetElements18 = document.querySelectorAll('li.list.node.node790.forum.level_2');
if (targetElements18) {
    targetElements18.forEach(function(element) {
        element.remove();
    });
}

var targetElements19 = document.querySelectorAll('li.list.node.node914.forum.level_2');
if (targetElements19) {
    targetElements19.forEach(function(element) {
        element.remove();
    });
}

var targetElements20 = document.querySelectorAll('li.list.node.node139.forum.level_2');
if (targetElements20) {
    targetElements20.forEach(function(element) {
        element.remove();
    });
}

var targetElements21 = document.querySelectorAll('li.list.node.node125.forum.level_2');
if (targetElements21) {
    targetElements21.forEach(function(element) {
        element.remove();
    });
}

var targetElements22 = document.querySelectorAll('li.list.node.node760.forum.level_2');
if (targetElements22) {
    targetElements22.forEach(function(element) {
        element.remove();
    });
}

var targetElements23 = document.querySelectorAll('li.list.node.node981.forum.level_2');
if (targetElements23) {
    targetElements23.forEach(function(element) {
        element.remove();
    });
}

var targetElements24 = document.querySelectorAll('li.list.node.node587.forum.level_2');
if (targetElements24) {
    targetElements24.forEach(function(element) {
        element.remove();
    });
}

var targetElements25 = document.querySelectorAll('li.list.node.node435.forum.level_2');
if (targetElements25) {
    targetElements25.forEach(function(element) {
        element.remove();
    });
}

var targetElements26 = document.querySelectorAll('li.list.node.node85.forum.level_2');
if (targetElements26) {
    targetElements26.forEach(function(element) {
        element.remove();
    });
}

var targetElements27 = document.querySelectorAll('li.list.node.node86.forum.level_2');
if (targetElements27) {
    targetElements27.forEach(function(element) {
        element.remove();
    });
}

var targetElements28 = document.querySelectorAll('li.list.node.node88.forum.level_2');
if (targetElements28) {
    targetElements28.forEach(function(element) {
        element.remove();
    });
}

var targetElements29 = document.querySelectorAll('li.list.node.node4.forum.level_2');
if (targetElements29) {
    targetElements29.forEach(function(element) {
        element.remove();
    });
}

var targetElements30 = document.querySelectorAll('li.list.node.node876.forum.level_2');
if (targetElements30) {
    targetElements30.forEach(function(element) {
        element.remove();
    });
}
    var targetElements31 = document.querySelectorAll('li.list.node.createPersonalTabNode.forum.level_2');
    if (targetElements31) {
        targetElements31.forEach(function(element) {
            element.remove();
        });
    }
    var targetElements32 = document.querySelectorAll('li.list.node.personalTabsliv-fotografij.personalTab.forum.level_2');
    if (targetElements32) {
        targetElements32.forEach(function(element) {
            element.remove();
        });
    }
    var targetElements33 = document.querySelectorAll('li.list.node.personalTabrozygryshi.personalTab.forum.level_2');
    if (targetElements33) {
        targetElements33.forEach(function(element) {
            element.remove();
        });
    }
    var targetElements34 = document.querySelectorAll('li.list.node.personalTabofftopik.personalTab.forum.level_2');
    if (targetElements34) {
        targetElements34.forEach(function(element) {
            element.remove();
        });
    }

    var targetElements35 = document.querySelectorAll('li.list.node.personalTabxaljava.personalTab.forum.level_2');
    if (targetElements35) {
        targetElements35.forEach(function(element) {
            element.remove();
        });
    }

    var targetElements36 = document.querySelectorAll('li.list.node.personalTabfave.personalTab.forum.level_2');
    if (targetElements36) {
        targetElements36.forEach(function(element) {
            element.remove();
        });
    }

    var targetElements37 = document.querySelectorAll('li.list.node.personalTabviewedthreads.personalTab.forum.level_2');
    if (targetElements37) {
        targetElements37.forEach(function(element) {
            element.remove();
        });
    }

    var targetElements38 = document.querySelectorAll('li.list.node.personalTabmythreads.personalTab.forum.level_2');
    if (targetElements38) {
        targetElements38.forEach(function(element) {
            element.remove();
        });
    }
    var targetElements39 = document.querySelectorAll('div.categoryNodeInfo.categoryStrip');
    if (targetElements39) {
        targetElements39.forEach(function(element) {
            element.remove();
        });
    }

  var targetElements41 = document.querySelectorAll('ul.generalTabs');
    if (targetElements41) {
        targetElements41.forEach(function(element) {
            element.remove();
        });
    }

var targetElement42 = document.querySelector('div.chat2-button.lztng-co1g7o');
if (targetElement42) {
    targetElement42.remove();
}
    var targetElement = document.querySelector('div.messageInfo > div.messageContent > article > div > div.new-raffle-info.mn-15-0-0');
    if (targetElement) {
        targetElement.parentNode.removeChild(targetElement);
    }

var targetElements43 = document.querySelectorAll('li.node.node897.forum.level-n');
if (targetElements43) {
    targetElements43.forEach(function(element) {
        element.remove();
    });
}

var targetElements44 = document.querySelectorAll('li.node.node851.forum.level-n');
if (targetElements44) {
    targetElements44.forEach(function(element) {
        element.remove();
    });
}

var targetElements45 = document.querySelectorAll('li.node.node840.forum.level-n');
if (targetElements45) {
    targetElements45.forEach(function(element) {
        element.remove();
    });
}

var targetElements46 = document.querySelectorAll('li.node.node762.forum.level-n');
if (targetElements46) {
    targetElements46.forEach(function(element) {
        element.remove();
    });
}

var targetElements47 = document.querySelectorAll('li.node.node848.forum.level-n');
if (targetElements47) {
    targetElements47.forEach(function(element) {
        element.remove();
    });
}

var targetElements48 = document.querySelectorAll('li.node.node566.forum.level-n');
if (targetElements48) {
    targetElements48.forEach(function(element) {
        element.remove();
    });
}

var targetElements49 = document.querySelectorAll('li.node.node849.forum.level-n');
if (targetElements49) {
    targetElements49.forEach(function(element) {
        element.remove();
    });
}

var targetElements50 = document.querySelectorAll('li.node.node21.forum.level-n');
if (targetElements50) {
    targetElements50.forEach(function(element) {
        element.remove();
    });
}

var targetElements51 = document.querySelectorAll('li.node.node444.forum.level-n');
if (targetElements51) {
    targetElements51.forEach(function(element) {
        element.remove();
    });
}

var targetElements52 = document.querySelectorAll('.mainProfileColumn');
if (targetElements52) {
    targetElements52.forEach(function(element) {
        element.remove();
    });
}
var targetElements53 = document.querySelectorAll('.member_notable .mainContent > .section, .online_list .mainContent > .section, .news_feed_page_global .eventList');
if (targetElements53) {
  targetElements53.forEach(function(element) {
    element.remove();
  });
}
var targetElements54 = document.querySelectorAll('.member_notable ul.mn-15-0-0');
if (targetElements54) {
  targetElements54.forEach(function(element) {
    element.remove();
  });
}


 var targetElements58 = document.querySelectorAll('li > a[href="market/user/items"]');
  if (targetElements58) {
    targetElements58.forEach(function(element) {
      element.remove();
    });
  }
 var targetElements59 = document.querySelectorAll('li > a[href="market/user/orders"]');
  if (targetElements59) {
    targetElements59.forEach(function(element) {
      element.remove();
    });
  }
 var targetElements60 = document.querySelectorAll('li > a[href="/forums/?tab=mythreads"]');
  if (targetElements60) {
    targetElements60.forEach(function(element) {
      element.remove();
    });
  }
 var targetElements61 = document.querySelectorAll('li > a[href="/forums?tab=fave"]');
  if (targetElements61) {
    targetElements61.forEach(function(element) {
      element.remove();
    });
  }
 var targetElements62 = document.querySelectorAll('li > a[href="account/personal-details"]');
  if (targetElements62) {
    targetElements62.forEach(function(element) {
      element.remove();
    });
  }
 var targetElements63 = document.querySelectorAll('a.languageSwitcher');
  if (targetElements63) {
    targetElements63.forEach(function(element) {
      element.remove();
    });
  }
 var targetElements64 = document.querySelectorAll('.navLink.NoPopupGadget.ConversationsPopupLink');
  if (targetElements64) {
    targetElements64.forEach(function(element) {
      element.remove();
    });
  }
 var targetElements65 = document.querySelectorAll('.active');
  if (targetElements65) {
    targetElements65.forEach(function(element) {
      element.remove();
    });
  }
 var targetElements66 = document.querySelectorAll('[data-id="nomarket"]');
  if (targetElements66) {
    targetElements66.forEach(function(element) {
      element.remove();
    });
  }
 var targetElements67 = document.querySelectorAll('li > a[href^="/search/search?users="]');
  if (targetElements67) {
    targetElements67.forEach(function(element) {
      element.remove();
    });
  }
 var targetElements68 = document.querySelectorAll('.account-menu-sep');
  if (targetElements68) {
    targetElements68.forEach(function(element) {
      element.remove();
    });
  }
})();

