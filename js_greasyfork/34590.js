// ==UserScript==
// @name           Victory: накруточка
// @version        1.00
// @namespace      Victory
// @description    Творим добро
// @include        http*://*virtonomic*.*/*/main/company/view/*/unit_list/employee*
// @downloadURL https://update.greasyfork.org/scripts/34590/Victory%3A%20%D0%BD%D0%B0%D0%BA%D1%80%D1%83%D1%82%D0%BE%D1%87%D0%BA%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/34590/Victory%3A%20%D0%BD%D0%B0%D0%BA%D1%80%D1%83%D1%82%D0%BE%D1%87%D0%BA%D0%B0.meta.js
// ==/UserScript==

var run = function() {
	function main1(units) {
		var storage, curPers, curSalary;
		var i = 0;
		$.ajax({
			url: units[i],
			type: "get",
			async: false,
			success: function(html){
				storage = $(html);
				curPers =  storage.find('#quantity').attr('value');
				curSalary = storage.find('#salary').attr('value');
				$.ajax({
					url: units[i],
					type: "post",
					async: false,
					data: 'unitEmployeesData[salary]=1',
					success: function(){
						$.ajax({
							url: units[i],
							type: "post",
							async: false,
							data: 'unitEmployeesData[quantity]=' + (curPers + 20),
							success: function(){
								$.ajax({
									url: units[i],
									type: "post",
									async: false,
									data: 'unitEmployeesData[salary]=' + curSalary,
									success: function(){
										i += 1;
									}
								})
							}
						})
					}
				})
			}
		})
		if (i == units.length) { location.reload(); }
	}

	var btn = $('<button>Круть!</button>').click(function() {
		var unitsStr = `https://virtonomica.ru/olga/window/unit/employees/engage/6705631
		https://virtonomica.ru/olga/window/unit/employees/engage/6705632
		https://virtonomica.ru/olga/window/unit/employees/engage/6705633
		https://virtonomica.ru/olga/window/unit/employees/engage/6705634
		https://virtonomica.ru/olga/window/unit/employees/engage/6705636
		https://virtonomica.ru/olga/window/unit/employees/engage/6705637
		https://virtonomica.ru/olga/window/unit/employees/engage/6705638
		https://virtonomica.ru/olga/window/unit/employees/engage/6705639
		https://virtonomica.ru/olga/window/unit/employees/engage/6705641
		https://virtonomica.ru/olga/window/unit/employees/engage/6705642
		https://virtonomica.ru/olga/window/unit/employees/engage/6705643
		https://virtonomica.ru/olga/window/unit/employees/engage/6705644
		https://virtonomica.ru/olga/window/unit/employees/engage/6705645
		https://virtonomica.ru/olga/window/unit/employees/engage/6705647
		https://virtonomica.ru/olga/window/unit/employees/engage/6705648
		https://virtonomica.ru/olga/window/unit/employees/engage/6705649
		https://virtonomica.ru/olga/window/unit/employees/engage/6705650
		https://virtonomica.ru/olga/window/unit/employees/engage/6705652
		https://virtonomica.ru/olga/window/unit/employees/engage/6705653
		https://virtonomica.ru/olga/window/unit/employees/engage/6705654
		https://virtonomica.ru/olga/window/unit/employees/engage/6705655
		https://virtonomica.ru/olga/window/unit/employees/engage/6705657
		https://virtonomica.ru/olga/window/unit/employees/engage/6705658
		https://virtonomica.ru/olga/window/unit/employees/engage/6705659
		https://virtonomica.ru/olga/window/unit/employees/engage/6705660
		https://virtonomica.ru/olga/window/unit/employees/engage/6705661
		https://virtonomica.ru/olga/window/unit/employees/engage/6705663
		https://virtonomica.ru/olga/window/unit/employees/engage/6705664
		https://virtonomica.ru/olga/window/unit/employees/engage/6705665
		https://virtonomica.ru/olga/window/unit/employees/engage/6705666
		https://virtonomica.ru/olga/window/unit/employees/engage/6705668
		https://virtonomica.ru/olga/window/unit/employees/engage/6705669
		https://virtonomica.ru/olga/window/unit/employees/engage/6705670
		https://virtonomica.ru/olga/window/unit/employees/engage/6705671
		https://virtonomica.ru/olga/window/unit/employees/engage/6705672
		https://virtonomica.ru/olga/window/unit/employees/engage/6705674
		https://virtonomica.ru/olga/window/unit/employees/engage/6705675
		https://virtonomica.ru/olga/window/unit/employees/engage/6705676
		https://virtonomica.ru/olga/window/unit/employees/engage/6705677
		https://virtonomica.ru/olga/window/unit/employees/engage/6705679
		https://virtonomica.ru/olga/window/unit/employees/engage/6705680
		https://virtonomica.ru/olga/window/unit/employees/engage/6705681
		https://virtonomica.ru/olga/window/unit/employees/engage/6705682
		https://virtonomica.ru/olga/window/unit/employees/engage/6705684
		https://virtonomica.ru/olga/window/unit/employees/engage/6705685
		https://virtonomica.ru/olga/window/unit/employees/engage/6705686
		https://virtonomica.ru/olga/window/unit/employees/engage/6705687
		https://virtonomica.ru/olga/window/unit/employees/engage/6705689
		https://virtonomica.ru/olga/window/unit/employees/engage/6705690
		https://virtonomica.ru/olga/window/unit/employees/engage/6705691
		https://virtonomica.ru/olga/window/unit/employees/engage/6705692
		https://virtonomica.ru/olga/window/unit/employees/engage/6705693
		https://virtonomica.ru/olga/window/unit/employees/engage/6705695
		https://virtonomica.ru/olga/window/unit/employees/engage/6705696
		https://virtonomica.ru/olga/window/unit/employees/engage/6705697
		https://virtonomica.ru/olga/window/unit/employees/engage/6705698
		https://virtonomica.ru/olga/window/unit/employees/engage/6705700
		https://virtonomica.ru/olga/window/unit/employees/engage/6705701
		https://virtonomica.ru/olga/window/unit/employees/engage/6705702
		https://virtonomica.ru/olga/window/unit/employees/engage/6705703
		https://virtonomica.ru/olga/window/unit/employees/engage/6705705
		https://virtonomica.ru/olga/window/unit/employees/engage/6705706
		https://virtonomica.ru/olga/window/unit/employees/engage/6705707
		https://virtonomica.ru/olga/window/unit/employees/engage/6705708
		https://virtonomica.ru/olga/window/unit/employees/engage/6705709
		https://virtonomica.ru/olga/window/unit/employees/engage/6705711
		https://virtonomica.ru/olga/window/unit/employees/engage/6705712
		https://virtonomica.ru/olga/window/unit/employees/engage/6705713
		https://virtonomica.ru/olga/window/unit/employees/engage/6705714
		https://virtonomica.ru/olga/window/unit/employees/engage/6705716
		https://virtonomica.ru/olga/window/unit/employees/engage/6705717
		https://virtonomica.ru/olga/window/unit/employees/engage/6705718
		https://virtonomica.ru/olga/window/unit/employees/engage/6705719
		https://virtonomica.ru/olga/window/unit/employees/engage/6705720
		https://virtonomica.ru/olga/window/unit/employees/engage/6705722
		https://virtonomica.ru/olga/window/unit/employees/engage/6705723
		https://virtonomica.ru/olga/window/unit/employees/engage/6705724
		https://virtonomica.ru/olga/window/unit/employees/engage/6705725
		https://virtonomica.ru/olga/window/unit/employees/engage/6705727
		https://virtonomica.ru/olga/window/unit/employees/engage/6705728
		https://virtonomica.ru/olga/window/unit/employees/engage/6705729
		https://virtonomica.ru/olga/window/unit/employees/engage/6705730
		https://virtonomica.ru/olga/window/unit/employees/engage/6705732
		https://virtonomica.ru/olga/window/unit/employees/engage/6705733
		https://virtonomica.ru/olga/window/unit/employees/engage/6705734
		https://virtonomica.ru/olga/window/unit/employees/engage/6705735
		https://virtonomica.ru/olga/window/unit/employees/engage/6705736
		https://virtonomica.ru/olga/window/unit/employees/engage/6705738
		https://virtonomica.ru/olga/window/unit/employees/engage/6705739
		https://virtonomica.ru/olga/window/unit/employees/engage/6705740
		https://virtonomica.ru/olga/window/unit/employees/engage/6705741
		https://virtonomica.ru/olga/window/unit/employees/engage/6705743
		https://virtonomica.ru/olga/window/unit/employees/engage/6705744
		https://virtonomica.ru/olga/window/unit/employees/engage/6705745
		https://virtonomica.ru/olga/window/unit/employees/engage/6705746
		https://virtonomica.ru/olga/window/unit/employees/engage/6705747
		https://virtonomica.ru/olga/window/unit/employees/engage/6705750
		https://virtonomica.ru/olga/window/unit/employees/engage/6705756
		https://virtonomica.ru/olga/window/unit/employees/engage/6705757
		https://virtonomica.ru/olga/window/unit/employees/engage/6705758
		https://virtonomica.ru/olga/window/unit/employees/engage/6705759
		https://virtonomica.ru/olga/window/unit/employees/engage/6705761
		https://virtonomica.ru/olga/window/unit/employees/engage/6705762
		https://virtonomica.ru/olga/window/unit/employees/engage/6705763
		https://virtonomica.ru/olga/window/unit/employees/engage/6705764
		https://virtonomica.ru/olga/window/unit/employees/engage/6705766
		https://virtonomica.ru/olga/window/unit/employees/engage/6705767
		https://virtonomica.ru/olga/window/unit/employees/engage/6705768
		https://virtonomica.ru/olga/window/unit/employees/engage/6705769
		https://virtonomica.ru/olga/window/unit/employees/engage/6705770
		https://virtonomica.ru/olga/window/unit/employees/engage/6705771
		https://virtonomica.ru/olga/window/unit/employees/engage/6705772
		https://virtonomica.ru/olga/window/unit/employees/engage/6705773
		https://virtonomica.ru/olga/window/unit/employees/engage/6705774
		https://virtonomica.ru/olga/window/unit/employees/engage/6705775
		https://virtonomica.ru/olga/window/unit/employees/engage/6705776
		https://virtonomica.ru/olga/window/unit/employees/engage/6705777
		https://virtonomica.ru/olga/window/unit/employees/engage/6705778
		https://virtonomica.ru/olga/window/unit/employees/engage/6705779
		https://virtonomica.ru/olga/window/unit/employees/engage/6705781
		https://virtonomica.ru/olga/window/unit/employees/engage/6705782
		https://virtonomica.ru/olga/window/unit/employees/engage/6705783
		https://virtonomica.ru/olga/window/unit/employees/engage/6705784
		https://virtonomica.ru/olga/window/unit/employees/engage/6705785
		https://virtonomica.ru/olga/window/unit/employees/engage/6705786
		https://virtonomica.ru/olga/window/unit/employees/engage/6705787
		https://virtonomica.ru/olga/window/unit/employees/engage/6705788
		https://virtonomica.ru/olga/window/unit/employees/engage/6705789
		https://virtonomica.ru/olga/window/unit/employees/engage/6705791
		https://virtonomica.ru/olga/window/unit/employees/engage/6705792
		https://virtonomica.ru/olga/window/unit/employees/engage/6705793
		https://virtonomica.ru/olga/window/unit/employees/engage/6705794
		https://virtonomica.ru/olga/window/unit/employees/engage/6705795
		https://virtonomica.ru/olga/window/unit/employees/engage/6705796
		https://virtonomica.ru/olga/window/unit/employees/engage/6705797
		https://virtonomica.ru/olga/window/unit/employees/engage/6705798
		https://virtonomica.ru/olga/window/unit/employees/engage/6705799
		https://virtonomica.ru/olga/window/unit/employees/engage/6705800
		https://virtonomica.ru/olga/window/unit/employees/engage/6705801
		https://virtonomica.ru/olga/window/unit/employees/engage/6705802
		https://virtonomica.ru/olga/window/unit/employees/engage/6705803
		https://virtonomica.ru/olga/window/unit/employees/engage/6705804
		https://virtonomica.ru/olga/window/unit/employees/engage/6705805
		https://virtonomica.ru/olga/window/unit/employees/engage/6705806
		https://virtonomica.ru/olga/window/unit/employees/engage/6705807
		https://virtonomica.ru/olga/window/unit/employees/engage/6705808
		https://virtonomica.ru/olga/window/unit/employees/engage/6705810
		https://virtonomica.ru/olga/window/unit/employees/engage/6705811
		https://virtonomica.ru/olga/window/unit/employees/engage/6705812
		https://virtonomica.ru/olga/window/unit/employees/engage/6705813
		https://virtonomica.ru/olga/window/unit/employees/engage/6705814
		https://virtonomica.ru/olga/window/unit/employees/engage/6705815
		https://virtonomica.ru/olga/window/unit/employees/engage/6705816
		https://virtonomica.ru/olga/window/unit/employees/engage/6705817
		https://virtonomica.ru/olga/window/unit/employees/engage/6705818
		https://virtonomica.ru/olga/window/unit/employees/engage/6705819
		https://virtonomica.ru/olga/window/unit/employees/engage/6705820
		https://virtonomica.ru/olga/window/unit/employees/engage/6705821
		https://virtonomica.ru/olga/window/unit/employees/engage/6705822
		https://virtonomica.ru/olga/window/unit/employees/engage/6705823
		https://virtonomica.ru/olga/window/unit/employees/engage/6705824
		https://virtonomica.ru/olga/window/unit/employees/engage/6705825
		https://virtonomica.ru/olga/window/unit/employees/engage/6705826
		https://virtonomica.ru/olga/window/unit/employees/engage/6705827
		https://virtonomica.ru/olga/window/unit/employees/engage/6705828
		https://virtonomica.ru/olga/window/unit/employees/engage/6705829
		https://virtonomica.ru/olga/window/unit/employees/engage/6705830
		https://virtonomica.ru/olga/window/unit/employees/engage/6705831
		https://virtonomica.ru/olga/window/unit/employees/engage/6705832
		https://virtonomica.ru/olga/window/unit/employees/engage/6705833
		https://virtonomica.ru/olga/window/unit/employees/engage/6705834
		https://virtonomica.ru/olga/window/unit/employees/engage/6705835
		https://virtonomica.ru/olga/window/unit/employees/engage/6705836
		https://virtonomica.ru/olga/window/unit/employees/engage/6705837
		https://virtonomica.ru/olga/window/unit/employees/engage/6705838
		https://virtonomica.ru/olga/window/unit/employees/engage/6705839
		https://virtonomica.ru/olga/window/unit/employees/engage/6705840
		https://virtonomica.ru/olga/window/unit/employees/engage/6705841
		https://virtonomica.ru/olga/window/unit/employees/engage/6705842
		https://virtonomica.ru/olga/window/unit/employees/engage/6705843
		https://virtonomica.ru/olga/window/unit/employees/engage/6705844
		https://virtonomica.ru/olga/window/unit/employees/engage/6705845
		https://virtonomica.ru/olga/window/unit/employees/engage/6705846
		https://virtonomica.ru/olga/window/unit/employees/engage/6705847
		https://virtonomica.ru/olga/window/unit/employees/engage/6705848
		https://virtonomica.ru/olga/window/unit/employees/engage/6705849
		https://virtonomica.ru/olga/window/unit/employees/engage/6705850
		https://virtonomica.ru/olga/window/unit/employees/engage/6705851
		https://virtonomica.ru/olga/window/unit/employees/engage/6705852
		https://virtonomica.ru/olga/window/unit/employees/engage/6705853
		https://virtonomica.ru/olga/window/unit/employees/engage/6705854
		https://virtonomica.ru/olga/window/unit/employees/engage/6705855
		https://virtonomica.ru/olga/window/unit/employees/engage/6705856
		https://virtonomica.ru/olga/window/unit/employees/engage/6705857
		https://virtonomica.ru/olga/window/unit/employees/engage/6705858
		https://virtonomica.ru/olga/window/unit/employees/engage/6705859
		https://virtonomica.ru/olga/window/unit/employees/engage/6705860
		https://virtonomica.ru/olga/window/unit/employees/engage/6705861
		https://virtonomica.ru/olga/window/unit/employees/engage/6705862
		https://virtonomica.ru/olga/window/unit/employees/engage/6705863
		https://virtonomica.ru/olga/window/unit/employees/engage/6705864
		https://virtonomica.ru/olga/window/unit/employees/engage/6705865
		https://virtonomica.ru/olga/window/unit/employees/engage/6705866
		https://virtonomica.ru/olga/window/unit/employees/engage/6705867
		https://virtonomica.ru/olga/window/unit/employees/engage/6705868
		https://virtonomica.ru/olga/window/unit/employees/engage/6705869
		https://virtonomica.ru/olga/window/unit/employees/engage/6705870
		https://virtonomica.ru/olga/window/unit/employees/engage/6705871
		https://virtonomica.ru/olga/window/unit/employees/engage/6705872
		https://virtonomica.ru/olga/window/unit/employees/engage/6705873
		https://virtonomica.ru/olga/window/unit/employees/engage/6705874
		https://virtonomica.ru/olga/window/unit/employees/engage/6705875
		https://virtonomica.ru/olga/window/unit/employees/engage/6705876
		https://virtonomica.ru/olga/window/unit/employees/engage/6705877
		https://virtonomica.ru/olga/window/unit/employees/engage/6705878
		https://virtonomica.ru/olga/window/unit/employees/engage/6705879
		https://virtonomica.ru/olga/window/unit/employees/engage/6705880
		https://virtonomica.ru/olga/window/unit/employees/engage/6705881
		https://virtonomica.ru/olga/window/unit/employees/engage/6705882
		https://virtonomica.ru/olga/window/unit/employees/engage/6705883
		https://virtonomica.ru/olga/window/unit/employees/engage/6705884
		https://virtonomica.ru/olga/window/unit/employees/engage/6705885
		https://virtonomica.ru/olga/window/unit/employees/engage/6705886
		https://virtonomica.ru/olga/window/unit/employees/engage/6705887
		https://virtonomica.ru/olga/window/unit/employees/engage/6705888
		https://virtonomica.ru/olga/window/unit/employees/engage/6705889
		https://virtonomica.ru/olga/window/unit/employees/engage/6705890
		https://virtonomica.ru/olga/window/unit/employees/engage/6705891
		https://virtonomica.ru/olga/window/unit/employees/engage/6705892
		https://virtonomica.ru/olga/window/unit/employees/engage/6705893
		https://virtonomica.ru/olga/window/unit/employees/engage/6705894
		https://virtonomica.ru/olga/window/unit/employees/engage/6705895
		https://virtonomica.ru/olga/window/unit/employees/engage/6705896
		https://virtonomica.ru/olga/window/unit/employees/engage/6705897
		https://virtonomica.ru/olga/window/unit/employees/engage/6705898
		https://virtonomica.ru/olga/window/unit/employees/engage/6705899
		https://virtonomica.ru/olga/window/unit/employees/engage/6705900
		https://virtonomica.ru/olga/window/unit/employees/engage/6705901
		https://virtonomica.ru/olga/window/unit/employees/engage/6705902
		https://virtonomica.ru/olga/window/unit/employees/engage/6705904
		https://virtonomica.ru/olga/window/unit/employees/engage/6705905
		https://virtonomica.ru/olga/window/unit/employees/engage/6705906
		https://virtonomica.ru/olga/window/unit/employees/engage/6705907
		https://virtonomica.ru/olga/window/unit/employees/engage/6705908
		https://virtonomica.ru/olga/window/unit/employees/engage/6705909
		https://virtonomica.ru/olga/window/unit/employees/engage/6705910
		https://virtonomica.ru/olga/window/unit/employees/engage/6705911
		https://virtonomica.ru/olga/window/unit/employees/engage/6705912
		https://virtonomica.ru/olga/window/unit/employees/engage/6705913
		https://virtonomica.ru/olga/window/unit/employees/engage/6705914
		https://virtonomica.ru/olga/window/unit/employees/engage/6705915
		https://virtonomica.ru/olga/window/unit/employees/engage/6705916
		https://virtonomica.ru/olga/window/unit/employees/engage/6705917
		https://virtonomica.ru/olga/window/unit/employees/engage/6705918
		https://virtonomica.ru/olga/window/unit/employees/engage/6705919
		https://virtonomica.ru/olga/window/unit/employees/engage/6705920
		https://virtonomica.ru/olga/window/unit/employees/engage/6705921
		https://virtonomica.ru/olga/window/unit/employees/engage/6705922
		https://virtonomica.ru/olga/window/unit/employees/engage/6705923
		https://virtonomica.ru/olga/window/unit/employees/engage/6705924
		https://virtonomica.ru/olga/window/unit/employees/engage/6705925
		https://virtonomica.ru/olga/window/unit/employees/engage/6705926
		https://virtonomica.ru/olga/window/unit/employees/engage/6705927
		https://virtonomica.ru/olga/window/unit/employees/engage/6705928
		https://virtonomica.ru/olga/window/unit/employees/engage/6705929
		https://virtonomica.ru/olga/window/unit/employees/engage/6705930
		https://virtonomica.ru/olga/window/unit/employees/engage/6705931
		https://virtonomica.ru/olga/window/unit/employees/engage/6705932
		https://virtonomica.ru/olga/window/unit/employees/engage/6705933
		https://virtonomica.ru/olga/window/unit/employees/engage/6705934
		https://virtonomica.ru/olga/window/unit/employees/engage/6705935
		https://virtonomica.ru/olga/window/unit/employees/engage/6705936
		https://virtonomica.ru/olga/window/unit/employees/engage/6705937
		https://virtonomica.ru/olga/window/unit/employees/engage/6705938
		https://virtonomica.ru/olga/window/unit/employees/engage/6705939
		https://virtonomica.ru/olga/window/unit/employees/engage/6705940
		https://virtonomica.ru/olga/window/unit/employees/engage/6705941
		https://virtonomica.ru/olga/window/unit/employees/engage/6705942
		https://virtonomica.ru/olga/window/unit/employees/engage/6705943
		https://virtonomica.ru/olga/window/unit/employees/engage/6705945
		https://virtonomica.ru/olga/window/unit/employees/engage/6705946
		https://virtonomica.ru/olga/window/unit/employees/engage/6705947
		https://virtonomica.ru/olga/window/unit/employees/engage/6705948
		https://virtonomica.ru/olga/window/unit/employees/engage/6705949
		https://virtonomica.ru/olga/window/unit/employees/engage/6705950
		https://virtonomica.ru/olga/window/unit/employees/engage/6705951
		https://virtonomica.ru/olga/window/unit/employees/engage/6705952
		https://virtonomica.ru/olga/window/unit/employees/engage/6705953
		https://virtonomica.ru/olga/window/unit/employees/engage/6705954
		https://virtonomica.ru/olga/window/unit/employees/engage/6705955
		https://virtonomica.ru/olga/window/unit/employees/engage/6705956
		https://virtonomica.ru/olga/window/unit/employees/engage/6705957
		https://virtonomica.ru/olga/window/unit/employees/engage/6705958
		https://virtonomica.ru/olga/window/unit/employees/engage/6705959
		https://virtonomica.ru/olga/window/unit/employees/engage/6705960
		https://virtonomica.ru/olga/window/unit/employees/engage/6705961
		https://virtonomica.ru/olga/window/unit/employees/engage/6705962
		https://virtonomica.ru/olga/window/unit/employees/engage/6705963
		https://virtonomica.ru/olga/window/unit/employees/engage/6705964
		https://virtonomica.ru/olga/window/unit/employees/engage/6705965
		https://virtonomica.ru/olga/window/unit/employees/engage/6705966
		https://virtonomica.ru/olga/window/unit/employees/engage/6705967
		https://virtonomica.ru/olga/window/unit/employees/engage/6705968
		https://virtonomica.ru/olga/window/unit/employees/engage/6705969
		https://virtonomica.ru/olga/window/unit/employees/engage/6705970
		https://virtonomica.ru/olga/window/unit/employees/engage/6705971
		https://virtonomica.ru/olga/window/unit/employees/engage/6705972
		https://virtonomica.ru/olga/window/unit/employees/engage/6705973
		https://virtonomica.ru/olga/window/unit/employees/engage/6705974
		https://virtonomica.ru/olga/window/unit/employees/engage/6705975
		https://virtonomica.ru/olga/window/unit/employees/engage/6705976
		https://virtonomica.ru/olga/window/unit/employees/engage/6705977
		https://virtonomica.ru/olga/window/unit/employees/engage/6705978
		https://virtonomica.ru/olga/window/unit/employees/engage/6705979
		https://virtonomica.ru/olga/window/unit/employees/engage/6705980
		https://virtonomica.ru/olga/window/unit/employees/engage/6705981
		https://virtonomica.ru/olga/window/unit/employees/engage/6705982
		https://virtonomica.ru/olga/window/unit/employees/engage/6705983
		https://virtonomica.ru/olga/window/unit/employees/engage/6705984
		https://virtonomica.ru/olga/window/unit/employees/engage/6705985
		https://virtonomica.ru/olga/window/unit/employees/engage/6705986
		https://virtonomica.ru/olga/window/unit/employees/engage/6705987
		https://virtonomica.ru/olga/window/unit/employees/engage/6705988
		https://virtonomica.ru/olga/window/unit/employees/engage/6705989`;

		var units = unitsStr.split('\n');
		main1(units);
	});
	$("input[name*='engage']").after(btn);
};	
			
// Хак, что бы получить полноценный доступ к DOM >:]
var script = document.createElement("script");
script.textContent = '(' + run.toString() + ')();';
document.documentElement.appendChild(script);