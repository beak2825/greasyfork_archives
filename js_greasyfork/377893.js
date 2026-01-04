// ==UserScript==
// @name          Mi Router Çeviri
// @description   Mi Router Arayüzünün Türkçeye Çevrilmiş Hali
// @author        eminhaqi
// @include       http://192.168.31.1/*
// @include       http://miwifi.com/*
// @version       0.6
// @icon          http://miwifi.com/favicon.ico
// @namespace https://greasyfork.org/users/248109
// @downloadURL https://update.greasyfork.org/scripts/377893/Mi%20Router%20%C3%87eviri.user.js
// @updateURL https://update.greasyfork.org/scripts/377893/Mi%20Router%20%C3%87eviri.meta.js
// ==/UserScript==

// ==OpenUserJS==
// @author Slava0008
// ==/OpenUserJS==

(function () {

      function findAndReplace(searchText, replacement, searchNode) {
            if (!searchText || typeof replacement === 'undefined') {
                  // Throw error here if you want...
                  return;
            }
            var regex = typeof searchText === 'string' ? new RegExp(searchText, 'g') : searchText,
                  childNodes = (searchNode || document.body).childNodes,
                  cnLength = childNodes.length;
            excludes = 'html,head,style,title,link,meta,script,object,iframe';
            while (cnLength--) {
                  var currentNode = childNodes[cnLength];
                  if (currentNode.nodeType === 1 && (',' + excludes + ',').indexOf(',' + currentNode.nodeName.toLowerCase() + ',') === -1) {
                        arguments.callee(searchText, replacement, currentNode);
                  }
                  if (currentNode.nodeType !== 3 || !regex.test(currentNode.data) ) {
                        continue;
                  }
                  var parent = currentNode.parentNode,
                        frag = (function(){
                              var html = currentNode.data.replace(regex, replacement),
                                    wrap = document.createElement('div'),
                                    frag = document.createDocumentFragment();
                              wrap.innerHTML = html;
                              while (wrap.firstChild) {
                                    frag.appendChild(wrap.firstChild);
                              }
                              return frag;
                        })();
                  parent.insertBefore(frag, currentNode);
                  parent.removeChild(currentNode);
            }
      }

      function translate() {
            var ts = {



// Öncelikliler
            "PPTP（Point to Point Tunneling Protocol）和L2TP（Layer 2 Tunneling Protocol）为两种互联网隧道协议，都属于VPN（Virtual Private Network）虚拟专用网络的不同协议分类方式。" : "PPTP ve L2TP protokolleri desteklenir.",
            "3.服务器地址可以是域名或IP地址，具体由服务商提供。" : "3. Sunucu adresi, VPN sağlayıcısı tarafından sağlanan bir alan adı veya IP adresi olabilir.",
            "2.如果不清楚VPN协议类型，可以选择自动。" : "2. Protokol türünü bilmiyorsanız otomatik seçim yapabilirsiniz.",
            "1.VPN用户名、密码、服务器地址、协议类型等信息需要向VPN服务商获取。" : "1. Kullanıcı adı, şifre, sunucu adresi, protokol tipi bilgileri VPN sağlayıcınızdan temin edilmelidir.",
            "2.将信息添加到服务中，并启用该VPN服务" : "2. Bilgileri kaydedin ve VPN bağlantısını etkinleştirin.",
            "1.首先需要在VPN服务商官网上注册账号，获得用户名、密码、服务器地址、协议类型等信息。" : "1. Kullanıcı adı, şifre, sunucu adresi ve protokol türü gibi bilgileri almak için VPN sağlayıcınızın web sitesine gidiniz.",
            "如何设置VPN" : "VPN bağlantısı nasıl ayarlanır?",
            "VPN属于远程访问技术，应用举例：出差员工在外地通过VPN服务访问企业内部网络。" : "Genel bir ağ üzerinden özel kaynaklara güvenli biçimde erişmek amacıyla VPN kullanılır.",
            "路由器重启需要等待十几秒或更多时间，重启过程中将会断开网络连接，稍后将自动重新连接网络。" : "Routerın yeniden başlatılması yaklaşık 10 saniye sürecektir. Yeniden başlatma sırasında ağ bağlantısı kesilecek, daha sonra otomatik olarak yeniden bağlanacaktır.",
            "重启路由器" : "Yeniden Başlat",
            "你的浏览器禁止了Javascript功能，会造成无法使用系统进行路由器管理，请开启。" : "Tarayıcınızda Javascript devre dışı bırakılmıştır, router arayüzüne girişi yapmak için lütfen etkinleştiriniz.",
            "小米中继器" : "Menzil Güçlendirici",
            "小米路由器网络拓扑图" : "Ağ Haritası",
            "设置成功正在重启，需要30秒请等待..." : "Kablosuz ağlar yeniden başlatılıyor, yaklaşık 30 saniye sürecektir, lütfen bekleyiniz...",
            "修改 Wi-Fi 设置" : "Kablosuz Ayarları",
            "修改Wi-Fi设置" : "Kablosuz Ayarları",
            "该操作将重启 Wi-Fi 并导致 Wi-Fi 下的所有设备失去连接，是否确认修改？" : "Bu, kablosuz ağları yeniden başlatır, kablosuz ağlara bağlı tüm cihazların bağlantılarının kopmasına neden olur. Değişiklikleri onaylamak istediğinize emin misiniz?",
            "你手工选择的当前信道有可能造成部分机型较旧的设备无法连接" : "Seçtiğiniz kanal, bazı eski model cihazların bağlanamamasına neden olabilir.",
            "Пароль错误":"Geçersiz şifre",
            "升级过程大约需要5-8分钟，路由器指示灯重新变蓝后，可以通过miwifi.com进入管理后台" : "Güncelleme işlemi yaklaşık 5-8 dakika arası sürecektir: router göstergesi mavi renge döndükten sonra, yönetim arayüzüne miwifi.com adresinden bağlanabilirsiniz.",
            "还未添加服务地址" : "Web Adresi eklenmedi",
            "还未添加设备" : "Cihaz eklenmedi",
            "主机名称为从运营商申请的域名" : "Ana bilgisayar adı, taşıyıcıdan istenen etki alanı adıdır",
            "2. 开启DDNS服务，添加服务，输入前一步获取的信息，保存并启用该服务。" : "2. DDNS servisini başlatın, servisi ekleyin, önceki adımdakı bilgileri girin, servisi kaydedin ve etkinleştirin.",
            "无限速阈值，请先进行限速设置" : "Sınırlandırmamış hız, lütfen önce hız limiti ayarlayınız.",
            "正在设置中，请稍候..." : "Ayarlanıyor, lütfen bekleyiniz...",
            "请不要关闭浏览器或断开路由器" : "Lütfen internet tarayıcınızı kapatmayın ve Mi Router'ın bağlantısını kesmeyin.",
            "请输入路由器管理密码" : "Şifre",
            "小米路由器的管理后台IP为" : "Yönetim Paneli IP Adresi",
            "当前小米路由器的IP地址为" : "Yönetim Paneli IP Adresi",
            "用miwifi.com也可以访问路由器管理页面" : "Yönetim paneli sayfasına miwifi.com ile de erişebilirsiniz." ,
            "恭喜，小米路由器一键有线中继模式设置成功！" : "Tebrikler, Access Point (modeme kablolu bağlı) modu başarıyla ayarlandı.",
            "恭喜，小米路由器切换为普通路由器工作模式成功！" : "Tebrikler, Router (yeni bir kablosuz ağ oluşturun) modu başarıyla ayarlandı. ",
            "恭喜，小米路由器一键中继设置成功！" : "Tebrikler, Access Point (modeme kablosuz bağlı) modu başarıyla ayarlandı.",
            "当前无线网络名称为" : "Geçerli kablosuz ağın adı",
            "新建的有线中继无线网络名称为" : "Yeni oluşturulan kablosuz ağların adı",
            "当前工作模式切换为普通路由器会恢复为之前路由器的所有设置" : "Mevcut çalışma modu Router moduna değiştirildiğinde sistem Router'ın önceki tüm ayarlarına geri döner.",
            "当前工作模式只能切换到普通路由器模式" : "Mevcut çalışma modundan sadece Router moduna geçilebilir.",
            "是否确定切换路由器的工作模式？" : "Router'ın çalışma modunu değiştirmek istediğinize emin misiniz?",
            "中继状态" : "Durum",
            "请确保小米路由器的WAN口与旧路由器通过网线连接" : "Bu modda, Mi Router modeme bir Ethernet kablosu üzerinden bağlanır ve mevcut ağınızın kablosuz kapsama alanını genişletir.",
            "旧路由器与小米路由处于同一局域网中，可以互访" : "Lütfen Mi Router'ın WAN bağlantı noktasından modeme bağlı olduğundan emin olun.",
            "中继模式下部分功能和插件将被屏蔽" : " Bazı işlevler bu modda çalışmayacaktır.",
            "频段带宽" : "Kanal Genişliği",
            "手工输入网络名称" : "Ağ Adını Manuel Girin",
            "网络名称" : "Ad",
            "输入密码" : "Şifre",
            "请确认主路由器和中继路由器的Wi-Fi均已开启。" : "Birincil routerin ve bu routerın kablosuz ağının açık olduğundan emin olun.",
            "当前未有5G连网设备" : "5G ağına bağlı cihaz yok",
            "UPnP设备列表" : "UPnP Servis Listesi",
            "UPnP状态" : "UPnP",
            "DMZ状态" : "Durum",
            "应用名称" : "Uygulama Adı",
            "端口转发开启了，不可以设置DMZ" : "Port yönlendirme etkin, DMZ açılamaz",
            "开启DMZ功能可以将内网某一个设备的IP映射到外网，方便从外网访问到该设备。" : "DMZ (Korunmasız Bölge) host özelliği, video konferans veya İnternet oyunları gibi özel bir amaca hizmet eden bir servis için yerel bir sunucuyu İnternet'e savunmasız bir şekilde bağlamanıza olanak tanır. Aslında, DMZ fonksiyonu LAN'daki bir bilgisayara tüm portları açmayı sağlar.",
            "通过MAC地址添加设备" : "MAC Adresine Göre Bir Cihaz Ekle",
            "取消连接" : "Bağlantıyı İptal Et",
            "请选择需要使用VPN的设备" : "VPN Kullanmasını İstediğiniz Cihazları Seçiniz",
            "小米服务走VPN" : "Uzaktan Erişim",
            "当你需要通过VPN使用外网时，可以开启此功能保证小米路由器APP远程服务可用，其他情况下关闭此功能" : "VPN üzerinden internet kullanımında, Mi WiFi uygulaması ile modem arayüzüne uzaktan erişim sağlanabildiğine emin olmak için bu işlevi etkinleştirebilirsiniz, diğer durumlarda bu işlevi devre dışı bırakın.",
            "开启该功能后，需要您重新连接VPN方可生效，且智能分流功能将关闭。若开启后发现路由器App远程访问出现异常，请您关闭。是否确认开启？" : "Bu ayar VPN yeniden bağlandıktan sonra geçerli olacaktır ve 'VPN Bağlantısı Filtreleme' özelliği devre dışı bırakılacaktır. Router'a uzaktan erişimin anormal olduğu tespit edilirse, lütfen kapatın. Açmak istediğinize emin misiniz?",
            "通过MAC地址添加要使用VPN的设备" : "VPN Kullanmasını İstediğiniz Cihazı Ekleyiniz",
            "请输入设备的MAC地址" : "Cihazın MAC Adresi",
            "按服务地址分流" : "Alan Adına Göre",
            "请输入地址" : "Lütfen web adresini giriniz",
            "添加要使用VPN的服务地址" : "VPN'i kullanmak için web adresi giriniz",
            "从设备列表添加设备" : "Cihaz Listesinden Cihaz Ekle",
            "通过MAC地址添加" : "MAC Adresine Göre Cihaz Ekle",
            "智能VPN分流" : "VPN Bağlantısı Filtreleme",
            "按设备分流" : "Cihaza Göre",
            "可以通过添加设备来限定哪些设备可以使用VPN流量" : "Listeye eklenen cihazlar internet erişimini VPN üzerinden sağlar. ",
            "可以通过添加服务地址来限定哪些服务流量会经过VPN" : "Listeye eklenen web sitelerine internet erişimi VPN üzerinden sağlanır. ",
            "添加服务地址" : "Web Adresi Ekle",
            "重新连接vpn后该设置将生效，同时" : "Bu ayar VPN yeniden bağlandıktan sonra geçerli olacaktır ve ",
            "小米服务走vpn功能" : "Uzaktan Erişim",
            "将关闭" : " özelliği kapatılıcaktır.",
            "开机自动连接" : "Yeniden başlatmada otomatik bağlan",
            "协议类型" : "Protokol Türü",
            "内部IP地址" : "Dahili IP adresi",
            "添加规则" : "Kural Ekle",
            "端口转发规则列表" : "Port Yönlendirme",
            "服务提供商及主机名称" : "Servis Sağlayıcı ve Sunucu Bilgisi",
            "小时" : "s ",
            "分钟" : "Dakika",
            "主机名称" : "Etki Alanı",
            "还没有服务添加进来" : "Hiçbir servis eklenmedi",
            "添加服务" : "Servis Ekle",
            "1. 通过DDNS服务商获得域名及账号密码信息；" : "1. DDNS servis sağlayıcısından alan adı ve hesap bilgilerini alın;",
            "可以通过内置的DDNS运营商去该运营商官网去注册账号及申请域名；" : "Bir hesap açmak ve yerleşik DDNS operatörü aracılığıyla bir alan adı için başvuru yapmak için operatörün resmi web sitesine gidebilirsiniz.",
            "用户名和密码为注册该运营商的用户名与密码" : "Kullanıcı adı ve şifre, taşıyıcıyı kaydetmek için kullanıcı adı ve şifredir",
            "强制检查为WAN口IP的检查时间，如无特殊需求，建议使用默认配置；" : "WAN portu IP'nin kontrol süresini kontrol edin. Özel bir gereksinim yoksa, varsayılan konfigürasyonun kullanılması önerilir.",
            "强制更新为域名与IP强制更新的时间，如无特殊需求，建议使用默认配置；" : "Etki alanı adı ve IP'nin güncellenmeye zorlandığı zamana kadar zorla güncelleme. Özel bir gereksinim yoksa, varsayılan konfigürasyonun kullanılması önerilir.",
            "只能同时开启一个DDNS服务。" : "Aynı anda sadece bir DDNS servisi başlatılabilir.",
            "确认要解除选中项目的绑定关系？": "Seçilen öğenin bağlayıcı ilişkisini onayladınız mı?",
            "你确定要解除此项绑定？": "Bunu kaldırmak istediğinize emin misin?",
            "确定要删除这项数据吗" : "Bu verileri silmek istediğinize emin misiniz?",
            "已绑定的设备列表" : "Bağlı Cihazların Listesi",
            "路由器自身上传下载限速" : "Router Hız Sınırı",
            "上传限速" : "Yükleme Hızı Sınırı",
            "下载限速" : "İndirme Hızı Sınırı",
            "最高上传速度" : "Maksimum Yükleme Hızı",
            "最高下载速度" : "Maksimum İndirme Hızı",
            "上传速度" : "Yükleme Hızı",
            "下载速度" : "İndirme Hızı",
            "家庭WiFi限速" : "Aygıt Önceliği",
            "优先保证浏览网页的网速，大图秒打开" : "Web sayfalarında gezinmeye öncelik verilir",
            "系统根据设备需要自动调配网速" : "Sistem, cihazın ihtiyacına göre ağ hızını otomatik olarak ayarlar.",
            "根据应用优先级分配网速" : "Uygulama Önceliği",
            "自动模式" : "Otomatik",
            "QoS智能分配" : "QoS",
            "当前QoS服务暂未开启" : "Mevcut QoS servisi açık değil.",
            "当外网下载带宽超过50Mbps时，建议无需开启QoS功能" : "İndirme hızı 50 Mbps'yi aştığında, QoS işlevini etkinleştirmemeniz önerilir.",
            "DHCP静态IP分配" : "Statik DHCP",
            "从备份恢复路由器设置" : "Router Ayarlarını Geri Yükle",
            "开始恢复" : "Geri Yüklemeyi Başlat",
            "路由器名和管理密码" : "Router Adı ve Oturum Açma Şifresi",
            "上网设置" : "İnternet Ayarları ",
            "(拨号方式和宽带帐号密码等)" : "Geniş Bant Hesap Şifreleri vb.",
            "wifi设置" : "Kablosuz Ayarları ",
            "(wifi名称和密码等)" : "Kablosuz Adı ve Şifre vb.",
            "DHCP服务和局域网IP设置" : "DHCP Servisi ve LAN IP Ayarları",
            "备份与恢复" : "Yedekleme ve Geri Yükleme",
            "备份路由器的配置，重新刷机或重置路由器后可以用来恢复。" : "Router'ınızın bir önceki konfigürasyonuna geri yükleme ihtiyacınız olması durumu için mevcut konfigürasyonun yedeğini almanızı öneririz.",
            "直接恢复出厂设置" : "Fabrika Ayarlarına Geri Yükle",
            "恢复出厂设置操作会抹掉当前路由器的所有设置，建议您先进行配置备份再恢复出厂设置。" : "Fabrika ayarlarını geri yükleme işlemi, mevcut konfigürasyonunuzu ve ayarlarınızı kaldıracak, varsayılan fabrika ayarlarına döndürecektir. Örneğin; tüm kablosuz ağlar ve tüm ağ bilgileri silinecektir. Fabrika ayarlarına sıfırlamadan önce yedek almanız önerilir.",
            "恢复出厂设置" : "Fabrika Ayarlarına Geri Yükle",
            "立即恢复" : "Geri Yükle",
            "上传日志" : "Sistem Günlüğü",
            "日志上传成功" : "Günlük dosyası kaydetme başarılı",
            "路由器正常工作情况下建议使用系统升级检测进行升级，在当系统无法升级或需要降级到前一版本时使用手动上传rom包进行升级。" : "Router normal olarak çalıştığında güncellemeleri otomatik olarak yapmanız önerilir. Sistem güncellenemediğinde ya da önceki bir sürüme indirme gerektiğinde manuel olarak yükleme tavsiye edilir.",
            "局域网IP地址" : "IP Adresi",
            "MAC地址白名单" : "MAC Adresi Listesi",
            "管理后台访问控制" : "Yerel Yönetici Kısıtlaması",
            "开启白名单功能后，将只允许名单中的设备访问管理后台，每次开启会将本机自动添加至白名单。" : "Bu özellik, yerel aygıtların Router'ı yönetmesini düzenler. Bu özellik açıldığında yalnızca listedeki cihazların Router'ı yönetmesine izin verilir. Her zaman bağlı cihaz otomatik olarak beyaz listeye eklenir.",
            "修改管理密码" : "Oturum Açma Şifresini Değiştir",
            "原密码" : "Güncel Şifre",
            "新密码" : "Yeni Şifre",
            "确认密码" : "Şifreyi Yeniden Yazın",
            "保存并生效" : "Kaydet ve başlat",
            "设备名称" : "Cihaz Adı",
            "启用与智能网关的无线配置同步" : "Kablosuz Yapılandırma Senkronizasyonu",
            "启用此功能后，小米路由器将自动从运营商家庭网关同步Wi-Fi设置" : "Bu özellik etkinleştirildiğinde, Mi Router, kablosuz ayarlarını modemden otomatik olarak senkronize eder.",
            "默认" : "Varsayılan ",
            "经过检测，建议使用DHCP方式" : "DHCP kullanılması önerilir ",
            "(系统自动分配IP地址)" : "sistem otomatik olarak bir IP adresi atar",
            "确认信息" : "Onay Mesajı",
            "如果您已开启访客wifi，切换为无线中继模式后，访客wifi将会关闭" : "Konuk wifi özelliğini açtıysanız, bu moda geçtikten sonra konuk wifi özelliği kapatılacaktır.",
            "如果您已开启访客wifi，切换为有线中继模式后，访客wifi将会关闭" : "Konuk wifi özelliğini açtıysanız, bu moda geçtikten sonra konuk wifi özelliği kapatılacaktır.",
            "当前使用的MAC地址是" : "Şu an kullanılan MAC adresi: ",
            "当前管理终端的MAC地址，可以手动更改为其他MAC地址" : "Mevcut cihazın MAC adresi manuel olarak başka bir MAC adresleriyle değiştirilebilir.",
            "MAC地址格式有误，如ab:cd:ef:11:22:33" : "MAC adresi formatı yanlış, ab: cd: ef: 11: 22: 33 gibi olmalıdır.",
            "MAC地址克隆" : "MAC Adresi Klonlama",
            "输入值太小，最小允许576。" : "Geçersiz değer, lütfen 576 ve 1492 değeri aralığında bir sayı giriniz.",
            "自动配置DNS" : "DNS'yi otomatik olarak yapılandır",
            "自动配置" : "Otomatik Yapılandırma",
            "IP地址由4个 0~255 之间的数字组成，数字之间用点区隔" : "IP adresi 0 ile 255 arasında dört numaradan oluşur. Numaralar noktalarla ayrılmıştır.",
            "开启后，2.4G和5G会使用同一名称，路由器会自动为终端选择最佳WiFi网络，如离路由器较近，会切换至5G网络，反之会切换至2.4G网络。但由于终端设备存在差异，可能存在：自动切换信号源时网络会短暂中断，甚至频繁掉线等问题。" : "Bu özellik açıldıktan sonra 2.4G ve 5G kablosuz ağları aynı adı kullanacak ve router cihaz için en iyi kablosuz ağı otomatik olarak seçecektir. Cihaz routera yakınsa 5G ağına, uzaksa 2.4G ağına geçecektir. Bu özellikle birlikte bazı cihazlarda sinyal kaynağı otomatik olarak değiştirildiğinden ağın kısa bir süre kesilmesi veya kopma gibi bazı sorunlar yaşanabilir.",
            "开启相册备份后，回家手机上的照片将自动备份到小米路由器上，无需担心手机空间存储不足或数据丢失" : "Yetersiz depolama alanı veya veri kaybı konusunda endişelenmeyin. Albüm yedeklemesini açtıktan sonra telefonunuzdaki fotoğraflar otomatik olarak USB depolama cihazına yedeklenir",
            "安装PC和Mac客户端，可以轻松访问小米路由器硬盘" : "PC veya MAC istemcisini kurarak routera bağladığınız sabit diske kolayca erişebilirsiniz",
            "未检测到存储设备，请将USB存储设备连接到你的小米路由器" : "Depolama cihazı algılanmadı, lütfen USB depolama cihazını Xiaomi routerınıza bağlayın",
            "如何玩转小米路由存储" : "Neler yapılır?",
            "MiWiFi 开发版" : "Geliştirici Sürümü",
            "MiWiFi 稳定版" : "Kararlı Sürüm",
            "稳定版" : "Kararlı Sürüm",
            "总下载量:" : "İndirme:",
            "总上传量:" : "Yükleme:",
            "最快下载:" : "Ölçülen Maksimum İndirme Hızı:",
            "立即下载客户端" : "İstemciyi indirin",
            "文件下载" : "Dosya indirin",
            "通过手机、电脑客户端，你可以随时随地添加下载任务" : "Cep telefonuz veya bilgisayarınız ile indirme görevlerini istediğiniz zaman istediğiniz yerden oluşturabilirsiniz",


// Giriş Sayfası
            "欢迎使用小米路由器" : "Router'a hoş geldiniz",
            "欢迎使用Mi Wi-Fi":"Mi Wi-Fi'a Hoş Geldiniz",
            "下载小米WiFi APP管理路由器":"Mi Wifi Uygulamasını İndirin",
            "使用小米WiFi APP免除记密码烦恼":"Şifresiz giriş yapmak için Xiaomi Wifi uygulamasını kullanın",
            "请输入路由器管理密码":"Lütfen router yönetim şifresini girin",


// Alt Panel

            "系统版本:": "Yazılım sürümü:",
            "开发版" : "Geliştirme Sürümü",
            "2015" : "2019 translated by eminhaqi | ",
            "小米路由器" : "Mi Router ",


// Menüler

            "路由状态" : "Yönlendirme",
            "存储状态" : "Depolama",
            "常用设置" : "Temel Ayarlar",
            "高级设置" : "Gelişmiş Ayarlar",
            "(家)" : "Ev",
            "修改路由器名称" : "Router Adı",
            "系统升级" : "Güncelleştirme",
            "下载客户端" : "Uygulamalar",
            "重启" : "Yeniden Başlat",
            "查看完整网络" : "Ağ Haritası",
            "注销" : "Çıkış",
            "路由器名称" : "Router adı",
            "位置" : "Konum",
            "保存" : "Kaydet",
            "台" : "Cihaz",


// Ana Sayfa
            "互联网" : "İnternet",
            "路由器信息" : "Router Hakkında",
            "路由器型号" : "Model",
            "系统ROM版本" : "Firmware sürümü",
            "MAC地址" : "MAC Adresi",
            "实时网络状态" : "Ağ Trafiği",
            "实时下行流量:" : "Anlık İndirme:",
            "实时上行流量:" : "Anlık Yükleme:",
            "终端流量统计" : "Cihaz Trafiği",
            "当前终端:" : "İstemciler:",
            "当前CPU状态" : "CPU Durumu",
            "当前CPU负载:" : "CPU Yükü:",
            "CPU核心数:" : "CPU Çekirdek Sayısı:",
            "核心频率:" : "Çekirdek Frekansı:",
            "当前内存状态" : "Bellek Durumu",
            "当前内存占用:" : "Bellek Kullanımı:",
            "内存容量:" : "Kapasite:",
            "内存类型:" : "Tip:",
            "内存频率:" : "Frekans:",
            "累计终端:" : "Kayıtlı İstemciler:",


// Ana Sayfa - Bağlı Cihazlar

            "小米Wi-Fi放大器" : "Mi Wifi Pro Amplifikatör",
            "终端设备" : "İstemciler",
            "2.4G连网设备" : "2.4G ağ bağlantısı",
            "5G连网设备" : "5G ağ bağlantısı",
            "已连接:" : "Süre:",
            "分" : "d ",
            "秒" : "s ",
            "天" : "g ",
            "小" : "s ",
            "本机" : "Cihazım",
            "IP地址:" : "IP Adresi:",
            "MAC地址:" : "Mac Adresi:",
            "访问外网" : "Erişim İzni",
            "5G Wi-Fi是运行在5GHz以上的高频段的独立Wi-Fi比较2.4G Wi-Fi速度更快更稳定, 适合电视、盒子包括距离路由器较近的设备" : "5G kablosuz ağ bağlantısı, 5GHz veya daha yüksek frekanslarda çalışan bir kablosuz ağdır.",

// Ana Sayfa - İnternet

            "手工设置外网带宽" : "Ağ Hızı",
            "外网状态" : "Ağ Durumu",
            "连接类型" : "Bağlantı Tipi",
            "IP地址" : "IP Adresi",
            "网关地址" : "Ağ Geçidi Adresi",
            "外网带宽" : "Ağ Hızı",
            "下载带宽" : "İndirme",
            "上传带宽" : "Yükleme",
            "开始测速" : "Hız Testi Başlat",
            "手工设置" : "Elle Ayarla",
            "点击测速" : "Hız",
            "网络速度" : "Ağ Hızı",
            "测速不准？" : "Hız ölçümüne izin verilmiyor mu? ",
            "正在测速..." : "Hız ölçülüyor...",
            "完成" : "Kaydet",
            "重新测速" : "Testi Tekrarla",
            "带宽" : "Ağ Hızı ",
            "下载" : "İndirme",
            "上传" : "Yükleme",
            "确定" : "Kaydet",

// Depolama

            "文件共享与访问" : "Dosya paylaşımı ve erişim",
            "安装手机APP，你可以用更酷的方式浏览照片和影片" : "Mobil uygulamayı yükleyerek fotoğraflarınıza ve videolarınıza erişebilirsiniz",
            "文件备份" : "Dosya yedekleme",
            "存储" : " Hafıza",
            "已用" : "Kullanılan ",
            "总容量" : "Toplam ",
            "文件系统 :" : "Dosya Sistemi:",
            "硬盘接口 :" : "Sabit Disk Arayüzü:",



// Temel Ayarlar - Menüler

            "Wi-Fi设置" : "Kablosuz",
            "上网设置" : "İnternet",
            "安全中心" : "Güvenlik",
            "局域网设置" : "LAN",
            "系统状态" : "Sistem",


// Temel Ayarlar - Wifi (%100)
            "仅支持WPA加密方式的设备将无法连接" : "Yalnızca WPA şifrelemesini destekleyen cihazlar bağlanamaz.",
            "Wi-Fi双频合一" : "Akıllı Kablosuz",
            "开关" : "Durum",
            "开启" : "Açık",
            "关闭" : "Kapalı",
            "名称" : "Ad",
            "隐藏网络不被发现" : "SSID'yi Gizle",
            "强加密" : "WPA2 Kişisel ",
            "(WPA/WPA2个人版)": "Önerilen",
            "(WPA2个人版)" :"AES",
            "混合加密" : "WPA/WPA2-Kişisel ",
            "无加密" : "Güvenlik Yok ",
            "允许所有人连接" : "Açık Ağ",
            "加密方式" : "Güvenlik",
            "自动" : "Otomatik",
            "无线信道" : "Kanal",
            "密码" : "Şifre",
            "信号强度" : "İletim Gücü",
            "穿墙" : "Yüksek",
            "标准" : "Orta",
            "节能" : "Düşük",
            "请至少输入8个字节。" : "Şifre 8 ila 63 karakter veya 64 heksadesimal sayılardan oluşmalıdır.",
            "访客Wi-Fi" : "Misafir Ağı",

 // Temel Ayarlar - İnternet

            "上网信息" : "İnternet Hakkında",
            "子网掩码:" : "Alt Ağ Maskesi:",
            "静态IP" : "Statik IP",
            "上网方式" : "Bağlantı Tipi",
            "手动配置DNS" : "DNS'yi manuel olarak yapılandır",
            "必填" : "Zorunlu",
            "应用" : "Uygula",
            "取消" : "İptal Et",
            "账号" : "Kullanıcı Adı",
            "手动配置" : "Manuel Yapılandırma",
            "字节（网络正常情况下不建议修改）" : "bayt. (Varsayılan 1480, gerekli olmadıkça değiştirmeyiniz.)",
            "特殊拨号" : "Özel Arama Modu",
            "输入值太大, 最大允许1492。" : "Geçersiz değer, lütfen 576 ve 1492 değeri aralığında bir sayı giriniz.",
            "请输入一个10位正整数。" : "Geçersiz değer, lütfen 576 ve 1492 değeri aralığında bir sayı giriniz.",
            "数字前面好像有多余的" : "Geçersiz değer, lütfen 576 ve 1500 değeri aralığında bir sayı giriniz.",
            "服务名" : "Servis Adı",
            "子网掩码" : "Alt Ağ Maskesi",
            "网关" : "Ağ Geçiti",
            "选填" : "İsteğe Bağlı",
            "WAN口速率" : "WAN Portu",
            "(推荐)" : "Önerilen",
            "速率" : "Hız",
            "克隆" : "Klonla",
            "恢复" : "Sıfırla",
            "提示信息" : "Bilgi Mesajı",
            "设置成功" : "Başarılı",
            "确认" : "Onayla",
            "工作模式切换" : "Çalışma Modu",
            "在路由器工作模式和中继工作模式之间进行切换" : "Mi Router farklı gereksinimleri karşılamak için birkaç çalışma modunu desteklemektedir. Lütfen durumunuza uygun modu seçin.",
            "切换" : "Seç",
            "请手工选择需要的工作模式" : "Lütfen istediğiniz çalışma modunu seçin",
            "普通路由器工作模式（创建一个无线网络）" : "Router (yeni bir kablosuz ağ oluşturun)",
            "无线中继工作模式（扩展现有的无线网络）" : "Access Point (modeme kablosuz bağlı)",
            "有线中继工作模式（扩展现有的网络）" : "Access Point (modeme kablolu bağlı)",
            "有线中继工作模式说明" : "Access Point (modeme kablolu bağlı)",
            "下一步" : "Sonraki Adım",
            "DNS1" : "Birincil DNS",
            "DNS2" : "İkincil DNS",
            "请选择要扩大范围的无线网络" : "Kapsama alanını genişletmek için lütfen bir kablosuz ağ seçin",
            "选择网络" : "Ağ",
            "找不到要中继的网络" : "Ağı bulamıyor musunuz?",
            "一键无线中继" : "Başlat",
            "正在扫描附近的无线网络" : "yakındaki kablosuz ağlar taranıyor...",



 // Temel Ayarlar - Güvenlik

            "无线访问控制" : "Kablosuz Erişim Kontrolü",
            "控制模式:" : "Erişim Modu:",
            "黑名单模式（不允许列表中设备访问）" : "Kara Liste",
            "白名单模式（只允许列表中设备访问）" : "Beyaz Liste",
            "黑名单设备列表" : "Cihaz Listesi",
            "操作" : "",
            "还没有设备添加进来" : "Henüz cihaz eklenmedi",
            "从在线列表添加" : "Bağlı Cihazlardan Ekle",
            "手工添加" : "El İle Ekle",
            "白名单设备列表" : "Cihaz Listesi",
            "设备列表" : "Cihaz Listesi",
            "设备信息" : "Cihaz Bilgileri",
            "连接时长" : "Bağlantı Süresi",
            "添加" : "Ekle",
            "正在查询中..." : "Yükleniyor...",
            "删除" : "Sil",


 // Temel Ayarlar - LAN

            "DHCP服务" : "DHCP Servisi",
            "开始IP" : "İlk IP",
            "结束IP" : "Son IP",
            "租约" : "Süre ",
            "局域网IP" : "",
            "请输入一个4位正整数。" : "Geçersiz değer, lütfen 1 ve 2880 değeri aralığında bir sayı giriniz.",
            "请输入一个4位正整数。" : "Geçersiz değer, lütfen 1 ve 2880 değeri aralığında bir sayı giriniz.",


 // Temel Ayarlar - Sistem

            "升级检测" : "Yazılım Güncelleme",
            "系统版本" : "Firmware Sürümü",
            "当前版本" : "Mevcut Sürüm: ",
            "你的版本是最新的, 无需升级。" : "yazılımınız güncel.",
            "手动升级" : "Yerel Güncelle",
            "请选择固件:" : "Lütfen yazılımı seçin:",
            "文件格式错误, 请重新选择" : "Dosya formatı yanlış, lütfen tekrar seçin",
            "开始升级" : "Güncellemeyi Başlat",
            "处理中..." : "Oluşturuluyor...",
            "正在检测更新, 请稍候..." : "güncellemeler kontrol ediliyor, lütfen bekleyin...",
            "检查失败, 网络繁忙请刷新页面重试。" : "kontrol başarısız oldu, lütfen sayfayı yenileyin ve tekrar deneyin.",
            "提示" : "Dikkat",
            "备份路由器设置" : "Yedekle",
            "新建备份" : "Yeni Yedekleme",
            "可选备份" : "İsteğe Bağlı Yedekleme",
            "无线访问黑白名单" : "Kablosuz erişim kara listesi",
            "开始备份" : "Yedeklemeyi Başlat",
            "请选择备份文件" : "Lütfen bir yedek dosyası seçin",
            "时间设置" : "Zaman Ayarı",
            "更改时区" : "Saat Dilimini Değiştir",
            "更改时间" : "Tarihi Değiştir",
            "年" : "y ",
            "月" : "a ",
            "日" : "g ",
            "当前时间" : "Şu anki zamana dön",
            "时" : "s ",

// Gelişmiş Ayarlar - Menü

            "QoS智能限速" : "QoS - Akıllı Hız Sınırı",
            "端口转发" : "Port Yönlendirme",
            "其他" : "Diğer",

// Gelişmiş Ayarlar - QoS - Akıllı Hız Sınırı
            "最高速度设置" : "Maksimum Hız",
            "限速设置" : "Hızı Ayarla",
            "游戏优先" : "Oyun",
            "网页优先" : "Sörf",
            "视频优先" : "Yayın",
            "优先保证看视频的网速, 高清也流畅" : "Video izlemeye öncelik verilir",
            "优先保证打游戏的网速, 不卡顿不掉线" : "Oyunlara öncelik verilir",
            "当前网速" : "Mevcut Hız",
            "最大速度" : "Maksimum Hız",
            "无限制" : "sınırsız",
            "编辑" : "Düzenle",
            "设置QoS" : "QoS - Hız Ayarla",
            "访客WiFi限速" : "Ziyaretçi WiFi Ağı Hız Sınırı",
            "输入值太大, 最大允许523.52。" : "Girilen değer çok büyük ve izin verilen maksimum değer 523,52'dir.",
            "数字输入格式为" : "Gereken format şöyledir: ",


// Gelişmiş Ayarlar - Statik DHCP

            "没有设置信息" : "Bilgi yok",
            "绑定设备" : "Ciltleme Cihazı",
            "移除" : "Kaldır",
            "增加一项" : "Yeni Cihaz Ekle",
            "一键绑定" : "Tümünü Ekle",
            "解除绑定" : "Kaldır",
            "解绑选中" : "Ayrıştır",


// Gelişmiş Ayarlar - DDNS

            "服务列表:" : "Servis Listesi:",
            "最近更新" : "Son Güncelleme",
            "什么是DDNS？" : "DDNS nedir?",
            "DDNS（Dynamic Domain Name Server）是动态域名服务的缩写。" : "DDNS (Dinamik Etki Alanı Adı Sunucusu), Dinamik Etki Alanı Adı Hizmeti'nin kısaltmasıdır.",
            "目前路由器拨号上网获得的多半都是动态IP, DDNS可以将路由器变化的外网IP和固定的域名绑定, 从而用户可以在外网通过该固定域名来访问路由器。" : "DDNS, değişken IP adresini sabit bir alan adına bağlayarak sabit alan adı üzerinden ağınıza erişmenizi sağlar.",
            "常见问题" : "Sıkça Sorulan Sorular",
            "如何设置DDNS？" : "DDNS nasıl kurulur?",
            "注意事项:" : "Seçenekler:",
            "公云" : "Gongyun",
            "花生壳" : "Oray",
            "服务提供商" : "Sunucu",
            "用户名" : "Kullanıcı Adı",
            "状态检查" : "Durum Kontrolü",
            "未启动无法强制更新" : "Güncelleme için servisi etkinleştiriniz",
            "强制更新" : "Güncelleme Aralığı",
            "已启用" : "Etkin",
            "未启用" : "Devre Dışı",
            "启用" : "Etkinleştir",
            "停用" : "Devre Dışı Bırak",
            "连接错误" : "Bağlantı Hatası",
            "状态" : "Bağlantı",
            "连接正常" : "Normal Bağlantı",
            "连接中..." : "Bağlanıyor...",
            "手动更新" : "Elle Güncelle",
            "更新成功" : "Başarıyla güncellendi",

// Gelişmiş Ayarlar - Port Yönlendirme

            "协议" : "Protokol",
            "外部端口" : "Bitiş Portu",
            "内部端口" : "Başlangıç Portu",
            "未生效" : "Etkin Değil",
            "已生效" : "Etkin",
            "范围转发规则列表" : "Bağlantı Noktası Tetikleyici",


// Gelişmiş Ayarlar - VPN
            "服务器地址" : "Sunucu Adresi",
            "服务器" : "Sunucu",
            "已断开" : "Devre Dışı",
            "断开连接" : "Kapat",
            "当前正在连接的VPN将被断开，重新连接后该设置将生效。" : "VPN bağlantısı kesilecek ve ayarlar VPN yeniden bağlandıktan sonra geçerli olacaktır",
            "已连接" : "Bağlı",
            "连接失败" : "Bağlanamadı",
            "重连" : "Tekrar Bağlan",
            "连接" : "Bağlan",
            "查询中..." : "Sorgulanıyor...",
            "你可以自定义哪些服务或设备会走VPN的流量" : "Hangi servislerin (web sitelerinin) veya cihazların VPN trafiğini kullanacağını özelleştirebilirsiniz.",
            "在线" : "Çevrimiçi",
            "正在拨号..." : "Bağlanıyor...",
            "什么是VPN" : "VPN Nedir?",


 // Gelişmiş Ayarlar - Diğer

            "没有UPnP设备" : "UPnP Cihazı Yok",
            "客户端IP" : "Dahili IP Adresi",


            "正在测速，请等待。" : "Hız Ölçülüyor, lütfen bekleyiniz.",
            "请至少选择一个设备" : "Lütfen en az bir cihaz seçin",

   // Access Point - Kablolu
            "主路由器"  : "Birincil Router",
            "有线中继" : "Kablolu",

   // Yerel Güncellem

            "升级注意" : "Uyarı",
            "当刷回较低版本s , 建议您同s 清除掉用户配置, 以防止版本兼容性引起的异常故障" : "Alt sürümlere geri dönerken, sürüm uyumluluğunun neden olduğu anormallikleri önlemek için kullanıcı yapılandırmasını silmeniz önerilir.",
            "清除当前所有用户配置" : "Mevcut kullanıcı yapılandırmalarını temizle",
            "正在升级中" : "Güncelleniyor",
            "请勿断开路由器电源" : "Router'ı güç kaynağından ayırmayınız",
            "手机扫描二维码安装客户端" :"QR kodu taratınız",

//--------------------------------EKSTRALAR----------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------

            "：":": ",
            "，":", ",
            "；":"; ",
            "小米路由器" : "Mi Router",
            "中继设置" : "Ayarlar",





            };
        for(var t in ts) {
            findAndReplace(t,ts[t]);
        }
        setTimeout(translate, 500);
    }

    setTimeout(translate, 500);

})();
