// ==UserScript==
// @name        New script - 59.64.78.78
// @namespace   Violentmonkey Scripts
// @match       http://59.64.78.78/course/*
// @match       http://59.64.78.78/report/create_report/
// @grant       none
// @version     1.2
// @author      -
// @license MIT
// @description 2023/6/27 16:01:17  用于自动执行大数据营销项目提交作业
// @downloadURL https://update.greasyfork.org/scripts/469698/New%20script%20-%2059647878.user.js
// @updateURL https://update.greasyfork.org/scripts/469698/New%20script%20-%2059647878.meta.js
// ==/UserScript==

var script = document.createElement('script');
script.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
document.head.appendChild(script);
console.log("import jq success")

// 在匹配到的页面执行不同的逻辑
if (window.location.href.includes("course")) {
    // 对 http://59.64.78.78/course/*执行的代码逻辑
    console.log("执行闯关")
    var data = new Map();
    data.set("2.2", "import pymysql\n\n# 建立连接对象\nconnection = pymysql.connect(host='59.64.78.76', \n                             port=3306, \n                             user='raa_user', \n                             password='bigdata123', \n                             db='transactions',\n                             charset='utf8mb4')\n\ntry:\n    with connection.cursor() as cursor:\n        # 查询数据表行数\n        sql1 = \"SELECT count(*) FROM flow_data\"\n        # 选取表的前五行\n        sql2 = \"SELECT * FROM flow_data LIMIT 5\"\n\n        cursor.execute(sql1)\n        rows = cursor.fetchall() \n        cursor.execute(sql2)\n        head = cursor.fetchall() \n\nfinally:\n    connection.close()\n\n# 查看数据的行列数\nprint('数据行数为:',rows,'\\n前五行数据为:',head)");

    data.set("2.3", "data =  pd.DataFrame(list(data),columns=['user_id','payment','describe','unix_time'])");

    data.set("3.2", "import pandas as pd\n\n# 查看数据形状\nrows, cols = data.shape\n\nprint(\"数据共有 %s 行，有 %s 列。\" % (rows, cols))\n\n# 查看数据的前五行\nhead = data.head()\n\nprint('\\n',head)\n\n# 查看数据的基本情况\ndata.info(null_counts=True)");

    data.set("3.3", "import pandas as pd\n\n# 计算客户个数\nuser_num =  len(data['user_id'].unique())\nprint(\"客户总数为:\",user_num)\n\n# 计算客户交易次数\nuser_counts =  data['user_id'].value_counts()\nprint(\"每个客户的交易次数为:\\n\",user_counts)");

    data.set("3.4", "import pandas as pd\n\n# 书写正则表达式\npattern =  '^[\\d]{10}$'\n\n# 筛选异常值\noutlier = data[~data['unix_time'].str.match(pattern)]\n\n# 统计不同类型的异常值及其数量\noutlier_counts =outlier['unix_time'].value_counts()\n\nprint(outlier_counts)");

    data.set("3.5", "import pandas as pd\n\n# 去掉交易时间为0的行\ndata =  data.loc[data['unix_time'] != 0]\n\n# 将异常值填补为正常值\ndata.loc[data['unix_time'] == '14 3264000', 'unix_time'] = 1473264000\n\nprint(data.loc[data['unix_time'] == '14 3264000'])\nprint(data.loc[data['unix_time'] == 0])");

    data.set("3.6", "import pandas as pd\n\n# 查看交易金额为'\\N'的行数\nprint(\"交易金额异常的记录共有%s行。\" % (len(data[data['payment'] == '\\\\N'])))\n\n# 去除交易金额为'\\N'的行\ndata = data[data['payment'] != '\\\\N']\n\nprint(data[data['payment'] == '\\\\N'])");

    data.set("3.7", "import pandas as pd\n\n# 筛选describe中有无附言为空的行\ndescribe_null =  data[data['describe'].isnull()]\n\nprint(\"交易附言为空的行共有%s条。\"%  len(describe_null))\nprint(describe_null.head())");

    data.set("3.8", "import pandas as pd\n\n# 时间格式转换\ndata['pay_time'] =  pd.to_datetime(data['unix_time'],unit='s')\n\n# 时区转换\ndata['pay_time'] =  data['pay_time'] + pd.Timedelta(hours=8)\n\nprint(data.tail(5))");
    data.set("3.9", "data['payment'] = data['payment'].apply(lambda x: float(x)/100)\n" +
        "print(data.head())\n");
    data.set("3.10", "import pandas as pd\n\n# 检测重复值\nduplicate_values = data[data.duplicated()]\nprint(\"重复数据有%s行。\"% len(duplicate_values))\n\n# 去掉重复值\ndata.drop_duplicates(inplace=True)\nprint(\"处理之后，交易记录变为%s行。\" % len(data))");
    data.set("4.2", "import pandas as pd\n" +
        "import matplotlib.pyplot as plt\n" +
        "\n" +
        "fig = plt.figure(figsize=(12,6))\n" +
        "\n" +
        "# 绘制折线图\n" +
        "data['pay_time'].dt.date.value_counts().plot()\n" +
        "\n" +
        "# 设置图形标题\n" +
        "plt.title('不同时间的交易次数分布')\n" +
        "\n" +
        "# 设置y轴标签\n" +
        "plt.ylabel('交易次数')\n" +
        "\n" +
        "# 设置x轴标签\n" +
        "plt.xlabel('时间')")
    data.set("4.3", "import pandas as pd\n" +
        "import matplotlib.pyplot as plt\n" +
        "\n" +
        "fig = plt.figure(figsize=(12,6))\n" +
        "\n" +
        "# 绘制折线图\n" +
        "abs(data['payment']).groupby(data['pay_time'].dt.date).sum().plot()\n" +
        "\n" +
        "# 设置图形标题\n" +
        "plt.title('不同时间的交易金额分布')\n" +
        "\n" +
        "# 设置y轴标签\n" +
        "plt.ylabel('交易金额')\n" +
        "\n" +
        "# 设置x轴标签\n" +
        "plt.xlabel('时间')");
    data.set("4.4", "import pandas as pd\n" +
        "\n" +
        "# 时间限定\n" +
        "data = data[(data['pay_time'] <= pd.Timestamp(2018,1,1)) & (data['pay_time'] >= pd.Timestamp(2016,7,1))] \n" +
        "\n" +
        "print(data.shape)\n" +
        "\n" +
        "# 查看数据的前五行\n" +
        "head = data.head()\n" +
        "\n" +
        "print('\\n',head)")
    data.set("4.5", "import pandas as pd\n" +
        "import matplotlib.pyplot as plt\n" +
        "\n" +
        "fig = plt.figure(figsize=(8,6))\n" +
        "\n" +
        "# 绘制条形图\n" +
        "data['pay_time'].dt.hour.value_counts().sort_index().plot.bar(color = 'orange',rot=360)\n" +
        "\n" +
        "# 设置图形标题\n" +
        "plt.title('每天24小时的交易次数分布')\n" +
        "\n" +
        "# 设置x轴标签\n" +
        "plt.xlabel('小时')\n" +
        "\n" +
        "# 设置y轴标签\n" +
        "plt.ylabel('交易次数')\n" +
        "\n" +
        "plt.show()")
    data.set("4.6", "import seaborn as sns\n" +
        "import matplotlib.pyplot as plt\n" +
        "\n" +
        "fig = plt.figure(figsize=(16, 5))\n" +
        "\n" +
        "# 绘制核密度图\n" +
        "sns.kdeplot(data.user_id.value_counts(),shade=True,legend=False)\n" +
        "\n" +
        "# 设置x，y轴标签\n" +
        "plt.xlabel('交易次数')\n" +
        "plt.ylabel('频率')\n" +
        "\n" +
        "# 设置图的标题\n" +
        "plt.title(\"客户交易次数分布\")\n" +
        "\n" +
        "plt.show()")
    data.set("4.7", "import seaborn as sns\n" +
        "import matplotlib.pyplot as plt\n" +
        "\n" +
        "fig = plt.figure(figsize=(16, 5))\n" +
        "\n" +
        "# 绘制核密度图\n" +
        "sns.kdeplot(abs(data.payment).groupby(data['user_id']).mean(),shade=True,legend=False)\n" +
        "\n" +
        "# 设置x，y轴标签\n" +
        "plt.xlabel('平均交易金额')\n" +
        "plt.ylabel('频率')\n" +
        "\n" +
        "# 设置图的标题\n" +
        "plt.title(\"客户平均交易金额的分布\")\n" +
        "\n" +
        "plt.show()")
    data.set("4.8", "import pandas as pd\n" +
        "import matplotlib.pyplot as plt\n" +
        "import seaborn as sns\n" +
        "\n" +
        "fig,[ax1,ax2] = plt.subplots(1,2,figsize=(16, 5))\n" +
        "\n" +
        "# 定义和选取金额流入流出的交易记录\n" +
        "input_payment = data[data['payment'] < 0]\n" +
        "output_payment = data[data['payment'] > 0]\n" +
        "\n" +
        "# 计算每个客户的流入流出次数\n" +
        "input_payment_count = input_payment.groupby('user_id').size()\n" +
        "output_payment_count = output_payment.groupby('user_id').size()\n" +
        "\n" +
        "# 绘制直方图\n" +
        "sns.distplot(input_payment_count,ax=ax1)\n" +
        "sns.distplot(output_payment_count,ax=ax2)\n" +
        "\n" +
        "# 设置标题\n" +
        "ax1.set_title(\"客户交易的流入次数分布\")\n" +
        "ax2.set_title(\"客户交易的流出次数分布\")\n" +
        "\n" +
        "plt.show()")
    data.set("4.9", "import pandas as pd\n" +
        "import matplotlib.pyplot as plt\n" +
        "import seaborn as sns\n" +
        "\n" +
        "# 定义和选取金额流入流出的交易记录\n" +
        "input_payment = data[data['payment'] < 0]\n" +
        "output_payment = data[data['payment'] > 0]\n" +
        "\n" +
        "# 计算每个客户的流入流出金额\n" +
        "input_payment_amount = input_payment.groupby('user_id')['payment'].mean()\n" +
        "output_payment_amount = output_payment.groupby('user_id')['payment'].mean()\n" +
        "\n" +
        "fig,[ax1,ax2] = plt.subplots(1,2,figsize=(16, 5))\n" +
        "\n" +
        "# 绘制直方图\n" +
        "sns.distplot(input_payment_amount,ax=ax1)\n" +
        "sns.distplot(output_payment_amount,ax=ax2)\n" +
        "\n" +
        "# 设置标题\n" +
        "ax1.set_title(\"客户交易的平均流入金额分布\")\n" +
        "ax2.set_title(\"客户交易的平均流出金额分布\")\n" +
        "\n" +
        "plt.show()")
    data.set("4.10", "import pandas as pd\n" +
        "import jieba\n" +
        "\n" +
        "# 数据采样\n" +
        "data = data.sample(20000,random_state = 22)\n" +
        "\n" +
        "# 文本分词\n" +
        "data['describe_cutted'] = data['describe'].apply(lambda x : \" \".join(jieba.cut(x)))\n" +
        "\n" +
        "# 过滤停用词  \n" +
        "def del_stopwords(words):  \n" +
        "    output = ''  \n" +
        "    for word in words:  \n" +
        "        if word not in stopwords:  \n" +
        "            output += word\n" +
        "    return output\n" +
        "\n" +
        "data['describe_cutted'] = data['describe_cutted'].apply(del_stopwords)\n" +
        "\n" +
        "print(data.head())")
    data.set("4.11", "from wordcloud import WordCloud         \n" +
        "import matplotlib.pyplot as plt\n" +
        "\n" +
        "# 数据采样\n" +
        "data = data.sample(20000,random_state = 22)\n" +
        "\n" +
        "# 文本拼接\n" +
        "describe_document = \" \".join(data['describe_cutted'])\n" +
        "\n" +
        "fig = plt.figure(figsize=(20,10))\n" +
        "\n" +
        "# 创建词云对象\n" +
        "wordcloud = WordCloud(background_color = \"white\",\n" +
        "                      font_path = \"FangSong.ttf\",\n" +
        "                      mask = background_Image,\n" +
        "                      collocations = False,\n" +
        "                      scale = 2,\n" +
        "                      random_state = 30)\n" +
        "\n" +
        "# 生成词云\n" +
        "wordcloud.generate(describe_document)\n" +
        "\n" +
        "plt.imshow(wordcloud)\n" +
        "plt.axis(\"off\")\n" +
        "plt.show()");
    data.set("4.12", "import jieba\n" +
        "       \n" +
        "# 提取关键词\n" +
        "tags = jieba.analyse.extract_tags(describe_document,withWeight=True,topK=50)\n" +
        "\n" +
        "# 输出关键词\n" +
        "for tag in tags:\n" +
        "    print(tag)");
    data.set("5.2", "import pandas as pd\n" +
        "\n" +
        "user_features = pd.DataFrame(index = data[\"user_id\"].unique())\n" +
        "\n" +
        "# 计算客户的交易次数\n" +
        "user_features['total_transactions_cnt'] = data.groupby('user_id').size()\n" +
        "\n" +
        "# 计算客户的交易总金额\n" +
        "user_features['total_transactions_amt'] = abs(data.payment).groupby(data['user_id']).sum()\n" +
        "\n" +
        "print(user_features.head())");
    data.set("5.3", "import pandas as pd\n" +
        "\n" +
        "# 提取包含转账行为的记录\n" +
        "transfer = data[data['describe'].str.contains('转账')]\n" +
        "\n" +
        "# 计算客户的转账次数\n" +
        "user_features[\"transfer_cnt\"] = transfer.groupby('user_id').size()\n" +
        "\n" +
        "# 计算客户的转账总金额\n" +
        "user_features[\"transfer_amt\"] =abs(transfer.payment).groupby(transfer[\"user_id\"]).sum()\n" +
        "\n" +
        "# 计算客户的转账平均金额\n" +
        "user_features[\"transfer_mean\"] = abs(transfer.payment).groupby(transfer[\"user_id\"]).mean()\n" +
        "\n" +
        "print(user_features.head())");
    data.set("5.4", "import pandas as pd\n" +
        "\n" +
        "# 选取交易金额大于0的交易记录\n" +
        "consume_info = data[data.payment > 0]\n" +
        "\n" +
        "# 选取包含消费行为的记录\n" +
        "consume = consume_info[~consume_info[\"describe\"].str.contains('转账|提现|转入|还款')]\n" +
        "\n" +
        "# 单次最大消费金额\n" +
        "user_features[\"max_consume_amt\"] = consume.groupby(\"user_id\")['payment'].max()\n" +
        "\n" +
        "# 消费订单比例\n" +
        "user_features[\"consume_order_ratio\"] =  consume.groupby(\"user_id\").size() / user_features['total_transactions_cnt']\n" +
        "\n" +
        "#################### 其余事实类标签提取展示如下 ########################\n" +
        "\n" +
        "# 提取商旅消费的记录\n" +
        "train_bus = consume[consume[\"describe\"].str.contains(\"车票|火车票|机票\")]\n" +
        "travel_hotel = consume[consume[\"describe\"].str.contains(\"住宿|宾馆|酒店|携程|去哪\")]\n" +
        "business_travel = pd.concat([train_bus,travel_hotel])\n" +
        "\n" +
        "# 商旅消费次数\n" +
        "user_features[\"business_travel_cnt\"] = business_travel.groupby(\"user_id\").size()\n" +
        "\n" +
        "# 商旅消费总金额\n" +
        "user_features[\"business_travel_amt\"] = business_travel.payment.groupby(business_travel[\"user_id\"]).sum()\n" +
        "\n" +
        "# 商旅消费平均金额\n" +
        "user_features[\"business_travel_avg_amt\"] = business_travel.payment.groupby(business_travel[\"user_id\"]).mean()\n" +
        "\n" +
        "# 提取公共事业缴费的记录\n" +
        "public = consume_info[consume_info[\"describe\"].str.contains('水费|电费|燃气费')]\n" +
        "\n" +
        "# 公共事业缴费总额\n" +
        "user_features[\"public_pay_amt\"] = public.groupby(\"user_id\")['payment'].sum()\n" +
        "\n" +
        "print(user_features.head())");
    data.set("5.5", "import pandas as pd\n" +
        "\n" +
        "# 计算阈值\n" +
        "threshold =  user_features[\"max_consume_amt\"].quantile(0.75)\n" +
        "\n" +
        "# 判定有无高端消费\n" +
        "user_features[\"high_consumption\"] =  user_features[\"max_consume_amt\"].apply(lambda x : 1 if x > threshold else 0)\n" +
        "\n" +
        "print(user_features.head())");
    data.set("5.6", "import pandas as pd\n" +
        "\n" +
        "# 计算阈值\n" +
        "threshold = user_features[\"total_transactions_cnt\"].quantile(0.25)\n" +
        "\n" +
        "# 判定是否休眠\n" +
        "user_features['sleep_customers'] = user_features[\"total_transactions_cnt\"].apply(lambda x : 1 if x < threshold else 0)\n" +
        "\n" +
        "\n" +
        "print(user_features.head())");
    data.set("5.8", "import pandas as pd\n" +
        "import numpy as np\n" +
        "\n" +
        "# 选取观察点\n" +
        "standard_day = pd.Timestamp(2018,1,1)\n" +
        "\n" +
        "# 计算天数\n" +
        "consume['distance']= standard_day - consume['pay_time']\n" +
        "consume['distance']= consume['distance'] / pd.Timedelta(days=1)  \n" +
        "\n" +
        "print(consume.head(10))");
    data.set("5.9", "import pandas as pd\n" +
        "\n" +
        "# 计算rfm\n" +
        "user_features[['recency','frequency','monetary']] = consume.groupby('user_id').agg({'distance':'min','user_id':'size','payment':'sum'})   \n" +
        "\n" +
        "print(user_features.head())");
    data.set("5.10", "import pandas as pd\n" +
        "\n" +
        "# 等频离散化\n" +
        "user_features['R_score'] = pd.qcut(user_features['recency'],4,labels=[4,3,2,1])   \n" +
        "user_features['F_score'] = pd.qcut(user_features['frequency'],4,labels=[1,2,3,4])\n" +
        "user_features['M_score'] = pd.qcut(user_features['monetary'],4,labels=[1,2,3,4])\n" +
        "\n" +
        "# 填充缺失值\n" +
        "user_features[['R_score','F_score','M_score']] = user_features[['R_score','F_score','M_score']].fillna(1)\n" +
        "\n" +
        "# 计算总得分\n" +
        "user_features['Total_Score'] = user_features.R_score.astype('int') + user_features.F_score.astype('int') + user_features.M_score.astype('int')\n" +
        "\n" +
        "print(user_features.head())");
    data.set("5.11", "import matplotlib.pyplot as plt\n" +
        "\n" +
        "fig,[ax1,ax2,ax3] = plt.subplots(1,3,figsize=(16,4))\n" +
        "\n" +
        "# 绘制条形图\n" +
        "user_features.groupby('Total_Score')['recency'].mean().plot(kind='bar', colormap='Blues_r',ax=ax1, rot=360)\n" +
        "user_features.groupby('Total_Score')['frequency'].mean().plot(kind='bar', colormap='Blues_r',ax=ax2, rot=360)\n" +
        "user_features.groupby('Total_Score')['monetary'].mean().plot(kind='bar', colormap='Blues_r',ax=ax3, rot=360)\n" +
        "\n" +
        "# 设置y轴标签\n" +
        "ax1.set_ylabel('recency')\n" +
        "ax2.set_ylabel('frequency')\n" +
        "ax3.set_ylabel('monetary')\n" +
        "# 自动调整子图间距\n" +
        "plt.tight_layout()\n" +
        "plt.show()\n" +
        "\n");
    data.set("5.12", "import pandas as pd\n" +
        "import pymysql\n" +
        "\n" +
        "# 从数据库读入客户价值等级数据\n" +
        "connection = pymysql.connect(host='59.64.78.76', \n" +
        "                             port = 3306, \n" +
        "                             user = 'raa_user', \n" +
        "                             password = 'bigdata123', \n" +
        "                             db = 'transactions',\n" +
        "                             charset = 'utf8mb4')\n" +
        "\n" +
        "try:\n" +
        "    with connection.cursor() as cursor:\n" +
        "        sql = \"SELECT * FROM user_potential\"\n" +
        "        cursor.execute(sql)\n" +
        "        level = cursor.fetchall() \n" +
        "finally:\n" +
        "    connection.close()\n" +
        "\n" +
        "level=pd.DataFrame(list(level),columns = ['user_id','user_potential'])\n" +
        "\n" +
        "print(level.head())");
    data.set("5.13", "import pandas as pd\n" +
        "\n" +
        "# 对消费渠道进行One-hot编码\n" +
        "user_features_predict = pd.get_dummies(data = user_features_predict,columns = [\"consumption_channel\"],prefix='',prefix_sep='')\n" +
        "\n" +
        "print(user_features_predict.head())");
    data.set("5.14", "import pandas as pd\n" +
        "\n" +
        "# 对网购首单时间进行离散化\n" +
        "user_features_predict['online_buy_first_date'] = pd.cut(user_features_predict['online_buy_first_date'],bins=6,labels=False,duplicates='drop')\n" +
        "\n" +
        "# 对网购最后一次时间进行离散化\n" +
        "user_features_predict['online_buy_last_date'] = pd.cut(user_features_predict['online_buy_last_date'],bins=6,labels=False,duplicates='drop')\n" +
        "\n" +
        "print(user_features_predict[['online_buy_first_date','online_buy_last_date']])");
    data.set("5.15", "import pandas as pd\n" +
        "\n" +
        "# 所有数值为连续型的列\n" +
        "continuous_col = ['max_consume_amt', 'consume_order_ratio', 'mon_consume_frq', 'online_cnt', 'online_amt', 'online_avg_amt', 'mon_online_frq','dining_cnt','dining_amt', 'dining_avg_amt', 'business_travel_cnt','business_travel_amt', 'business_travel_avg_amt', 'mon_business_travel_frq', 'car_cnt', 'car_amt', 'phone_fee_cnt', 'phone_fee_amt', 'credit_card_repay_cnt', 'credit_card_repay_amt','cash_advance_cnt', 'cash_advance_amt', 'payroll','total_transactions_amt', 'total_transactions_cnt', 'withdraw_cnt','withdraw_amt', 'total_deposit', 'total_withdraw', 'transfer_cnt','transfer_amt', 'transfer_mean', 'internet_media_cnt', 'internet_media_amt', 'public_pay_amt', 'return_cnt',  'recency', 'frequency', 'monetary']\n" +
        "\n" +
        "# 对所有连续型数值的列进行等频离散化\n" +
        "user_features_predict[continuous_col] = user_features_predict[continuous_col].apply(lambda x : pd.qcut(x,6,duplicates='drop',labels=False))\n" +
        " \n" +
        "print(user_features_predict.head())");
    data.set("5.16", "import pandas as pd\n" +
        "from sklearn.model_selection import train_test_split\n" +
        "\n" +
        "# 提取有价值等级客户的数据\n" +
        "customers = user_features_predict[user_features_predict[\"user_potential\"].notnull()]\n" +
        "\n" +
        "# 提取X，y\n" +
        "y = customers.user_potential\n" +
        "X = customers.drop(['user_potential'],axis=1)\n" +
        "\n" +
        "# 划分训练集、测试集\n" +
        "x_train, x_test, y_train, y_test = train_test_split(X, y,test_size = 0.2,random_state = 33)\n" +
        "\n" +
        "print(x_train.shape,x_test.shape,y_train.shape,y_test.shape)");
    data.set("5.17", "from sklearn.linear_model import LogisticRegression\n" +
        "from sklearn.metrics import classification_report\n" +
        "\n" +
        "# 设置分类器\n" +
        "clf = LogisticRegression()\n" +
        "\n" +
        "# 训练\n" +
        "clf.fit(x_train, y_train)\n" +
        "\n" +
        "# 预测\n" +
        "y_predict = clf.predict(x_test)\n" +
        "\n" +
        "# 计算准确率\n" +
        "score = clf.score(x_test,y_test)\n" +
        "\n" +
        "# 以百分数形式输出并保留两位小数\n" +
        "print('%.2f%%'%(score*100))\n" +
        "\n" +
        "# 输出分类报告\n" +
        "report = classification_report(y_test,y_predict)\n" +
        "print(report)");
    data.set("5.18", "import pandas as pd\n" +
        "\n" +
        "# 选取价值等级未知的客户数据\n" +
        "null_customers = user_features_predict[user_features_predict[\"user_potential\"].isnull()]\n" +
        "\n" +
        "# 对价值等级未知的客户进行预测\n" +
        "null_customers[\"user_potential\"] = clf.predict(null_customers.drop(['user_potential'],axis=1))\n" +
        "\n" +
        "# 将数据合并在原始表中\n" +
        "user_features['user_potential'] = pd.concat([customers['user_potential'],null_customers['user_potential']],axis=0)\n" +
        "\n" +
        "print(user_features[\"user_potential\"].value_counts())");
    data.set("5.19", "import pandas as pd\n" +
        "import matplotlib.pyplot as plt\n" +
        "\n" +
        "# 计算不同客户价值等级的客户数量\n" +
        "lmt_num = user_features[\"user_potential\"].value_counts()\n" +
        "\n" +
        "fig = plt.figure(figsize=(8,6))\n" +
        "\n" +
        "# 绘制柱状图，查看客户价值等级取值分布情况\n" +
        "lmt_num.plot(kind = \"bar\",rot=360,width = 0.15)\n" +
        "\n" +
        "# 设置柱形名称\n" +
        "plt.xticks([0,1],['低价值','高价值'])\n" +
        "\n" +
        "# 设置x、y轴标签\n" +
        "plt.ylabel(\"客户数量\")\n" +
        "plt.xlabel(\"客户价值等级\")\n" +
        "\n" +
        "# 设置标题\n" +
        "plt.title(\"客户价值等级分布图\")\n" +
        "\n" +
        "plt.show()");
    data.set("5.20", "import seaborn as sns\n" +
        "import matplotlib.pyplot as plt\n" +
        "\n" +
        "# 取所有标签的后15列\n" +
        "last_features = user_features.iloc[:,-15:]\n" +
        "\n" +
        "# 计算各标签间的皮尔森相关系数\n" +
        "corr =  abs(last_features.corr())\n" +
        "\n" +
        "fig = plt.figure(figsize = (10,10))\n" +
        "\n" +
        "# 设置颜色风格\n" +
        "cmap = sns.cubehelix_palette(8, start = 2, rot = 0, dark = 0, light =0.95)\n" +
        "\n" +
        "# 绘制热力图\n" +
        "sns.heatmap(corr,annot = True, linewidths = 0.05,cmap = cmap)\n" +
        "\n" +
        "plt.show()");
    data.set("5.21", "import pandas as pd\n" +
        "import matplotlib.pyplot as plt\n" +
        "\n" +
        "# 计算交叉表\n" +
        "counts = pd.crosstab(user_features[\"high_consumption\"],user_features[\"user_potential\"])\n" +
        "\n" +
        "# 重命名索引和列名\n" +
        "counts.index = [\"无高端消费\",\"有高端消费\"]\n" +
        "counts.columns= [\"低价值客户\",\"高价值客户\"]\n" +
        "\n" +
        "fig = plt.figure(figsize=(8,6))\n" +
        "\n" +
        "# 绘制柱状图\n" +
        "counts.plot(kind =\"bar\",rot = 360,width = 0.3)\n" +
        "\n" +
        "# 设置x、y轴标签\n" +
        "plt.ylabel(\"人数\")\n" +
        "plt.xlabel(\"有无高端消费\")\n" +
        "\n" +
        "# 设置标题\n" +
        "plt.title(\"客户价值等级与是否拥有高端消费之间的关系\")\n" +
        "plt.show()");
    data.set("5.22", "import pandas as pd\n" +
        "import seaborn as sns\n" +
        "import matplotlib.pyplot as plt\n" +
        "\n" +
        "# 设置画布大小\n" +
        "fig = plt.figure(figsize=(8,6))\n" +
        "\n" +
        "# 绘制月均消费频度的取值分布直方图\n" +
        "sns.distplot(user_features['mon_consume_frq'],color='pink')\n" +
        "\n" +
        "# 设置标题\n" +
        "plt.title(\"月均消费频度取值分布\")\n" +
        "\n" +
        "# 设置x轴标签\n" +
        "plt.xlabel(\"月均消费频度\")\n" +
        "\n" +
        "\n" +
        "plt.show()");
    data.set("5.23", "import pandas as pd\n" +
        "import matplotlib.pyplot as plt\n" +
        "\n" +
        "# 将月均消费频度取值划分到不同区间\n" +
        "frq_range = pd.cut(user_features['mon_consume_frq'],[0,15,30,45,60,75],right = False)\n" +
        "\n" +
        "# 计算交叉表\n" +
        "counts = pd.crosstab(frq_range,user_features['user_potential'])\n" +
        "\n" +
        "# 重命名列名\n" +
        "counts.columns = [\"低价值客户\",\"高价值客户\"]\n" +
        "\n" +
        "fig = plt.figure(figsize = (8,6))\n" +
        "\n" +
        "# 绘制柱状图\n" +
        "counts.plot(kind =\"bar\",rot = 360,width = 0.7)\n" +
        "\n" +
        "# 设置x、y轴标签\n" +
        "plt.ylabel(\"人数\")\n" +
        "plt.xlabel(\"月均消费频度\")\n" +
        "\n" +
        "# 设置标题\n" +
        "plt.title(\"客户价值等级与月均消费频度的关系\")\n" +
        "\n" +
        "plt.show()");
    data.set("5.25", "import pandas as pd\n" +
        "\n" +
        "## 分组合并交易附言\n" +
        "describe_sum = data.groupby(\"user_id\")['describe_cutted'].sum()\n" +
        "\n" +
        "print(describe_sum)");
    data.set("5.26", "import pandas as pd\n" +
        "from sklearn.feature_extraction.text import CountVectorizer\n" +
        "\n" +
        "# 建立CountVectorizer模型\n" +
        "count_vec = CountVectorizer(stop_words=stop_words_list,min_df=5,max_df=5000,max_features=100) \n" +
        "\n" +
        "# 计算词频矩阵\n" +
        "sparse_result_count = count_vec.fit_transform(describe_sum) \n" +
        "\n" +
        "# 输出稀疏矩阵\n" +
        "print(sparse_result_count)\n" +
        "\n" +
        "# 输出关键词\n" +
        "print('\\nvocabulary list:\\n\\n',count_vec.get_feature_names())\n" +
        "\n" +
        "# 输出关键词编号\n" +
        "print('\\nvocabulary dic:\\n\\n',count_vec.vocabulary_)");
    data.set("5.27", "import pandas as pd\n" +
        "from sklearn.feature_extraction.text import TfidfVectorizer\n" +
        "\n" +
        "# 建立TfidfVectorizer模型\n" +
        "tfidf_vec=TfidfVectorizer(stop_words=stop_words_list,min_df=5,max_df=5000,max_features=100) \n" +
        "\n" +
        "# 计算tfidf矩阵\n" +
        "sparse_result_tfidf = tfidf_vec.fit_transform(describe_sum) \n" +
        "\n" +
        "# 输出稀疏矩阵\n" +
        "print(sparse_result_tfidf)\n" +
        "\n" +
        "# 输出关键词\n" +
        "print('\\nvocabulary list:\\n\\n',tfidf_vec.get_feature_names())\n" +
        "\n" +
        "# 输出关键词编号\n" +
        "print( '\\nvocabulary dic :\\n\\n',tfidf_vec.vocabulary_)\n" +
        "\n" +
        "# 与user_features表进行合并\n" +
        "user_features = pd.concat([user_features,pd.DataFrame(sparse_result_tfidf.toarray(),index = user_features.index)],axis=1)\n" +
        "\n" +
        "# 输出合并后user_features表的行列数\n" +
        "print('\\n合并后客户标签表的行列数为:\\n\\n',user_features.shape)\n" +
        "\n" +
        "# 重命名列名\n" +
        "columns_mapping = {value:key for key, value in tfidf_vec.vocabulary_.items()}\n" +
        "user_features.rename(columns = columns_mapping,inplace=True)\n" +
        "\n" +
        "# 输出重命名后user_features表的列名\n" +
        "print('\\n合并后客户标签表的列名为:\\n\\n',user_features.columns.values)");
    data.set("5.28", "from wordcloud import WordCloud         \n" +
        "import matplotlib.pyplot as plt\n" +
        "\n" +
        "# 选取文本\n" +
        "describe_selected = describe_sum[user_features['total_transactions_cnt'].idxmax()]\n" +
        "\n" +
        "fig = plt.figure(figsize=(10,10))\n" +
        "\n" +
        "# 绘制词云图\n" +
        "wordcloud = WordCloud(background_color=\"white\", \n" +
        "                      mask = background_male,\n" +
        "                      stopwords = stop_words,\n" +
        "                      font_path = \"SimHei.ttf\",\n" +
        "                      collocations = False,\n" +
        "                      scale = 4,\n" +
        "                      random_state = 30)\n" +
        "\n" +
        "# 生成词云\n" +
        "wordcloud.generate(describe_selected)\n" +
        "\n" +
        "plt.imshow(wordcloud)\n" +
        "plt.axis(\"off\")\n" +
        "plt.show()");
    data.set("5.29", "import pandas as pd\n" +
        "\n" +
        "# 选取存放文本标签词频的行和列\n" +
        "tfidf_features = user_features.loc[10014615][-100:]\n" +
        "\n" +
        "# 选取出现最多的前20个交易附言关键词\n" +
        "top_describe = tfidf_features.sort_values(ascending = False)[:20]\n" +
        "\n" +
        "print(top_describe)");
    data.set("5.30", "import pandas as pd\n" +
        "\n" +
        "# 查看该客户的数值标签\n" +
        "number_feature =  user_features.loc[10014615][0:50]\n" +
        "\n" +
        "print(number_feature)");
    data.set("5.31", "from wordcloud import WordCloud         \n" +
        "import matplotlib.pyplot as plt\n" +
        "\n" +
        "# 选取文本\n" +
        "describe_selected = describe_sum[12521063]\n" +
        "\n" +
        "fig = plt.figure(figsize=(10,10))\n" +
        "\n" +
        "# 创建词云对象\n" +
        "wordcloud = WordCloud(background_color=\"white\", \n" +
        "                      mask = background_female,\n" +
        "                      stopwords = stop_words,\n" +
        "                      font_path = \"SimHei.ttf\",\n" +
        "                      collocations = False,\n" +
        "                      scale = 4,\n" +
        "                      random_state = 30)\n" +
        "\n" +
        "# 生成词云\n" +
        "wordcloud.generate(describe_selected)\n" +
        "\n" +
        "plt.imshow(wordcloud)\n" +
        "plt.axis(\"off\")\n" +
        "plt.show()");
    data.set("5.32", "import pandas as pd\n" +
        "\n" +
        "# 选取存放文本标签词频的行和列\n" +
        "tfidf_features = user_features.loc[12521063][-100:]\n" +
        "\n" +
        "# 选取出现最多的前20个交易附言关键词\n" +
        "top_describe = tfidf_features.sort_values(ascending = False)[:20]\n" +
        "\n" +
        "print(top_describe)");
    data.set("5.33", "import pandas as pd\n" +
        "\n" +
        "# 查看该客户的数字特征\n" +
        "number_feature = user_features.loc[12521063][0:50]\n" +
        "\n" +
        "print(number_feature)");
    data.set("6.3", "import pandas as pd\n" +
        "\n" +
        "# 选取观察点\n" +
        "standard_day = pd.Timestamp(2018,1,1)\n" +
        "\n" +
        "# 计算月数\n" +
        "consume['distance']= (standard_day - consume['pay_time'])/ pd.Timedelta(days=30)\n" +
        "\n" +
        "print(consume.head(2))");
    data.set("6.4", "import numpy as np\n" +
        "import pandas as pd\n" +
        "\n" +
        "eta = 0.5\n" +
        "text_list = '停彩|大乐透|双色球|福利彩票|彩票|竞彩|追号'\n" +
        "\n" +
        "# 筛选彩票类的消费记录\n" +
        "lottery_ticket = consume[consume['describe'].str.contains(text_list)]\n" +
        "\n" +
        "# 基于时间的商品兴趣度\n" +
        "user_features['time_penalty'] =  lottery_ticket.groupby('user_id')['distance'].agg(lambda x:sum(np.exp(-eta*x)))\n" +
        "\n" +
        "print(user_features['time_penalty'].head())");
    data.set("6.5", "import numpy as np\n" +
        "import pandas as pd\n" +
        "\n" +
        "text_list = '停彩|大乐透|双色球|福利彩票|彩票|竞彩|追号'\n" +
        "\n" +
        "# 筛选彩票类的消费记录\n" +
        "lottery_ticket = consume[consume['describe'].str.contains(text_list)]\n" +
        "\n" +
        "# 计算消费金额\n" +
        "user_features['payment_sum'] = lottery_ticket.groupby('user_id')['payment'].sum()\n" +
        "\n" +
        "\n" +
        "print(user_features['payment_sum'].head())");
    data.set("6.6", "import pandas as pd\n" +
        "\n" +
        "# 选取字段\n" +
        "lottery_tfidf = user_features[['停彩','大乐透','双色球','福利彩票','彩票','竞彩','追号']]\n" +
        "\n" +
        "# tfidf求和\n" +
        "user_features['tfidf_sum'] =  lottery_tfidf.sum(axis=1)\n" +
        "\n" +
        "print(user_features['tfidf_sum'].head(100))");
    data.set("6.7", "import pandas as pd\n" +
        "import numpy as np\n" +
        "\n" +
        "# sigmoid归一化\n" +
        "user_features['time_penalty'] = user_features[['time_penalty']].apply(lambda x:1/(1+np.exp(-x)))\n" +
        "\n" +
        "# min-max归一化\n" +
        "user_features['payment_sum'] = user_features[['payment_sum']].apply(lambda x:(x - x.min())/(x.max()-x.min()))\n" +
        "user_features['tfidf_sum'] = user_features[['tfidf_sum']].apply(lambda x:(x - x.min())/(x.max()-x.min()))\n" +
        "\n" +
        "print(user_features[['time_penalty','payment_sum','tfidf_sum']].head(10))");
    data.set("6.8", "import pandas as pd\n" +
        "\n" +
        "# 计算final_score\n" +
        "user_features['final_score'] = user_features['tfidf_sum'] + user_features['time_penalty'] + user_features['payment_sum']\n" +
        "\n" +
        "# top10\n" +
        "top10 = user_features.sort_values('final_score',ascending=False).head(10)\n" +
        "\n" +
        "print(top10[['time_penalty','payment_sum','tfidf_sum','final_score']])");
    data.set("6.9", "import pandas as pd\n" +
        "import matplotlib.pyplot as plt\n" +
        "import numpy as np\n" +
        "import matplotlib.dates as mdates\n" +
        "\n" +
        "text_list = '停彩|大乐透|双色球|福利彩票|彩票|竞彩|追号'\n" +
        "\n" +
        "# 选择排名前3的user_id\n" +
        "top3 = top10.index.values[:3]\n" +
        "\n" +
        "# 不同ID的客户用不同的线段表示\n" +
        "styles=['--','-',\":\"]\n" +
        "\n" +
        "fig = plt.figure(figsize=(15,6))\n" +
        "\n" +
        "# 绘制折线图\n" +
        "for user_id,style in zip(top3,styles):\n" +
        "    # 筛选用户的交易记录\n" +
        "    top_select = consume.loc[consume['user_id'] == user_id]\n" +
        "    # 匹配文本关键词\n" +
        "    top_select = top_select[top_select['describe'].str.contains(text_list)]\n" +
        "    # 按天分组，计算交易次数并绘图\n" +
        "    top_select.groupby(top_select['pay_time'].dt.date).size().plot(style=style)\n" +
        "\n" +
        "# 设置标题\n" +
        "plt.title('彩票交易次数变化')\n" +
        "\n" +
        "# 设置x,y轴标签\n" +
        "plt.xlabel('日期')\n" +
        "plt.ylabel('交易次数')\n" +
        "\n" +
        "# 设置图例\n" +
        "plt.legend(labels=['第1名', '第2名','第3名'])\n" +
        "\n" +
        "\n" +
        "# 设置日期显示格式\n" +
        "plt.gca().xaxis.set_major_formatter(mdates.DateFormatter('%Y-%m-%d'))\n" +
        "\n" +
        "plt.show()");
    data.set("6.10", "import pandas as pd\n" +
        "import matplotlib.pyplot as plt\n" +
        "import numpy as np\n" +
        "import matplotlib.dates as mdates\n" +
        "\n" +
        "text_list = '停彩|大乐透|双色球|福利彩票|彩票|竞彩|追号'\n" +
        "\n" +
        "# 选择排名前3的user_id\n" +
        "top3 = top10.index.values[:3]\n" +
        "\n" +
        "\n" +
        "# 不同ID的客户用不同的线段表示\n" +
        "styles = ['--','-',\":\"]\n" +
        "\n" +
        "fig = plt.figure(figsize=(15,6))\n" +
        "\n" +
        "# 绘制折线图\n" +
        "for user_id,style in zip(top3,styles):\n" +
        "    # 筛选用户的交易记录\n" +
        "    top_select = consume.loc[consume['user_id'] == user_id]\n" +
        "    # 匹配文本关键词\n" +
        "    top_select = top_select[top_select['describe'].str.contains(text_list)]\n" +
        "    # 按天分组，计算交易金额并绘图\n" +
        "    top_select.groupby(top_select['pay_time'].dt.date)['payment'].sum().plot(style = style)\n" +
        "\n" +
        "# 设置标题\n" +
        "plt.title('彩票交易金额变化')\n" +
        "\n" +
        "# 设置x,y轴标签\n" +
        "plt.xlabel('日期')\n" +
        "plt.ylabel('消费金额')\n" +
        "\n" +
        "# 设置图例\n" +
        "plt.legend(labels=['第1名', '第2名','第3名'])\n" +
        "\n" +
        "\n" +
        "# 设置日期显示格式\n" +
        "plt.gca().xaxis.set_major_formatter(mdates.DateFormatter('%Y-%m-%d'))\n" +
        "\n" +
        "plt.show()");
    data.set("6.11", "import pymysql\n" +
        "import pandas as pd\n" +
        "\n" +
        "# 构建连接对象\n" +
        "connection = pymysql.connect(host='59.64.78.76', \n" +
        "                              port=3306, \n" +
        "                             user='raa_user', \n" +
        "                             password='bigdata123', \n" +
        "                             db='transactions',\n" +
        "                             charset='utf8mb4',\n" +
        "                             cursorclass=pymysql.cursors.DictCursor)\n" +
        "\n" +
        "try:\n" +
        "    with connection.cursor() as cursor:\n" +
        "        sql = \"SELECT * FROM user_features \\\n" +
        "        WHERE business_travel_cnt > 0 AND credit_card_repay_cnt > 0 \\\n" +
        "        AND is_installment = 1 AND sleep_customers = 0\\\n" +
        "        ORDER BY credit_card_repay_cnt DESC LIMIT 200\"        \n" +
        "        cursor.execute(sql)\n" +
        "        collected_users = cursor.fetchall() \n" +
        "\n" +
        "finally:\n" +
        "    connection.close()\n" +
        "\n" +
        "# 查看筛选出的客户信息\n" +
        "collected_users = pd.DataFrame(collected_users)\n" +
        "print(collected_users[['user_id','business_travel_cnt','credit_card_repay_cnt']])");
    data.set("6.12", "");
    data.set("6.13", "");
    data.set("6.14", "");
    data.set("6.15", "");
    data.set("6.16", "");
    data.set("6.17", "");
    data.set("6.17", "");
    data.set("6.17", "");
    data.set("6.17", "");
    data.set("6.17", "");
    data.set("6.17", "");

    function f() {
        //获得标题
        var title = $('.s-title1').find('span').text().toString().split(' ')[0]


        // 获取按钮元素
        const button = document.querySelector('.dir-right');
        try {
            editor_user.setValue(data.get(title))
            //提交
            $('.code-btn.submit-code-btn.rf').click();
            console.log("submit text success")
        } catch (error) {
            //下一页
            // 模拟点击按钮
            button.click();
            console.log("end success")


        }
        //等待提交
        setTimeout(() => {
            console.log('10 seconds later');
            //下一页
            // 模拟点击按钮
            button.click();
            console.log("end success")
        }, 10000);

    }

    f();


} else if (window.location.href.includes("report")) {
    // 对  http://59.64.78.78/report/create_report/执行的代码逻辑
    console.log("执行导入课程报告的逻辑");

    var data = new Map();
    data.set("0", "dataframe格式； 首先我们先将数据表中的数据进行全部读取，但是目前的数据是以嵌套元组的形式存储，所以我们需要先将数据转换为pandas内置的DataFrame对象，才能进行后续操作。");
    data.set("1", "unix_time中异常值主要有两种。 一种是unix_time为0，一种是中间空缺一位。对data中交易时间为0的数据进行去除，保留非0的行，然后重新赋值给data。然后中间空位的异常值将空缺处补为7，然后生成时间戳。对数据预处理得到高质量数据，便于后续的数据分析。");
    data.set("2", "通过折线分布图可以看出交易的发生时间主要集中在2016年7月-2017年12月，和交易次数的分布类似，大部分的交易金额也主要集中在2016年7月-2017年12月。在项目中，已经将unix时间戳转换为了标准时间格式并进行了时区转换。");
    data.set("3", "通过图可以看到，大部分交易的时间集中在0点附近，这可能是金融机构进行清算的时间段；凌晨1点至7点交易数量较少，因为客户主要在睡觉，其他时间段交易数量分布较为均衡");
    data.set("4", "客户交易次数0-7000不等，分布主要集中在0-1000中；平均交易跨度金额较大，分布主要集中在0- 10000，呈长尾分布，目测在0-4000区间内最多。");
    data.set("5", "通过观察词云，可以看到文本内容主要集中在消费、转账、购物等方向。在之后构建客户标签体系和 画像时，可以着重从这些方面对目标客户进行刻画，并可以分布其中的规律通过观察词云，可以看到 文本内容主要集中在消费、转账、购物等方向。在之后构建客户标签体系和画像时，可以着重从这些 方面对目标客户进行刻画，并可以分布其中的规律。");
    data.set("6", "通过客户交易数据的深度挖掘构建客户标签体系，对客户进行精准画像。 我们从交易属性、消费偏 好、行为特征三个维度构建客户标签体系。事实类标签可以直接从客户交易记录中进行统计和计算。 例如网购消费、餐饮消费、商旅消费等。从原始数据data中提取客户标签，保存在user_features中。 每一行代表一个客户，然后提取标签即可。");
    data.set("7", "有无高端消费可以初步评断客户可支配收入的大小，随着客户可支配收入的提高，客户的消费偏好可能会发生变化。比如对某些中高档商品的购买和消费量会增加，对低档消费品的需求减少，因此我们 可以在这里对是否有高端消费进行定义，作为用户的标签");
    data.set("8", "休眠用户就是指那些已经了解企业和产品，却还在消费和不消费之中徘徊的客户。可以通过精准营销的方式激活休眠客户，通过对客户交易数据的深度挖掘，构建全面的客户标签体系，对客户进行精准画像，从而在产品营销中准确高效的定位给用户推荐他们想要的 。");
    data.set("9", "随着total_score的增大，recency的平均值逐渐减小，印证了较优质客户群体最近一次消费也普遍较近。随着total_score的增大，frequency和monetary的平均值逐渐增大，也印证了越优质的客户群体消费频率和消费金额也普遍较高。总体比较合理，此外消费金额也可以验证帕雷托法则（80%的消费来自于20%的顾客），从图中可以得知排名20%的顾客所花费的金额真的占平台所有消费额的60%-    80% .");
    data.set("10", "消费渠道标签统计客户在哪个平台拥有最多的交易记录，取值包括alipay，wepay，unionpay，creditcardpay和otherspay。针对这一字符型标签，对数值编码，方便模型进行运算。并通过one-hot编码将消费渠道consumption_channel转换为五个二元标签支付宝alipay，微信支付wepay，银联支付unionpay，信用卡支付creditcardpay和其他支付otherspay。");
    data.set("11", "日期等距离散化，之前提取的标签中有两个时间类标签，分别是网购首单时间和最近一次网购时间， 我们按照相同时间跨度将数据划分为6等份，设置labels为false，删除bin边缘的非唯一值。对user_features_predict中取值为连续型数值的列continuous_col进行等频离散化。");
    data.set("12", "模型预测正确率为72%，针对两种用户（1高价值客户2低价值客户）而言高价值用户的准确率accuracy、精度precision、召回率recall、F1值f1score都相比较高。");
    data.set("13", "在无高端消费的人群中，高价值等级客户占比比较小；在有高端消费的人群中，高价值登记客户占比 更多；说明客户价值等级高的群体更倾向于买贵的物品。右图不论客户等级，其月均消费频度在    [0，15]区间内占比比较多，在月均消费频度较低的区间内，低价值客户占比相比较多；在月均消费频度较高的区间内，高价值客户占比逐渐提升，说明高价值客户偏向于有更多的消费需求。我觉得比较合理，高价值用户经常会通过刷手机进行网购，所以会有以下现象。");
    data.set("14", "在客户交易行为分析的环节中，已经使用了python中的jieba中文分词包中的analyse.extract_tags方法 尝试了关键词提取，确定标签建立的大致方向。现在我们要提取文本中的商品特征，来分析客户群 体，使用sklearn中的文本抽取类尝试进行关键词提取。");
    data.set("15", "通过两种模型提取出的文本关键词（标签）是一样的，从文本标签进行分类大致可以描绘出不同的对 应人群，得到了7种不同的消费人群特点。以后的用户画像可以通过现有的其中人群特点进行初步分 类。");
    data.set("16", "从词云图中可以看出，其中出现了很多护肤品和化妆品类的词汇，如洗面奶、控油、波斯顿等等，可 以大致推断出该用户经常接触此类产品。");
    data.set("17", "从交易附言关键词来看，其中专柜、男士、保湿相关关键词比较多，推测该客户为一位淘宝男士护肤 品买家；卡通、儿童、宝宝这类的关键词推测用户是一位关注儿童用品的客户，还有一些日常生活需 求相关的关键词，主要是穿衣需求。");
    data.set("18", "从词云图中可以看出，其中出现了很多儿童宝宝女士男士，夏季加厚等各个季节，包括衣物护肤品沙 发都有相关搜索关键词等等，可以大致推断出该用户经常接触此类产品。");
    data.set("19", "从客户交易附言关键词可以看出，淘宝购物内容居多。从衣物到护肤品，种类丰富，推测该用户是一 位网购深度用户。该客户的义务购买信息也较为丰富，男士、女士、儿童均有覆盖，四季衣物也均有 涉猎，其中也有婴儿儿童这一系列字样，推测该客户是刚生孩子不久的已婚女性。");
    data.set("20", "根据text_list使用词匹配方法找出consume的交易附言列中消费记录，保存在dataframe对象lottery_ticket种，所有消费数据consume已预先读入，然后根据公式计算每个客户基于时间的商品兴趣度。对消费数据按照客户进行分组，对时间差按照时间衰减公式进行聚合计算，再将结果保存。");
    data.set("21", "首先提取出彩票类消费的交易记录，使用文本匹配的方法，匹配出相对应的交易记录。接着按每个客 户进行分组，将每个客户的消费金额进行相加，计算每个客户对彩票类商品的基于消费金额的商品兴 趣度。");
    data.set("22", "排名第一的客户消费时间主要集中在2016年9月-2017年9月，排名第二的客户彩票消费距离观察点很 近，排名第三的客户在2017年5月出现一个交易次数峰值。第一名虽然在时间维度和消费次数上都不 占优势，但是明显可以看出该客户的消费金额远远高于第二第三名，2016年10月有一次消费超过了 10000元；第二名次数远少于第三名，且消费金额基本持平，但在时间维度上占有很大的优势，所以 综合得分超过第三名。");
    data.set("23", "主要包括两个方法，一个是构建客户商品兴趣度排行榜，一个是筛选固定特点的客户。两个各有所 长，一个是根据特点找客户一个是根据用户构建特点。");
    data.set("24", "1、项目目的：解决了什么样的实际问题？ 通过对海量交易流水数据的深度分析和挖掘，构建全方位的客 户标签体系。基于客户标签体系，从基本信息消费能力等多个维度对客户进行精准画像。计算客户商 品兴趣度排行榜，支持精准目标客户筛选。 2、项目流程：项目的总体执行流程是怎样的？数据预处理 （交易时间的时区转换、交易金额的缺失值处理、交易附言异常值处理），客户交易行为分析（可视 化处理，时间序列分析，文本关键词分析），客户标签体系构建（数值标签的提取，文本标签的提 取，标签效果的而评估），精准营销应用（达人排行榜，目标客户筛选）。 3、 数据预处理：对客户交易数 据进行了怎样的处理？ 交易时间的时区转换、交易金额的缺失值处理、交易附言异常值处理 客户交易 行为分析：从哪些维度对客户的交易数据进行了探索？有什么初步的结论？ 可视化处理，时间序列分 析，文本关键词分析。发现交易的主要集中在2016年7月-2017年12月，主要集中在消费转账购物等方 面。 4、客户标签体系构建：使用了哪些标签构建客户标签体系？分析用户画像有什么结论？ 事实类标 签，规则类标签，预测类标签，文本类标签，可以通过不同的标签对用户进行画像并且分类 5、精准营销 应用：使用了哪些方法进行精准营销？有哪些应用场景？ 商品兴趣度排行榜构建，目标客户筛选，如 果需要根据客户对商品的兴趣度排名进行营销可以选择第一种，如果筛选满足固定特点的群体进行营 销则选择第二种。 6、项目结论：通过此项目，自己可以得到那些结论？怎样通过大数据技术云计算能力从细分类中抓取特征，并于买家匹配生成个性化兴趣点，通过个性化推荐，实现精准营销。");
    data.set("25", "本次实训项目极大提高了对于Python编程能力的要求，使我对于Python编程有了更加深刻的认识。在项目过程中我遇到过许多提交报错的问题，但这些问题大都集中于Python代码不规范的小错误上，也就是说在编码细节上还需要继续去提升，保证Python编码规范。本次综合实训大体掌握了大数据精准营销策略的基本过程，学习了如何创建标签进行分类，从数据源首先进行数据预处理，并且对客户交易进行分析。在实践过程中强化词云使用方法，利用jieba库进行关键词提取，使用大量标签计算，对前面进行强化记忆训练，添加新内容，离散化时需要大量数据分析，可以将各个数据放到其区间内，学会使用客户标签相关性。本次综合实训也为以后的大数据学习提供了宝贵经验，使我对于大数据分析过程有了更全面的认识。");

// 选中页面的所有textarea
    var textareas = $("textarea");
    var i = 0;
// 遍历所有textarea并输出内容
    textareas.each(function () {
        $(this).val(data.get((i++).toString()))
    });


}
