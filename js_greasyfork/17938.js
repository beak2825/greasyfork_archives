// ==UserScript==
// @name         Platoon Game Türkçe Çeviri
// @namespace    https://greasyfork.org/tr/scripts/17938-platoon-game-turkce-ceviri
// @version      0.9
// @description  Platoon Game için farlo54 tarafından hazırlanmış türkçe çeviri.
// @author       farlo54
// @match        http://www.platoongame.com/*
// @grant        1HYpPbW28PBBeuhaJ9HDrQw7idwFHEosm
// @downloadURL https://update.greasyfork.org/scripts/17938/Platoon%20Game%20T%C3%BCrk%C3%A7e%20%C3%87eviri.user.js
// @updateURL https://update.greasyfork.org/scripts/17938/Platoon%20Game%20T%C3%BCrk%C3%A7e%20%C3%87eviri.meta.js
// ==/UserScript==
/* jshint -W097 */
(function () {
    'use strict';


    /*
        NOTE: 
            You can use \\* to match actual asterisks instead of using it as a wildcard!
            The examples below show a wildcard in use and a regular asterisk replacement.
    */

    var words = {
        ///////////////////////////////////////////////////////
        // Anasayfa
        'Forgot Password' : 'Parolamı unuttum?',
        'Privacy Policy' : 'Gizlilik Politikası',
        'Rules' : 'Kurallar',
        'Disclaimer' : 'Feragat',
        'Guide' : 'Rehber',
        'Contact' : 'İletişim',
        'You Have' : 'Okunmamış',
        'Unread Report' : 'adet rapor var',


        // Sol Menü
        //Avrupa

        //  'Europe' : 'Avrupa',
        '· Territory Management' : '· Bölge Yönetimi',
        '· Construction' : '· Bina',
        '· Production' : '· Üretim',
        '· Research' : '· Araştırma',
        '· War Factory' : '· Savaş Fabrikası',
        '· Unit Management' : '· Birim Yönetimi',
        '· Map' : '· Harita',
        '· Defense' : '· Savunma',
        '· Savunma Systems' : '· Savunma Sistemleri',
        '· Federation' : '· Federasyon',
        '· Tech Tree' : '· Teknoloji Ağacı',
        '· Trade Center' : '· Ticaret Merkezi',
        '· Search' : '· Arama',

        //Kullanıcı Paneli

        'User Panel' : 'Kullanıcı Paneli',
        '· My Transactions' : '· İşlemlerim',
        '· Messages' : '· Mesajlar',
        '· Reports' : '· Raporlar',
        '· Settings' : '· Ayarlar',	
        '· Invite Friend' : '· Arkadaş davet et',
        '· Statistics' : '· İstatistikler',
        '· Guide' : '· Rehber',
        '· FAQ' : '· S.S.S.',
        '· Rules' : '· Kurallar',
        '· Forum' : '· Forum',
        '· Exit' : '· Çıkış',

        // Sol Menü       

        // Bölge Yönetimi

        'Sources' : 'Kaynaklar',
        'Iron' : 'Demir',
        'Gold' : 'Altın',
        'Oil' : 'Yağ',
        'Energy' : 'Enerji',
        'Server Time' : 'Sunucu Saati',
        'Leave Territory' : 'Bölgeyi Terket',
        'Territory Info' : 'Bölge Bilgisi',
        'Territory Size' : 'Bölge Boyutu',
        'Coordinate' : 'Koordinat',
        'Construction' : 'Bina',
        'Research' : 'Araştırma',
        'War Factory' : 'Savaş Fabrikası',
        'Statistics ' : 'İstatistikler',
        'Total Score' : 'Toplam Puan',
        'Total Players' : 'Toplam Oyuncu',
        'All Units' : 'Tüm Birimler',
        'Power Factor' : 'Güç faktörü',
        'Experience' : 'Deneyim',
        'Federation :' : 'Federasyon :',

        // İnsaat Ekranı 

        'Level' : 'Kademe ',
        'Build' : 'İnşa et',
        'Requirements' : 'Gereksinimler',
        'Electricity Power Plant' : 'Elektrik Santrali',
        'Mine' : 'Madeni',
        'Refinery' : 'Rafineri',
        'Science Lab' : 'Bilim Laboratuvarı',
        'Engineering Lab' : 'Mühendislik Laboratuvarı',
        'Radar Tower' : 'Radar Kulesi',
        'War Factory' : 'Savaş Fabrikası',
        'Trade Center' : 'Ticaret Merkezi',
        'Nano-Tech Lab' : 'Nano Teknoloji Laboratuvarı',
        'Geology Center' : 'Jeoloji Merkezi', 
        '/Upgrade to (.*?$)/g' : 'Yükselt $1',
        'Science L.' : 'Bilim Lab.',		 
        'Cellular .' : 'Hücresel İ. Tek.',		 
        'Engineeri.' : 'Mühendislik Lab.',		 
        'Consumption' : 'Enerji Tüketimi',		 
        'Piece' : 'Adet',		 
        'units' : 'adet var',		 		 
        'Defence' : 'Savunma',		 		 

        // İnsaat Ekranı 

        // Üretim Ekranı 

        'Production' : 'Üretim', 
        'Work Capacity' : 'Çalışma Kapasitesi', 
        'Hourly' : 'Saatlik', 
        'Daily' : 'Günlük', 
        'Facility produces saatly constant amount of 20 adet var of iron and 20 adet var of gold' : 'Tesis sabit 20 birim demir ve 20 birim altın üretir', 

        // Üretim Ekranı 

        // Araştırma Ekranı 

        'Development' : 'Gelişme', 
        'You need to build lab' : 'Laboratuvar inşa etmen gerekir.', 
        '/Science L. (.*?$)/g' : 'Bilim Seviyesi ($1)',
        'War Facto.' : 'Savaş Fabrikası',
        'Radar Tow.' : 'Radar Kulesi',
        'Radar Det.' : 'Radar Alg. Tek.',
        'Jet Engin.' : 'Jet Motor Tek.',
        'Fu.' : 'Yakıt Tek.',
        'Tech' : 'Teknolojisi',
        'tech' : 'Teknolojisi',
        'Zırh Tec' : 'Zırh Tek',
        'Hydrogen .' : 'Hidrojen Motor Tek.',
        'Cyber Ele. ' : 'Siber Elektronik Tek. ',

        // Araştırma Ekranı 


        // Savaş Fabrikası Ekranı

        'You need to build war factory' : 'Savaş Fabrikası inşa etmen gerekir.', 
        'Cellular Communication' : 'Hücresel İletişim', 
        'Spy' : 'Casusluk', 
        'Jet Engine' : 'Jet Motor', 
        'Radar Detection' : 'Radar Algılama', 
        'Cyber Electronics' : 'Siber Elektronik', 
        'Hydrogen Engine' : 'Hidrojen Motor', 
        'Fuel' : 'Yakıt', 
        'Diesel Engine' : 'Dizel Motor', 
        'Nuclear Reaction' : 'Nükleer Reaksiyon', 

        // Savaş Fabrikası Ekranı

        // Birim Yönetimi

        'Fleet Management' : 'Filo Yönetimi', 
        'Fleet Movement' : 'Filo Hareketi', 
        'Total' : 'Toplam', 
        'Unit' : 'Birim', 
        'Load Capacity' : 'Yükleme kapasitesi', 
        'Speed' : 'Hız', 
        'Amount' : 'Miktar', 
        'Select' : 'Seç', 
        'Target' : 'Hedef', 
        'Bölge Bilgisirmation' : 'Bölge Bilgisi', 
        'Wreck Demir' : 'Demir Enkazı', 
        'Wreck Altın' : 'Altın Enkazı', 
        'Distance' : 'Mesafe', 
        'Attack' : 'Saldırı', 
        'Resource Transfer' : 'Kaynak Transferi', 
        'Resource transfer and attacks cannot be done between players sharing the same IP address!' : 'Nakliye ve saldırı aynı IP adresini paylaşan oyuncular arasında yapılamaz!', 
        'Armies travel with the slowest unit\'s speed in the army.' : 'Birimler, filo içindeki en yavaş birimin hızı ile hareket eder.', 
        'Zaman remaining for resource transfer' : 'Kaynak transferi için kalan zaman', 
        'Operation Detail' : 'Operasyon Detayları', 
        'Saldırıer Kullanıcı' : 'Saldıran Oyuncu', 
        'Savunmar Kullanıcı' : 'Savunan Oyuncu', 
        'Operation Type' : 'Operasyon Tipi', 
        'Arrival time' : 'Varış Zamanı', 
        'Fleet Details' : 'Filo Detayları', 
        'Adets' : 'Adet', 
        'Transported Madenirals' : 'Taşınan Kaynaklar', 
        'Zaman remaining for spy attempt to target' : 'Casusluk için hedefe kalan süre', 
        'Occupy Bölge' : 'Bölgeyi işgal et', 
        'Zaman remaining to capture empty territory' : 'Bölgeyi işgal etmek için hedefe kalan süre', 

        'Foot' : 'Piyade Birliği', 
        'Defense Tank' : 'Savunma Tankı', 
        'Attack Tank' : 'Saldırı Tankı', 
        'Missile Launcher Tank' : 'Füze Fırlatma Tankı', 
        'Missile Launcher' : 'Füze Fırlatma', 
        'Tactical Helicopter' : 'Taktik Helikopter', 
        'Defense Jet' : 'Savunma Jeti', 
        'Bomber Aircraft' : 'Bombardıman Uçağı', 
        'Drone' : 'Drone', 
        'Shipment Truck' : 'Sevkiyat Kamyonu', 
        'Shipment Plane' : 'Sevkiyat Uçağı', 
        'Mobile Settlement Vehicle' : 'Mobil İskan Aracı', 
        'Scrapper' : 'Kazıyıcı', 
        'Booby Trap' : 'Bubi Tuzağı', 
        'Machine Gun Mount' : 'Makineli Tüfek Dağı', 
        'Anti-Aircraft Battery' : 'Uçaksavar Batarya', 
        'Rehberd Missile Battery' : 'Güdümlü Füze Batarya', 
        'Rehberd Füze Fırlatma' : 'Güdümlü Füze Fırlatma', 
        'Long-range Füze Fırlatma' : 'Uzun Menzilli Füze Fırlatma', 
        'Heavy Machine Gun' : 'Ağır Makineli Tüfek', 
        'Electromagnetic Shock Bomb' : 'Elektromanyetik Şok Bomba', 
        'Hunter' : 'Avcı', 
        'Avcı Missile' : 'Avcı Füze', 
        'When you cancel the production of an unit, 70% of minerals are refunded.' : 'Bir birimin üretimini iptal ettiğinizde, kaynakların %70 iade edilir.', 



        // Birim Yönetimi

        // Harita Ekranı

        'You need to build radar' : 'Radar inşa etmen gerekir.', 
        'Owner' : 'Sahibi', 
        'Empty Territory' : 'Boş Bölge', 
        'Enemy Bölge' : 'Düşman Bölge', 
        'Our Bölge' : 'Bizim Bölge', 

        // Harita Ekranı

        // Savunma Sistemleri

        'Defense Systems' : 'Savunma Sistemleri', 
        'Active Savunma Sistemleri' : 'Aktif Savunma Sistemleri', 
        'Birims' : 'Birimler', 
        'Birim Name' : 'Birim Adı', 
        'Armor' : 'Zırh', 
        'Weapon' : 'Silah', 

        // Savunma Sistemleri

        // Federasyon Ekranı

        'You are not a member of any federation.' : 'Herhangi bir federasyon üyesi değilsiniz.', 
        'Create Federation' : 'Federasyon oluştur', 
        'Search Federation' : 'Federasyon ara', 	
        'Manage Federasyon' : 'Federasyonu Yönet', 	
        'Mass Mesaj' : 'Kitle Mesajı', 	
        'Gönder Kitle Mesajı' : 'Kitle Mesajı Gönder', 	
        'Applications' : 'Uygulamalar', 	
        'Click the user name to manage accounts' : 'Hesapları yönetmek için kullanıcı adına tıklayın', 	
        'Federasyon Authorization' : 'Federasyon Yetkilendirme', 	
        'Authorization' : 'Yetki', 	
        'Last Accesss Zaman' : 'Son Giriş Zamanı', 	
        'Online time' : 'Çevrimiçi Süresi', 	
        'hour' : 'saat', 	
        'Remove from Federasyon' : 'Federasyondan At', 	
        '(Warning!)' : '(Uyarı!)', 	
        'Advanced Settings' : 'Gelişmiş Ayarlar', 	
        'Dispatch Federasyon' : 'Federasyonu Dağıt', 	
        'Membership Durum' : 'Üyelik Durumu', 	
        'Membership Open' : 'Üyelik Açık', 	
        'Membership Closed' : 'Üyelik Kapalı', 	
        'This operation will cancel membership of all federation members and dispatch the federation. This is irreversable..' : 'Bu işlem tüm federasyon üyelerinin üyeliklerini iptal eder ve federasyondan tevzi eder. Bu işlem geri alınamaz.', 	
        'This message will be delivered to all federation members.' : 'Bu mesaj tüm federasyon üyelerine gönderilecektir.', 	
        'Federasyon Kitle Mesajı System' : 'Federasyon Kitle Mesaj Sistemi', 	

        // Federasyon Ekranı

        // Teknik Agacı Ekranı

        'Structures' : 'Yapılar', 	
        'Building' : 'Bina', 
        'Technical information' : 'Teknik Bilgiler', 
        'Silahs' : 'Silah', 
        'Shield' : 'Kalkan', 
        'Fuel Consumption' : 'Yakıt tüketimi', 
        'Birim Class' : 'Birim Sınıfı', 
        'Hedef Class' : 'Hedef Sınıfı', 
        'Ground Birim' : 'Kara Birimi', 
        'Only Ground Birimler' : 'Sadece Kara Birimleri', 
        'Only Kara Birimleriler' : 'Sadece Kara Birimleri', 
        'Only Air Birimler' : 'Sadece Hava Birimleri', 			
        'Only Kara Birimiler' : 'Sadece Kara Birimleri', 			
        'Air Birim' : 'Hava Birimi', 			
        'Nuclear Saldırı' : 'Nükleer Saldırı', 			

        // Teknik Agacı Ekranı

        // Ticaret Merkezi Ekranı

        'You need to build trade center' : 'Ticaret Merkezi inşa etmen gerekir.', 
        'Trade Operation' : 'Ticaret Kullanımı', 
        'Trade Type' : 'Ticaret Tipi', 
        'Trade Miktar' : 'Ticaret Miktarı', 
        'Given ' : 'Verilen ', 
        'Taken' : 'Alınan', 
        'unit ' : 'birim', 
        'You should use at least 1000 adet var of mineral for the trade operation.' : 'Ticaret işlemi için en az 1000 birim hammadde kullanmalısınız.', 
        'Data updates every minute automatically.' : 'Veriler otomatik olarak her dakika güncellenir.', 
        'There is 5% of trade commission for every trade operation.' : 'Her ticaret işleminde %5 ticaret komisyonu alınır.', 
        'Trade Details' : 'Ticaret Detayları', 
        'Rate' : 'Oran', 
        'Return Miktar' : 'Alınacak Miktar', 
        '5% Commission' : 'Komisyon %5', 
        'Ticaret operation completed successfully' : 'Ticaret işlemi başarıyla tamamladı', 

        // Ticaret Merkezi Ekranı

        // Arama Ekranı

        'Search' : 'Arama', 
        'By User Name' : 'Kullanıcı adı ile', 
        'By Territory Name' : 'Bölge adı ile', 
        'By Federation Name' : 'Federasyon adı ile', 

        // Arama Ekranı

        // İşlemlerim Ekranı

        'My Transactions' : 'İşlemlerim', 
        'ID' : 'ID', 
        'Time' : 'Zaman', 
        'Status' : 'Durum', 
        '/İnşa et (.*?$)/g' : '$1 inşa edildi',
        'were produced' : 'üretildi',

        // İşlemlerim Ekranı

        // Mesajlar Ekranı

        'Mesajs' : 'Mesaj', 
        'Recipient :' : 'Alıcı :', 
        'Subject :' : 'Konu :', 
        'Message' : 'Mesaj', 
        'Inbox' : 'Gelen kutusu',
        'Sender' : 'Gönderen',
        'Subject' : 'Konu',

        // Mesajlar Ekranı

        // Raporlar Ekranı

        'Reports' : 'Raporlar', 
        'Spy Reports :' : 'Casusluk Raporları :', 
        'New' : 'Yeni', 
        'Casusluk Report' : 'Casusluk Raporu', 
        'Information collected about territory' : 'Bölge hakkında toplanan bilgiler', 
        'Report Zaman' : 'Rapor Zamanı', 
        'Madeni Information' : 'Maden Bilgileri', 
        'Birim Information' : 'Birim Bilgileri', 
        'İnşa eting Information' : 'Bina Bilgileri', 
        'Araştırma Information' : 'Araştırma Bilgileri', 
        'Birimler in Battle' : 'Savaştaki Birimler', 
        'Back' : 'Geri', 
        'Delete' : 'Sil', 
        'Saldırıer won the battle.' : 'Savaşı saldıran taraf kazandı', 
        'Saldırıer Player' : 'Saldıran Oyuncu', 
        'Defender Player' : 'Savunan Oyuncu', 
        'Saldırıer Bölge' : 'Saldıran Bölge', 
        'Defender Bölge' : 'Savunan Bölge', 
        'Battle Report' : 'Savaş Raporu', 
        'Birimler Before Battle' : 'Savaştan Önceki Birimler', 
        'Birimler After Battle' : 'Savaştan Sonraki Birimler', 
        'Captured Madenirals' : 'Kazanılan Hammaddeler', 
        'Wreck collection completed.' : 'Enkaz toplama tamamlandı', 
        'Wreck Collecting Report' : 'Enkaz Toplama Raporu', 
        'Wreck collection initiated from' : 'Enkaz toplamaya gönderen yer', 
        'owned by' : 'sahibi', 
        ', to' : ', gönderilen', 
        'has been completed successfully at' : 'toplama başarıyla tamamladı. Toplama saati', 
        'Collected Madenirals' : 'Toplanan Hammaddeler', 

        // Raporlar Ekranı

        // Butonlar

        'Sil Seçed' : 'Seçilenleri Sil',
        'Sil Hepsi Read' : 'Tüm Okunanları Sil',
        'Send' : 'Gönder',
        'Kaydet Settings' : 'Ayarları Kaydet',
        'Withdraw' : 'Çek',
        'Sil  Account (in 3 days)' : 'Hesabı Sil (3 gün)',
        'Gönder Invitation' : 'Davetiye Gönder',
        'Sort' : 'Sırala',
        'Calculate' : 'hesapla',
        'Produce Order' : 'Emri ver',
        'Produce order' : 'Emri ver',
        'Save' : 'Kaydet',
        'Reply' : 'Cevapla',
        'Sil Mesaj' : 'Mesajı Sil',
        'All' : 'Hepsi',
        'Accept' : 'Onayla',
        'Decline' : 'Red Et',
        'Trade' : 'Ticaret',

        // Butonlar

        // Ayarlar Ekranı

        'User Settings' : 'Kullanıcı Ayarları', 
        'New Password' : 'Yeni Parola', 
        'Re-enter Yeni Parola' : 'Yeni Parola (Tekrar)', 
        'Theme' : 'Tema', 
        'Mail Address' : 'E-Posta Adresi', 
        'User Name' : 'Kullanıcı Adı', 
        'Teritory Name' : 'Bölge Adı', 
        'Çek Address' : 'Çekme Adresi', 
        'Deposit Address' : 'Depozit Adresi', 
        '/Minimal amount for deposit is (.*?$)/g' : 'Minimum depozit miktarı $1', 
        'Delete Account (in 3 days)' : 'Hesabı Sil (3 gün)', 
        'Vacation Mode' : 'Tatil Modu', 
        'Days' : 'Gün', 
        'Password' : 'Parola', 
        'Çek Fund' : 'Fon Çekiniz', 
        '/Minimal amount for withdraw is (.*?$)/g' : 'Minimum çekme miktarı $1', 
        'Çek History' : 'Çekim Geçmişi', 
        'Deposit History' : 'Depozit Geçmişi', 
        'Confirmation' : 'Onay', 
        'To change your password, enter new password twice. Then enter your current password and save settings.' : 'Şifrenizi değiştirmek için, iki kez yeni şifreyi girin. Sonra geçerli parolanızı girin ve ayarları kaydedin.', 			
        'To change the name of teritory, enter new name to teritory name space. Enter your password and click Ayarları Kaydet.' : 'Bölge adını değiştirmek için, bölge adını girin. Sonra geçerli parolanızı girin ve ayarları kaydedin.', 		
        'You cannot login to game till the end date of vacation in vacation mode.' : 'Tatil moduna aldığınız taktirde. Tatilin bitiş tarihine kadar oyuna giriş yapamazsınız.', 

        // Ayarlar Ekranı

        // Arkadaş davet et Ekranı

        'Invite a friend to Platoon Game.' : 'Platoon Game arkadaşını davet et.', 
        'Invite Friend' : 'Arkadaşını davet et.', 
        'Please enter your friend\'s email address and click Gönder.' : 'Arkadaşınızın e-posta adresini girin ve Davetiye Gönder\'e tıklayın.', 

        // Arkadaş davet et Ekranı

        //  İstatistikler Ekranı

        'By Score' : 'Puana göre', 
        'By Deneyim' : 'Deneyime göre', 
        'By Federation' : 'Federasyona göre', 
        'Statistics' : 'İstatistikler', 		
        'Row' : 'Sıra', 
        'User' : 'Kullanıcı', 
        'Territory' : 'Bölge', 
        'Federation' : 'Federasyon', 
        'Score' : 'Puan', 
        'İstatistiklerupdated every saat' : 'İstatistikler her saat başı güncellenir', 
        'Available to Attack' : 'Saldırıya açık', 
        'Player Under Protection (Noob Mode)' : 'Koruma modundaki oyuncu (Noob)', 
        'Passive Player' : 'Pasif oyuncu ', 
        'Member of Same Federasyon' : 'Aynı federasyonun oyuncusu', 
        'Player on Tatil Modu' : 'Tatil modundaki oyuncu', 

        //  İstatistikler Ekranı

        // Yapı Açıklamaları

        'Electricity power plant produces energy for facilities. Those facilities stop working if there is not sufficient energy. Hence, you need to upgrade parallel to your development.' : 'Elektrik santrali tesisleri için enerji üretir. Bu tesisler yeterli enerji yoksa çalışmayı durdurur. Bu nedenle, sizin gelişmenize paralel yükseltmeniz gerekir.', 
        'To build every vehicle and birimin the game, you need to produce iron. Parallel to game development, you need to upgrade your iron mine.' : 'Oyunda her araç ve birim oluşturmak için, demir üretmek gerekir. sizin gelişmenize paralel demir madeni yükseltmeniz gerekir.', 
        'Altın is crucial for every area, such as communication and defense Teknolojisinologies. It´s hard to build and needs high energy.' : 'Altın iletişim ve savunma teknolojileri, her alan için çok önemli şekildedir. Inşa etmek zordur ve yüksek enerjiye ihtiyacı vardır.', 
        'Vehicles need oil to run. Once you increase the number of your vehicles in the army, you need to produce more oil.' : 'Araçlar çalıştırmak için yağ gereklidir. Askerde araçların sayısını artırmak sonra, daha fazla yağ üretmek gerekiyor.', 
        'To invent and develop new Teknolojisinologies, you need to build science lab. Every upgrade decreases research time by 5%.' : 'icat ve yeni teknolojiler geliştirmek için, bilim laboratuarı inşa etmek gerekir. Her yükseltme %5 oranında araştırma süresini azaltır.', 
        'Engineering lab helps to make researches about constructions. Each upgrade decreases facility construction duration by 5%. Highest level of this lab is 7' : 'Mühendislik Laboratuvarı yapılar hakkında araştırmalar yapmak için yardımcı olur. Her yükseltme %5 oranında tesis bina süresini azaltır. Bu laboratuvarda en yüksek düzeyde 7. kademeye çıkarılabilir.', 
        'Radar towers are necessery to track enemy movements. In addition, you need radar to develop new Teknolojisinologies. With the help of more radar towers, you can command 1 more army at the same time.' : 'Radar kuleleri düşman hareketlerini izlemek için gereklidir. Buna ek olarak, yeni teknolojiler geliştirmek için radar gerekir. Daha fazla radar kuleleri sayesinde, aynı anda 1  ordu daha komuta edebilirsiniz.', 
        'Hepsi defense and attack vehicle constructed in the war factory. If you don´t have a war factory, your territory will easily be attacked by enemies. Each upgrade decrease the attack and defense vehicle building time by 5%.' : 'Savaş fabrikasında inşa tüm savunma ve saldırı aracı. Eğer bir savaş fabrikası yoksa, bölge kolayca düşmanları tarafından saldırıya olacaktır. Her yükseltme %5 saldırı ve savunma araç bina süresini azaltır.', 
        'Ticaret Merkezi helps to convert your resource mines to each other. Each upgrade increase your daily trade limit by 20,000 adet var.' : 'Ticaret Merkezi madenlerini birbirlerine dönüştürmek için yardımcı olur. Her yükseltme 20.000 adet günlük ticaret sınırını artırın.', 
        'Nano Teknolojisi lab decreases construction duration by 15% on every upgrade. Highest level of this lab is 4, which means you can decrease construction duration by 60%.' : 'Nano teknoloji laboratuarı her yükseltme %15 bina süresini azaltır. Bu laboratuvarda en yüksek kademesi 4\'tür.Buda size %60 oranında bina süresini azaltmak anlamına gelir.', 
        'Geology center works on the territory and able to increase the area of your teritory. Each upgrade increases your teritory size by 10 adet var. Highest level of this center is 5.' : 'Jeoloji merkezi bölgede ve Kendi bölgenizin alanını artırmak mümkün kılar. Her yükseltme 10 birimleri tarafından Kendi bölgenizde boyutunu artırır. Bu merkezin en üst kademesi 5\'tir.', 

        // Yapı Açıklamaları

        // Savaş Fabrikası Açıklamaları

        'For communication between adet var, Hücresel İletişim Teknolojisinology should be developed.' : 'Birimleri arasındaki iletişim için Hücresel İletişim Teknolojisi geliştirilmelidir.', 
        'Casusluk Teknolojisi is crucial to gather intel abour enemy power and defense systems. The more you increase your spy Teknolojisi, the more intel you receive.' : 'Casusluk Teknolojisi düşman güç ve savunma sistemleri hakkında istihbarat toplamak için çok önemlidir. Casusluk Teknolojisi getirebileceğiniz en üst seviyeye getirin.', 
        'Jet engine research is needed for air adet var production. Every level of this research increases speed of adet var that uses jet engine by 5%.' : 'Jet motoru araştırma hava üniteleri üretimi için gereklidir. Bu araştırmanın her seviyesi jet motorunu kullanan birimlerin hızını %5 artırır.', 
        'Each level of armor Teknolojisi hardens the armor of vehicles by 5%.' : 'Zırh teknoloji her seviye %5 araçların zırh güçlendirir.', 
        'Radar is important to learn about threats before they reach your adet var. In order to have a good warning system, radar Teknolojisi should be increased continuously.' : 'Radar onlar birimleri ulaşmadan tehditler hakkında bilgi edinmek önemlidir. İyi bir uyarı sistemi için radar teknoloji sürekli artırılmalıdır.', 
        'In order to have faster, efficient and stronger combat adet var, they need to use smarter computers. For having high-Teknolojisi computers, you have to use cyber electronics.' : 'Daha hızlı, verimli ve daha güçlü mücadele birimleri için, onlar daha akıllı bilgisayar kullanmanız gerekir. yüksek teknoloji bilgisayarları olan için, siber elektronik kullanmak zorunda.', 
        'Hydrogen engine Teknolojisi is needed to built defense system rockets. Each level increases makes defense system stronger.' : 'Hidrojen motor teknoloji inşa savunma sistemi roketlere ihtiyaç vardır. Her seviye artar savunma sistemi daha güçlü hale getirir.', 
        'Silah that uses fuel needs developed fuel Teknolojisi. Each level increases weapon power by 5%.' : 'Silah yakıt teknoloji geliştirdi yakıt ihtiyaçlarını kullanır. Her seviye% 5 oranında silah gücünü artırır.', 
        'This Teknolojisi is necessary for faster and stronger ground vehicles. Each level increases ground vehicle speed by 5%.' : 'Bu teknoloji daha hızlı ve daha güçlü kara araçlar için gereklidir. Her seviye %5 oranında kara araç hızını artırır.', 
        'Nuclear reactions are nedded for mass desctructive weapons. Every level of Teknolojisi increases the power of vehicles that carry nuclear weapons.' : 'Nükleer reaksiyonlar kitle yıkıcı silahlar için ihtiyaç vardır. teknoloji her düzeyde nükleer silah taşıyan araçların gücünü artırır.', 

        // Savaş Fabrikası Açıklamaları

        // Birim Açıklamaları

        'Piyade Birliği is a small birimto defend for light attacks. It can also be used for attacks.' : 'Piyade Birliği hafif saldırılar için savunmak için küçük bir birimdir. Ayrıca, saldırı için de kullanılabilir.', 
        'Defense tank is a heavy weapon which can by used for both defense and attack. It is a perfect support for strong attacks.' : 'Savunma Tankı, savunma ve saldırı da kullanılanmak için seçebilirsiniz ağır bir silahtır. Güçlü saldırılar için mükemmel bir destektir.', 
        'Saldırı tank is used to destroy enemy defense adet var. It is a must for strong attacks.' : 'Saldırı tankı düşman savunma birimlerini yok etmek için kullanılır. Güçlü saldırılar için bir zorunluluktur.', 
        'This tank can be used against both air and ground adet var. It`s best usage might be as scout to test enemy before the main attack.' : 'Bu tank, hava ve kara birliklerine karşı kullanılabilir. En iyi kullanım ana saldırıdan önce düşman test olarak keşif olabilir.', 
        'Missile launcher is one of the most efficient defense weapons against ground attacks. It is designed to destroy approaching enemy ground tarkets.' : 'Füzesi Fırlatıcı kara saldırılarına karşı en etkili savunma silahlarından biridir. Yaklaşan düşman kara hedefleri yok etmek üzere tasarlanmış.', 
        'This helicopter is fast, effective and strong attack unit. It is critical for both ground and air attacks.' : 'Bu helikopter, hızlı, etkili ve güçlü bir saldırı birimidir. Kara ve hava saldırıları kritik önem taşımaktadır.', 
        'Although the name stands for defense, defense jet can be used for attacks as well. It protects other attack adet var and joins to attack when it has opportunity.' : 'Adı savunması için duruyor gibi olsa da, savunma jeti de saldırılar için de kullanılabilir. Diğer saldırı birimleri korur ve fırsat olduğunda saldırıya katılır.', 
        'It\`s a strong war machine to destroy enemy ground and air defense systems.' : 'Düşman kara ve hava savunma sistemleri yok etmek için güçlü bir savaş makinesidir.', 
        'Drones let\`s you to gather intel about enemy adet var, researches and resources. It also has a weak attack ability.' : 'Dronlar düşman birimlerine, araştırma ve kaynaklar hakkında istihbarat toplamak için kullanılır. Ayrıca zayıf saldırı yeteneğine sahiptir.', 
        'The main reason of war is earning enemy resources. You can use shipment trucks to collect enemy resources when you win a battle. It is cheap and easy to produce, however you should consider faster shipment options by time.' : 'Savaşın asıl nedeni düşman kaynaklarını kazanç sağlamaktır. Bir savaşı kazandığın zaman düşman kaynakları toplamak için nakliye kamyonları kullanabilirsiniz. Bunu üretmek ucuz ve kolaydır, ancak zaman daha hızlı sevkiyat seçenekleri göz önünde bulundurmalıdır.', 
        'Shipment plane let`s you to carry resources from enemy territory, or between your own teritories.' : 'Sevk uçağı düşman topraklarından, ya da kendi toprakları arasında kaynak taşımak için kullanılır.', 
        'Once you develop your Teknolojisinologies, you need more area for settlement. This vehicle makes the ground smoother so you can have more space to construct your buildings.' : 'Eğer teknolojileri geliştirdikten sonra, çözüm için daha fazla alan gerekirse. Bu araç size binalar inşa etmek daha fazla alana sahip, boş bölge işgal eder.', 
        'Kazıyıcı collects wrecks and ruins in the battle area and recycle them. You can send your shipment  vehicles with it to carry recycled resources back to your base.' : 'Kazıyıcı savaş alanında harabe ve kalıntıları toplar ve bunları geri dönüşümünü sağlar. Bununla üssüne geri dönüşümlü kaynakların taşımak sevkiyat aracı gönderebilirsiniz.', 

        'You can use those traps as a defense tool to harm approaching enemies.' : 'Yaklaşan düşmanlara zarar vermek için bir savunma aracı olarak bu tuzakları kullanabilirsiniz.', 		
        'This mount is first to have defense birimagainst ground attacks. It can be useful for light ground attacks.' : 'Bu dağı kara saldırılarana karşı ilk savunma birimi olarak kullanabilirsiniz. Hafif kara saldırılar için yararlı olabilir.', 
        'This mount is first to have defense birimagainst air attacks. It can be useful for light air attacks.' : 'Bu silahı hava saldırılarana karşı ilk savunma birimi olarak kullanabilirsiniz. Hafif hava saldırılar için yararlı olabilir.', 
        'This battery is crucial against ground and air attacks for a fast and effective defense.' : 'Bu batarya, hızlı ve etkili bir savunma için kara ve hava saldırılarına karşı son derece önemlidir.', 		
        'Rehberd missile launcher can be used against air attacks, and can easily defend your base.' : 'Güdümlü füze fırlatma hava saldırılarına karşı kullanılabilir ve kolayca temel savunmak olabilir.', 
        'Long range launcher is a good defense weapon to stop enemy attacks from a long distance. It will be your one of the main defense adet var once you develop your Teknolojisinology.' : 'Uzun menzilli fırlatıcı uzun mesafeden düşman saldırıları durdurmak için iyi bir savunma silahıdır. Bu teknolojini geliştirmelisiniz sizin ana savunma biriminden biri olacaktır.', 
        'Heavy machine gun can be used as a defense birimagainst both ground and air enemy attacks.' : 'Ağır makineli tüfek, hem kara ve hem de hava düşman saldırılarına karşı bir savunma birimi olarak kullanılabilir.', 
        'Red Forces developed this bomb as an answer to Blue Force`s magnetic shield. This strong bomb blocks all electronics in the enemy vehicles and systems so all defense and attack adet var become inactive.' : 'Kırmızı Kuvvetler Mavi Kuvvetlere manyetik kalkana bir cevap olarak bu bombayı geliştirdi. Bu güçlü bomba düşman araçları ve sistemlere kadar bütün savunma ve saldırı birimleri tüm elektronik sistemleri kullanılmaz hale getirir.', 
        'Due to nature of the battles, mankind developed faster war machines. Avcı is one of those and can be used to attack enemy defense forces.' : 'Savaşlar nedeniyle, insanlık doğası gereği daha hızlı savaş makineleri geliştirdi. Avcı bunlardan biridir ve düşman savunma kuvvetlerini saldırmak için kullanılabilir. ', 
        'Avcı missiles is a long range air defense birimand is a must for an effective defense.' : 'Avcı füzeleri uzun menzilli hava savunma birimidir ve etkili bir savunma için bir zorunluluktur.', 
        // Birim Açıklamaları

        // Kullanıcı Bilgi Ekranı

        'Kullanıcı Information' : 'Kullanıcı Bilgileri', 
        'Guild ' : 'Birlik', 
        'You need to setup radar to see guild info!' : 'Kullanıcın bilgilerini görmek için öncelikle Radar kurman gerekiyor.', 
        'Owned Bölge' : 'Sahip Olduğu Bölgeler', 
        'Bölge Name' : 'Bölge Adı', 
        'Koordinats' : 'Koordinatlar', 
        'Move' : 'Hareket', 
        'Casusluking' : 'Casusluk', 

        // Kullanıcı Bilgi Ekranı

        // Federasyon Ekranı

        'Federasyon Name' : 'Federasyon Adı', 
        'Federasyon Nick Name' : 'Federasyon Takma Adı', 
        'Toplam Members' : 'Toplam Üye', 
        'Founder' : 'Kurucu', 
        'Member List' : 'Üye Listesi', 
        'Federasyon Web Page' : 'Federasyon Web Sitesi', 
        'Join this Federasyon' : 'Federasyona Katıl', 
        'Federasyon member list' : 'Federasyona Üye Listesi', 
        'Member Name' : 'Üye Adı', 
        'Authority' : 'Yetki', 
        'You can not join this federation, your Birlikis different.' : 'Birliğiniz aynı olmadığı için bu Federasyona katılamazsınız.', 
        'New Federasyon' : 'Yeni Federasyon', 
        'Federasyon Nickname' : 'Federasyon Takma Adı', 
        'Federasyon Info' : 'Federasyon Bilgisi', 

        // Federasyon Ekranı

        // Canlı Yazılar

        '/Continuing building (.*?$)/g' : '$1 devam ediyor',
        'Cancel' : 'İptal Et',
        'Complete' : 'Bitir',
        'Bitird' : 'Tamamlandı',
        'Turning back from target' : 'Hedeften geri dönüş',
        'Zaman remaining to start attack for target' : 'Hedefe saldırı için kalan zaman',
        'Turning back from collecting scraps from wreck territory' : 'Enkaz bölgesinden toplanan atıkların geri dönüşü',

        // Canlı Yazılar


        ///////////////////////////////////////////////////////
        '':''};





    //////////////////////////////////////////////////////////////////////////////
    // This is where the real code is
    // Don't edit below this
    //////////////////////////////////////////////////////////////////////////////

    var regexs = [], replacements = [],
        tagsWhitelist = ['PRE', 'BLOCKQUOTE', 'CODE', 'INPUT', 'BUTTON', 'TEXTAREA'],
        rIsRegexp = /^\/(.+)\/([gim]+)?$/,
        word, text, texts, i, userRegexp;

    // prepareRegex by JoeSimmons
    // used to take a string and ready it for use in new RegExp()
    function prepareRegex(string) {
        return string.replace(/([\[\]\^\&\$\.\(\)\?\/\\\+\{\}\|])/g, '\\$1');
    }

    // function to decide whether a parent tag will have its text replaced or not
    function isTagOk(tag) {
        return tagsWhitelist.indexOf(tag) === -1;
    }

    delete words['']; // so the user can add each entry ending with a comma,
    // I put an extra empty key/value pair in the object.
    // so we need to remove it before continuing

    // convert the 'words' JSON object to an Array
    for (word in words) {
        if ( typeof word === 'string' && words.hasOwnProperty(word) ) {
            userRegexp = word.match(rIsRegexp);

            // add the search/needle/query
            if (userRegexp) {
                regexs.push(
                    new RegExp(userRegexp[1], 'g')
                );
            } else {
                regexs.push(
                    new RegExp(prepareRegex(word).replace(/\\?\*/g, function (fullMatch) {
                        return fullMatch === '\\*' ? '*' : '[^ ]*';
                    }), 'g')
                );
            }

            // add the replacement
            replacements.push( words[word] );
        }
    }

    function main(){
        // do the replacement
        texts = document.evaluate('//body//text()[ normalize-space(.) != "" ]', document, null, 6, null);
        for (i = 0; text = texts.snapshotItem(i); i += 1) {
            if ( isTagOk(text.parentNode.tagName) ) {
                regexs.forEach(function (value, index) {
                    text.data = text.data.replace( value, replacements[index] );
                });
            }
        }

        var xs = document.querySelectorAll('input[type="button"], input[type="submit"]', 'input[type="checkbox"]');

        for (i = 0; i < xs.length; i++){
            regexs.forEach(function (value, index) {
                xs[i].value = xs[i].value.replace( value, replacements[index] );
            });
        }

        if (document.location.pathname === '/map.asp'){
            var map_images = document.querySelectorAll('img[src="images/red_area.gif"], img[src="images/dark_blue_area.gif"], img[src="images/white_area.gif"], img[src="images/zone.gif"]');

            for (var i = 0; i < map_images.length; i++){
                regexs.forEach(function (value, index) {
                    map_images[i].title = map_images[i].title.replace( value, replacements[index] );
                });
            }
        }


    }

    document.addEventListener("DOMSubtreeModified", function(event){
        main();
    });

    main();



}());
